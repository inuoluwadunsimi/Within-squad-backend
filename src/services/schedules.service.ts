import {
  CreateScheduleInterface,
  Schedule,
} from "../interfaces/models/schedules.interface";
import { SchedulesDb } from "../models/schedules";

export async function CreateSchedule(
  body: CreateScheduleInterface
): Promise<void> {
  const { title, day, time, spaceId } = body;

  await SchedulesDb.create({
    title,
    day,
    time,
    space: spaceId,
  });
}

export async function getAllSchedules(spaceId: string): Promise<Schedule[]> {
  const date = new Date();

  const schedules = await SchedulesDb.find<Schedule>({
    space: spaceId,
    time: { $gt: date },
  });
  return schedules;
}
