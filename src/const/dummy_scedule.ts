export const dummy_schedule: DummySchedule[] = [
  {
    id: 1,
    date: "2025-04-25",
    start_time: "19:00",
    end_time: "22:00",
  },
  {
    id: 2,
    date: "2025-04-26",
    start_time: "19:00",
    end_time: "22:00",
  },
  {
    id: 3,
    date: "2025-04-27",
    start_time: "19:00",
    end_time: "22:00",
  },
  {
    id: 4,
    date: "2025-04-29",
    start_time: "19:00",
    end_time: "22:00",
  },
  {
    id: 5,
    date: "2025-05-01",
    start_time: "19:00",
    end_time: "22:00",
  },

]

export type DummySchedule = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}
