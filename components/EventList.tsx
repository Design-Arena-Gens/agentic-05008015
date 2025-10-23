import { format, parseISO } from "date-fns";
import styles from "@/app/page.module.css";
import type { CalendarEvent } from "@/types/calendar";

type EventListProps = {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
};

export function EventList({ events, onEdit }: EventListProps) {
  if (events.length === 0) {
    return <div className={styles.emptyState}>No plans yet. Start by adding something you care about.</div>;
  }

  return (
    <div className={styles.eventList}>
      {events.map((event) => {
        const starts = parseISO(event.startDate);
        const timeLabel =
          event.startTime && event.endTime
            ? `${event.startTime} – ${event.endTime}`
            : event.startTime
              ? `${event.startTime}`
              : format(starts, "p");

        return (
          <article key={event.id} className={styles.eventCard}>
            <div className={styles.eventCardHeader}>
              <div>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventMeta}>
                  <span>{timeLabel}</span>
                  {event.tag ? <span className={styles.tag}>{event.tag}</span> : null}
                </div>
              </div>
              <div className={styles.eventActions}>
                <button type="button" className={styles.pillButton} onClick={() => onEdit(event)}>
                  Edit
                </button>
              </div>
            </div>
            {event.description ? (
              <p className={styles.eventDescription}>{event.description}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
