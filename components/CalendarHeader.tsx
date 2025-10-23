import { format } from "date-fns";
import styles from "@/app/page.module.css";

type CalendarHeaderProps = {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function CalendarHeader({ currentMonth, onPrevious, onNext, onToday }: CalendarHeaderProps) {
  return (
    <div className={styles.calendarHeader}>
      <div>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>
          Plan, track, and focus your time.
        </p>
      </div>
      <div className={styles.calendarHeaderControls}>
        <button className={styles.calendarButton} type="button" onClick={onPrevious}>
          ←
        </button>
        <button className={styles.calendarButton} type="button" onClick={onToday}>
          Today
        </button>
        <button className={styles.calendarButton} type="button" onClick={onNext}>
          →
        </button>
      </div>
    </div>
  );
}
