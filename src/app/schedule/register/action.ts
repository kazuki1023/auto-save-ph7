'use server'

import { getSession } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { getTimeMinISO, getTimeMaxISO } from "@/lib/date";
import { DummySchedule } from "@/const/dummy_scedule";
import { getModel } from "@/lib/ai/model";

import { generateObject } from 'ai'
import { z } from 'zod'

export async function getGoogleCalendarSchedule(dateStr: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const oauth2Client = new OAuth2Client({
    credentials: {
      access_token: session.google?.accessToken ?? "",
    }
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: getTimeMinISO(dateStr),
    timeMax: getTimeMaxISO(dateStr),
    maxResults: 100,
    singleEvents: true,
    orderBy: "startTime",
    eventTypes: ["default"],
  });

  return res.data.items;
}

export async function checkSchedule(dummy_schedule: DummySchedule[], searchCondition: string) {
  const allEvents = [];
  for (const schedule of dummy_schedule) {
    const events = await getGoogleCalendarSchedule(schedule.date);
    allEvents.push(...(events ?? []));
  }

  const checkSchedule = await generateObject({
    model: getModel(),
    schema: z.object({
      schedule: z.array(z.object({
        schedule_id: z.number().describe("candidate slotのid"),
        date: z.string().describe("candidate slotの日付"),
        start_time: z.string().describe("candidate slotの開始時間"),
        end_time: z.string().describe("candidate slotの終了時間"),
        option: z.enum(["参加", "途中参加", "途中退出", "不参加"]).describe("候補日程とカレンダーの予定を比較した結果"),
        reason: z.string().describe("候補日程とカレンダーの予定を比較した結果の理由")
      })),
    }),
    prompt: `You are a scheduling expert.

You are given a list of candidate time slots for a meeting and a personal calendar.
For each candidate slot, compare it with the existing calendar events and choose one of the following options:
Attend, Join Late, Leave Early, or Not Attend.

Please strictly follow these rules:

1. If there are no calendar events within 1 hour before or after the candidate slot, you must choose 「参加」.

2. If the candidate slot overlaps partially with a calendar event, and the calendar event starts before and ends before the candidate slot ends, choose 「途中参加」.

3. If the candidate slot overlaps partially with a calendar event, and the candidate slot starts before and ends before the calendar event ends, choose 「途中退出」.

4. If the candidate slot is completely overlapped by a calendar event, choose 「不参加」.

Finally, provide a reason for your choice.

--- Example ---

### input
candidate slot:
  [  
    {
      id: 1,
      date: "2025-04-23",
      start_time: "10:00",
      end_time: "11:00",
    },
    {
      id: 2,
      date: "2025-04-24",
      start_time: "10:00",
      end_time: "17:00",
    },
    {
      id: 3,
      date: "2025-04-29",
      start_time: "14:00",
      end_time: "17:00",
    },
    {
      id: 4,
      date: "2025-04-30",
      start_time: "14:00",
      end_time: "17:00",
    },
  ]

calendar:
  [
    {
      summary: "旅行",
      start: { date: '2025-04-23' },
      end: { date: '2025-04-24' },
    },
    {
      summary: "輪読会",
      start: { dateTime: '2025-04-29T19:00:00+09:00', timeZone: 'Asia/Tokyo' },
      end: { dateTime: '2025-04-29T22:00:00+09:00', timeZone: 'Asia/Tokyo' },
    },
    {
      summary: "1on1",
      start: { dateTime: '2025-04-30T16:00:00+09:00', timeZone: 'Asia/Tokyo' },
      end: { dateTime: '2025-04-30T18:00:00+09:00', timeZone: 'Asia/Tokyo' },
    },
  ]
### output
  [
    {
      schedule_id: 1,
      date: "2025-04-23",
      start_time: "10:00",
      end_time: "11:00",
      option: "不参加",
      reason: "旅行のため不参加。",
    },
    {
      schedule_id: 2,
      date: "2025-04-24",
      start_time: "10:00",
      end_time: "17:00",
      option: "不参加",
      reason: "輪読会のため不参加。",
    },
    {
      schedule_id: 3,
      date: "2025-04-29",
      start_time: "14:00",
      end_time: "17:00",
      option: "参加",
      reason: "予定が入っていないので参加。",
    },
    {
      schedule_id: 4,
      date: "2025-04-30",
      start_time: "14:00",
      end_time: "17:00",
      option: "途中退出",
      reason: "16時から1on1があるため途中退出。",
    },
  ]

--- candidate slot ---
${JSON.stringify(dummy_schedule)}

--- calendar ---
${allEvents.map((event) => `
  ### 予定名: ${event.summary}
  ### 開始時間: ${event.start?.dateTime ?? event.start?.date}
  ### 終了時間: ${event.end?.dateTime ?? event.end?.date}
`).join("\n")}

${searchCondition ? `
### search condition
${searchCondition}
` : ""}
`
  });
  return checkSchedule.object.schedule;
}


