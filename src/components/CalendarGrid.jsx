import React, { useState } from "react";
import { clsx } from "./Minicalender";
import { DateFn } from "../lib/date/datefn.js";

const datefn = new DateFn();
console.log("DateFn", datefn.endOfWeek(new Date("2025-06-14"), { weekStartsOn: 0 }));


export default function CalendarBox({ isSidebarOpen, gridStyle }) {
  const [popup, setPopup] = useState({ open: false, date: null });
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Static data for June 2025 view
  const calendarDays = [
    // Row 1 (June 1 starts on Sunday)
    [
      { day: 1, events: ["10am S2 Morning Status Req"] },
      {
        day: 2,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 3,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 4,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 5,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 6,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 7,
        events: [
          "Bakrid",
          "10am S2 Morning Status Req",
          "6pm S2 Evening Scrum Call",
        ],
      },
    ],
    // Row 2
    [
      { day: 8, events: ["10am S2 Morning Status Req"] },
      {
        day: 9,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 10,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 11,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 12,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 13,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 14,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
    ],
    // Row 3
    [
      { day: 15, events: ["10am S2 Morning Status Req"] },
      {
        day: 16,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 17,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 18,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 19,
        isSelected: true,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 20,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 21,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
    ],
    // Row 4
    [
      { day: 22, events: ["10am S2 Morning Status Req"] },
      {
        day: 23,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 24,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 25,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 26,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: 27,
        events: [
          "Rath Yatra",
          "10am S2 Morning Status Req",
          "6pm S2 Evening Scrum Call",
        ],
      },
      {
        day: 28,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
    ],
    // Row 5
    [
      { day: 29, events: ["10am S2 Morning Status Req"] },
      {
        day: 30,
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: "Jul 1",
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: "2",
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: "3",
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: "4",
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
      {
        day: "5",
        events: ["10am S2 Morning Status Req", "6pm S2 Evening Scrum Call"],
      },
    ],
  ];

  // Popup modal for mobile
  const PopupModal = ({ open, date, onClose }) => {
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-40"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg p-3 w-11/12 h-1/2 max-w-xs relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-lg font-semibold mb-2">{typeof date === 'string' ? date : ` ${date.getDate()} ${daysOfWeek[date.getDay()]} 2025 `}</div>
          <div className="text-sm text-gray-600">Popup content for this date.</div>
        </div>
      </div>
    );
  };

  // Only show popup on mobile
  const handleDateClick = (date) => {
    if (window.innerWidth < 760) {
      setPopup({ open: true, date });
    }
  };

  return (
    <div
      style={{ ...gridStyle, transition: "all 0.3s ease-in-out" }}
      className={clsx(
        isSidebarOpen ? "ml-[258px]" : "ml-0",
        " ml-2 border rounded-lg border-gray-100 bg-white m-2 absolute left-0 right-0 bottom-0 top-14 overflow-hidden",
      )}
    >
      <CalendarGrid
        daysOfWeek={daysOfWeek}
        calendarDays={calendarDays}
        today={() => new Date()}
        onDateClick={handleDateClick}
      />
      <PopupModal open={popup.open} date={popup.date} onClose={() => setPopup({ open: false, date: null })} />
    </div>
  );
}

function CalendarGrid({ daysOfWeek, calendarDays, today, onDateClick }) {
  const gridIndex = [23, 24, 25, 26, 27, 28];
  // console.log(today().getTime())
  return (
    <>
      <div className="col-span-1 col-start-1 grid bg-gray-100 text-center font-normal text-xs pt-2">
        {gridIndex.map((idx) => (
          <div key={idx}>{idx}</div>
        ))}
      </div>
      <div className="col-span-2 col-start-2 grid grid-cols-7 relative">
        <div style={{ zIndex: 9999, }} className="absolute top-0 left-0 w-full grid grid-cols-7">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className=" flex items-center justify-center text-xs font-normal h-6"
            >
              {day}
            </div>
          ))}
        </div>
        {calendarDays.map((week, weekIdx) => (
          <React.Fragment key={weekIdx}>
            {week.map((dayObj, dayIdx) => (
              <div
                key={dayIdx}
                className={clsx(
                  today().getDate() === dayObj.day
                    ? "border border-blue-600"
                    : "bg-white border-gray-200",
                  today().getDate() <= dayObj.day ? "opacity-100" : "opacity-40",
                  "border-r border-r-[0.5px] flex flex-col text-center cursor-pointer p-1 border-b relative",
                  weekIdx === calendarDays.length - 1 ? "border-b-0" : ""
                )}
                onClick={() => onDateClick(new Date(today().getFullYear(), today().getMonth(), dayObj.day, 0, 0, 0))}
              >
                {/* {console.log("dayObj", , today().getFullYear(), today().getMonth()+1, dayObj.day)} */}
                <span
                  className={`text-xs font-normal ${today().getDate() === dayObj.day ? "text-blue-600" : "text-gray-800"}
                 ${weekIdx === 0 ? "pt-3" : ""}
                `}
                >
                  {dayObj.day}
                </span>
                {dayObj.events && dayObj.events.length > 0 && (
                  <div key={weekIdx} className="space-y-1">
                    {dayObj.events.map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className="overflow-x text-[8px] text-gray-600 bg-gray-100 rounded"
                      >
                        {/* {event}  */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
