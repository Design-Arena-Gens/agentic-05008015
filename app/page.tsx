"use client";

import { useEffect, useMemo, useState } from "react";
import { addMonths, format, startOfDay, subMonths } from "date-fns";
import styles from "./page.module.css";
import { CalendarHeader } from "@/components/CalendarHeader";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { MonthGrid } from "@/components/MonthGrid";
import { SelectedDaySummary } from "@/components/SelectedDaySummary";
import type { CalendarEvent } from "@/types/calendar";

const STORAGE_KEY = "calendar-app-events@v1";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as CalendarEvent[];
      setEvents(parsed);
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const eventsForSelectedDate = useMemo(() => {
    const selectedKey = format(selectedDate, "yyyy-MM-dd");
    return events
      .filter((event) => format(new Date(event.startDate), "yyyy-MM-dd") === selectedKey)
      .filter((event) => (activeTagFilter ? event.tag === activeTagFilter : true))
      .sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [events, selectedDate, activeTagFilter]);

  function handleAddEvent(payload: Omit<CalendarEvent, "id">) {
    const newEvent: CalendarEvent = {
      ...payload,
      id: crypto.randomUUID()
    };
    setEvents((prev) => [...prev, newEvent]);
    setEditingEvent(null);
  }

  function handleUpdateEvent(payload: Omit<CalendarEvent, "id">) {
    if (!editingEvent) return;
    setEvents((prev) =>
      prev.map((event) => (event.id === editingEvent.id ? { ...payload, id: event.id } : event))
    );
    setEditingEvent(null);
  }

  function handleRemoveEvent() {
    if (!editingEvent) return;
    setEvents((prev) => prev.filter((event) => event.id !== editingEvent.id));
    setEditingEvent(null);
  }

  function handleSelectDay(date: Date) {
    const normalized = startOfDay(date);
    setSelectedDate(normalized);
    setCurrentMonth(normalized);
    setEditingEvent(null);
  }

  function handleMonthChange(offset: number) {
    setCurrentMonth((prev) => {
      const updated = offset > 0 ? addMonths(prev, offset) : subMonths(prev, Math.abs(offset));
      return startOfDay(updated);
    });
  }

  const tagOptions = useMemo(() => {
    const tags = events
      .map((event) => event.tag)
      .filter(Boolean)
      .map((tag) => tag as string);
    return Array.from(new Set(tags)).sort();
  }, [events]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Design your ideal week.</h1>
        <p className={styles.heroSubtitle}>
          The mindful calendar for ambitious humans. Capture what matters, layer focus blocks, and
          celebrate meaningful progress—one day at a time.
        </p>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.responsiveLayout}>
            <div className={styles.calendarColumn}>
              <div className={styles.calendarShell}>
                <CalendarHeader
                  currentMonth={currentMonth}
                  onPrevious={() => handleMonthChange(-1)}
                  onNext={() => handleMonthChange(1)}
                  onToday={() => handleSelectDay(new Date())}
                />
                <MonthGrid
                  referenceDate={currentMonth}
                  selectedDate={selectedDate}
                  events={events}
                  onSelect={handleSelectDay}
                />
              </div>
            </div>

            <div className={styles.sidebarColumn}>
              <SelectedDaySummary date={selectedDate} totalEvents={eventsForSelectedDate.length} />

              <div className={styles.panel}>
                <div className={styles.panelTitle}>
                  <span>Plan your day</span>
                  <span>{format(selectedDate, "MMM d, yyyy")}</span>
                </div>

                {tagOptions.length > 0 ? (
                  <div className={styles.filters}>
                    <button
                      type="button"
                      className={styles.filterButton + (!activeTagFilter ? ` ${styles.filterButtonActive}` : "")}
                      onClick={() => setActiveTagFilter(null)}
                    >
                      All
                    </button>
                    {tagOptions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={
                          styles.filterButton +
                          (activeTagFilter === tag ? ` ${styles.filterButtonActive}` : "")
                        }
                        onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : null}

                <EventList
                  events={eventsForSelectedDate}
                  onEdit={(event) => {
                    setSelectedDate(startOfDay(new Date(event.startDate)));
                    setEditingEvent(event);
                  }}
                />
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>
                  <span>{editingEvent ? "Edit event" : "Add event"}</span>
                  <span>{format(selectedDate, "MMM d")}</span>
                </div>
                <EventForm
                  mode={editingEvent ? "edit" : "create"}
                  defaultValues={editingEvent ?? {}}
                  selectedDate={selectedDate}
                  onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
                  onDelete={editingEvent ? handleRemoveEvent : undefined}
                  onCancelEdit={editingEvent ? () => setEditingEvent(null) : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
