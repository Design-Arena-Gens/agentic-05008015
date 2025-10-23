import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import { parseDateInput } from "@/lib/calendar";
import type { CalendarEvent } from "@/types/calendar";

const TAGS = ["Focus", "Health", "Family", "Deep Work", "Learning", "Personal"];

type EventFormProps = {
  mode: "create" | "edit";
  defaultValues: Partial<CalendarEvent>;
  selectedDate: Date;
  onSubmit: (event: Omit<CalendarEvent, "id">) => void;
  onDelete?: () => void;
  onCancelEdit?: () => void;
};

type FormState = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  tag: string;
};

const initialFormState: FormState = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  tag: ""
};

export function EventForm({
  mode,
  defaultValues,
  selectedDate,
  onSubmit,
  onDelete,
  onCancelEdit
}: EventFormProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  useEffect(() => {
    setFormState({
      title: defaultValues.title ?? "",
      description: defaultValues.description ?? "",
      startTime: defaultValues.startTime ?? "",
      endTime: defaultValues.endTime ?? "",
      tag: defaultValues.tag ?? ""
    });
  }, [defaultValues]);

  function handleChange<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setFormState((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const startDateISO = parseDateInput(selectedDate, formState.startTime || undefined);
    const endDateISO =
      formState.endTime && formState.startTime
        ? parseDateInput(selectedDate, formState.endTime)
        : undefined;

    onSubmit({
      title: formState.title.trim(),
      description: formState.description.trim() || null,
      startDate: startDateISO,
      endDate: endDateISO ?? null,
      startTime: formState.startTime || null,
      endTime: formState.endTime || null,
      tag: formState.tag || null
    });
    setFormState(initialFormState);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <label htmlFor="title">Event title</label>
        <input
          id="title"
          className={styles.input}
          placeholder="Team sync, workout, deep work…"
          value={formState.title}
          onChange={(event) => handleChange("title", event.target.value)}
          required
        />
      </div>

      <div className={styles.timeRow}>
        <div className={styles.formRow}>
          <label htmlFor="startTime">Start</label>
          <input
            id="startTime"
            type="time"
            value={formState.startTime}
            onChange={(event) => handleChange("startTime", event.target.value)}
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="endTime">End</label>
          <input
            id="endTime"
            type="time"
            value={formState.endTime}
            onChange={(event) => handleChange("endTime", event.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className={styles.textarea}
          placeholder="Add context, notes, or prep items…"
          value={formState.description}
          onChange={(event) => handleChange("description", event.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <label>Focus area</label>
        <div className={styles.filters}>
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={clsx(styles.filterButton, {
                [styles.filterButtonActive]: formState.tag === tag
              })}
              onClick={() => handleChange("tag", formState.tag === tag ? "" : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button className={styles.submitButton} type="submit">
          {mode === "edit" ? "Save changes" : "Add to calendar"}
        </button>
        {mode === "edit" ? (
          <>
            {onDelete ? (
              <button
                type="button"
                className={styles.pillButton}
                onClick={onDelete}
                style={{ background: "rgba(239, 68, 68, 0.18)", color: "#fca5a5" }}
              >
                Delete
              </button>
            ) : null}
            {onCancelEdit ? (
              <button type="button" className={styles.pillButton} onClick={onCancelEdit}>
                Cancel
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </form>
  );
}
