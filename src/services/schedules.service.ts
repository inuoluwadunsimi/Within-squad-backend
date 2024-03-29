import {
  CreateScheduleInterface,
  Schedule,
} from "../interfaces/models/schedules.interface";
import { SchedulesDb } from "../models/schedules";

export async function CreateSchedule(
  body: CreateScheduleInterface
): Promise<void> {
  const { title, startDate, endDate, spaceId } = body;

  await SchedulesDb.create({
    title,
    startDate,
    endDate,
    space: spaceId,
  });
}

export async function getAllSchedules(spaceId: string): Promise<Schedule[]> {
  const date = new Date();

  const schedules = await SchedulesDb.find<Schedule>({
    space: spaceId,
  });
  return schedules;
}
