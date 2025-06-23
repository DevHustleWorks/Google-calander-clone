import React from "react";
import { clsx } from "./Minicalender";
export default function CalendarBox({ isSidebarOpen, gridStyle }) {
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

  return (
    <div
      style={{ ...gridStyle, transition: "all 0.3s ease-in-out" }}
      className={clsx(
        isSidebarOpen ? "ml-[258px]" : "ml-0",
        "ml-2 border rounded-lg border-gray-100 bg-white m-2 absolute left-0 right-0 bottom-0 top-14 overflow-auto",
      )}
    >
      <CalendarGrid daysOfWeek={daysOfWeek} calendarDays={calendarDays} />
    </div>
  );
}

function CalendarGrid({ daysOfWeek, calendarDays }) {
  const gridIndex = [23, 24, 25, 26, 27, 28];
  return (
    <>
      <div className="col-span-1 col-start-1 grid bg-gray-100 text-center font-normal text-xs pt-2">
        {gridIndex.map((idx) => (
          <div>{idx}</div>
        ))}
      </div>
      <div className="col-span-2 col-start-2 grid grid-cols-7 relative">
        <div className="absolute top-0 left-0 w-full grid grid-cols-7">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center text-xs font-normal h-6"
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
                className={`border-r border-r-[0.5px] flex flex-col text-center p-1 border-b border-gray-200 relative`}
              >
                <span
                  className={`text-xs font-normal ${dayObj.isSelected ? "text-blue-600" : "text-gray-800"}
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
