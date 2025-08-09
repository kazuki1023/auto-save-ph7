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
    throw new Error('ユーザーがログインしていません');
  }

  if (!session.google?.accessToken) {
    throw new Error('Google認証トークンが見つかりません');
  }

  const oauth2Client = new OAuth2Client({
    credentials: {
      access_token: session.google.accessToken,
      refresh_token: session.google.refreshToken,
    },
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 401 || error.message?.includes('Invalid Credentials')) {
      throw new Error('Google認証が無効です。再度ログインしてください。');
    }
    throw error;
  }
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
