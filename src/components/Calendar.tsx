"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  notes?: string;
  createdBy?: string;
};

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday = 0
  const gridStart = new Date(year, month, 1 - startOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}

export default function Calendar() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDay) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedDay]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const days = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const monthStartKey = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const nextMonthStartKey = `${month === 11 ? year + 1 : year}-${String(
    month === 11 ? 1 : month + 2
  ).padStart(2, "0")}-01`;

  useEffect(() => {
    const q = query(
      collection(db, "events"),
      where("date", ">=", days[0] ? toDateKey(days[0]) : monthStartKey),
      where("date", "<", days[41] ? toDateKey(days[41]) : nextMonthStartKey),
      orderBy("date"),
      orderBy("time")
    );
    const unsub = onSnapshot(q, (snap) => {
      setEvents(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CalendarEvent, "id">) }))
      );
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    return map;
  }, [events]);

  const addEvent = async () => {
    if (!newTitle.trim() || !selectedDay) return;
    await addDoc(collection(db, "events"), {
      title: newTitle.trim(),
      date: selectedDay,
      time: newTime || null,
      createdBy: user?.email ?? null,
      createdAt: serverTimestamp(),
    });
    setNewTitle("");
    setNewTime("");
  };

  const removeEvent = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
  };

  const todayKey = toDateKey(today);
  const selectedEvents = selectedDay ? eventsByDay.get(selectedDay) ?? [] : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Mese precedente"
          className="rounded-full p-3 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">
          {MONTH_NAMES[month]} {year}
        </h1>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Mese successivo"
          className="rounded-full p-3 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const key = toDateKey(d);
          const inMonth = d.getMonth() === month;
          const dayEvents = eventsByDay.get(key) ?? [];
          const isToday = key === todayKey;
          const isSelected = key === selectedDay;
          return (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              className={`flex min-h-16 flex-col items-start gap-0.5 rounded-lg border p-1.5 text-left text-xs transition-colors ${
                inMonth
                  ? "border-neutral-200 dark:border-neutral-800"
                  : "border-transparent text-neutral-300 dark:text-neutral-700"
              } ${
                isSelected
                  ? "ring-2 ring-neutral-900 dark:ring-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  isToday ? "bg-red-500 text-white" : ""
                }`}
              >
                {d.getDate()}
              </span>
              <div className="flex w-full flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <span
                    key={ev.id}
                    className="truncate rounded bg-neutral-900/90 px-1 text-[10px] text-white dark:bg-white/90 dark:text-neutral-900"
                  >
                    {ev.time ? `${ev.time} ` : ""}
                    {ev.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-neutral-400">+{dayEvents.length - 2}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div
          ref={detailRef}
          className="mt-4 scroll-mt-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <h2 className="mb-2 text-sm font-semibold">
            {new Date(selectedDay + "T00:00:00").toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>

          <ul className="mb-3 flex flex-col gap-1.5">
            {selectedEvents.length === 0 && (
              <li className="text-sm text-neutral-400">Nessun evento</li>
            )}
            {selectedEvents.map((ev) => (
              <li
                key={ev.id}
                className="flex items-center justify-between rounded-lg bg-neutral-100 py-1 pl-3 pr-1 text-sm dark:bg-neutral-900"
              >
                <span>
                  {ev.time && <span className="mr-2 text-neutral-500">{ev.time}</span>}
                  {ev.title}
                </span>
                <button
                  onClick={() => removeEvent(ev.id)}
                  className="shrink-0 p-3 text-neutral-400 hover:text-red-500"
                  aria-label="Elimina evento"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEvent()}
              placeholder="Nuovo evento..."
              enterKeyHint="done"
              className="min-w-40 flex-1 rounded-lg border border-neutral-200 px-3 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
            />
            <input
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              type="time"
              className="rounded-lg border border-neutral-200 px-3 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
            />
            <button
              onClick={addEvent}
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-neutral-900 sm:w-auto"
            >
              Aggiungi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
