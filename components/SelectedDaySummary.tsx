import { format } from "date-fns";
import styles from "@/app/page.module.css";

type SelectedDaySummaryProps = {
  date: Date;
  totalEvents: number;
};

export function SelectedDaySummary({ date, totalEvents }: SelectedDaySummaryProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>
        <span>Day Summary</span>
        <span>{totalEvents} {totalEvents === 1 ? "event" : "events"}</span>
      </div>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>{format(date, "EEEE, MMMM d")}</div>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
          Keep momentum by mapping your focus blocks, priorities, and moments that matter.
        </p>
      </div>
    </div>
  );
}
