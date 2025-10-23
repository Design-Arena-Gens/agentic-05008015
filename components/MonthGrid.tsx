import clsx from "clsx";
import { format } from "date-fns";
import styles from "@/app/page.module.css";
import { buildMonthMatrix, eventsForDate, isDateInCurrentMonth, isDateToday } from "@/lib/calendar";
import type { CalendarEvent } from "@/types/calendar";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type MonthGridProps = {
  referenceDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
};

export function MonthGrid({ referenceDate, selectedDate, events, onSelect }: MonthGridProps) {
  const weeks = buildMonthMatrix(referenceDate);

  return (
    <div className={styles.calendar}>
      <div className={styles.monthGrid}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.weekday}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.monthGrid}>
        {weeks.flat().map((day) => {
          const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const eventsForDay = eventsForDate(day, events);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={clsx(styles.dayCell, {
                [styles.dayCellSelected]: isSelected
              })}
              style={{
                opacity: isDateInCurrentMonth(day, referenceDate) ? 1 : 0.35,
                borderStyle: isDateInCurrentMonth(day, referenceDate) ? "solid" : "dashed"
              }}
            >
              <span className={styles.dayNumber}>{format(day, "d")}</span>
              {isDateToday(day) ? <span className={styles.todayBadge}>Today</span> : null}

              {eventsForDay.length > 0 ? (
                <div className={styles.eventsPreview}>
                  {eventsForDay.slice(0, 2).map((event) => (
                    <div key={event.id} className={styles.eventsPreviewItem}>
                      {event.startTime ? `${event.startTime} · ` : ""}
                      {event.title}
                    </div>
                  ))}
                  {eventsForDay.length > 2 ? (
                    <div className={styles.eventsPreviewItem}>+{eventsForDay.length - 2} more</div>
                  ) : null}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
