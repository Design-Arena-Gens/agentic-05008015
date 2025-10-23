export type CalendarEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  description?: string | null;
  tag?: string | null;
};
