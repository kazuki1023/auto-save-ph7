'use server';

import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

import { getSession } from '@/lib/auth';
import { getTimeMaxISO, getTimeMinISO } from '@/lib/date';
import {
  analyzeScheduleConflicts,
  handleConflictByType,
} from '@/lib/date/conflict';

export async function getGoogleCalendarSchedule(dateStr: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const oauth2Client = new OAuth2Client({
    credentials: {
      access_token: session.google?.accessToken ?? '',
    },
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: getTimeMinISO(dateStr),
    timeMax: getTimeMaxISO(dateStr),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
    eventTypes: ['default'],
  });

  return res.data.items;
}

// メイン処理関数
export async function checkAnswerSchedule(
  candidates: Array<{ start: string; end: string; index: number }>
) {
  const results = [];

  for (const candidate of candidates) {
    try {
      // 候補日の予定を取得
      const dateStr = candidate.start.split('T')[0];
      const events = await getGoogleCalendarSchedule(dateStr);

      // 重複状況を分析
      const analysis = analyzeScheduleConflicts(
        candidate.start,
        candidate.end,
        events || []
      );

      // 分類に応じて処理
      const result = handleConflictByType(
        analysis.type,
        analysis.conflictingEvents
      );

      results.push({
        index: candidate.index,
        start: candidate.start,
        end: candidate.end,
        ...result,
      });
    } catch (error) {
      console.error(`候補 ${candidate.index} の処理でエラー:`, error);
      // エラーの場合はデフォルトで参加可能とする
      results.push({
        index: candidate.index,
        start: candidate.start,
        end: candidate.end,
        response: 'good' as const,
        comment: '予定の取得に失敗しましたが、参加可能として設定します',
      });
    }
  }

  return results;
}
