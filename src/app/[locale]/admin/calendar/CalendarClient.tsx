"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  url: string;
};

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  pending_payment: { bg: "#A82A1F1A", border: "#A82A1F", text: "#8B1C13" },
  confirmed: { bg: "#2A3F2C1A", border: "#2A3F2C", text: "#1F3023" },
  checked_in: { bg: "#2A3F2C", border: "#1F3023", text: "#F4ECD8" },
  checked_out: { bg: "#5C57491A", border: "#5C5749", text: "#3D392E" },
};

export function CalendarClient({
  events,
  locale,
}: {
  events: CalendarEvent[];
  locale: string;
}) {
  return (
    <div className="chalet-calendar">
      <style>{`
        .chalet-calendar .fc {
          font-family: var(--font-serif), Georgia, serif;
          color: rgb(31 30 24);
        }
        .chalet-calendar .fc-toolbar-title {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }
        .chalet-calendar .fc-button {
          background: transparent !important;
          border: 1px solid rgb(31 30 24 / 0.4) !important;
          color: rgb(31 30 24) !important;
          text-transform: uppercase;
          font-size: 0.7rem !important;
          letter-spacing: 0.18em;
          border-radius: 0 !important;
          padding: 0.5rem 1rem !important;
          box-shadow: none !important;
        }
        .chalet-calendar .fc-button:hover,
        .chalet-calendar .fc-button-active {
          background: rgb(31 30 24) !important;
          color: rgb(244 236 216) !important;
        }
        .chalet-calendar .fc-col-header-cell {
          background: rgb(244 236 216 / 0.5);
          font-family: var(--font-display);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.72rem;
          font-weight: 400;
          padding: 0.5rem 0;
        }
        .chalet-calendar .fc-daygrid-day {
          background: transparent;
        }
        .chalet-calendar .fc-day-today {
          background: rgb(244 236 216 / 0.4) !important;
        }
        .chalet-calendar .fc-event {
          border-radius: 0;
          padding: 2px 6px;
          font-size: 0.78rem;
          font-family: var(--font-serif);
        }
        .chalet-calendar .fc-event:hover {
          opacity: 0.85;
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        locale={locale}
        height="auto"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,dayGridWeek",
        }}
        events={events.map((e) => {
          const palette = STATUS_COLORS[e.status] ?? STATUS_COLORS.pending_payment;
          return {
            id: e.id,
            title: e.title,
            start: e.start,
            end: e.end,
            url: e.url,
            backgroundColor: palette.bg,
            borderColor: palette.border,
            textColor: palette.text,
            extendedProps: { status: e.status },
          };
        })}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) {
            window.location.href = info.event.url;
          }
        }}
        displayEventTime={false}
      />

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs editorial-caps">
        {Object.entries(STATUS_COLORS).map(([status, colors]) => (
          <li key={status} className="flex items-center gap-2">
            <span
              className="block w-4 h-4 border"
              style={{ background: colors.bg, borderColor: colors.border }}
              aria-hidden
            />
            {status.replace("_", " ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
