import React, { useState } from "react";
import { clsx } from "./Minicalender";
import { useCalendar } from "../providers/CalendarProvider";
import { DateFn } from "../lib/date/lib.datefn";

export default function CalendarBox({ isSidebarOpen }) {
  const datefn = new DateFn();
  const [popup, setPopup] = useState({ open: false, date: null });

  const { currentDate, currentMonthHolidays, loading, calendar } = useCalendar();

  const fullMonth = datefn.getFullMonth(currentDate, { weekStartsOn: 0 });

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Test function to manually load holidays
  const testLoadHolidays = async () => {
    try {
      await calendar.loadPublicHolidays(currentDate.getFullYear());
    } catch (error) {
      console.error('Error loading holidays:', error);
    }
  };

  // Test function to check localStorage data
  const testLocalStorageData = () => {
    try {
      const calendarData = JSON.parse(localStorage.getItem("calendar-data"));
      
      if (calendarData?.publicHolidays) {
        // Data is available for debugging if needed
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  };

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
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-lg font-semibold mb-2">
            {typeof date === "string"
              ? date
              : ` ${date.getDate()} ${daysOfWeek[date.getDay()]} 2025 `}
          </div>
          <div className="text-sm text-gray-600">
            Popup content for this date.
          </div>
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
      style={{ transition: "all 0.3s ease-in-out" }}
      className={clsx(
        isSidebarOpen ? "ml-[258px]" : "ml-0",
        " ml-2 border rounded-lg border-gray-100 bg-white m-1 absolute left-0 right-0 bottom-0 top-14 overflow-hidden",
      )}
    >
      
     
      <CalendarGrid
        daysOfWeek={daysOfWeek}
        today={() => new Date()}
        onDateClick={handleDateClick}
        fullMonth={fullMonth}
        currentMonthHolidays={currentMonthHolidays}
        loading={loading}
      />
      <PopupModal
        open={popup.open}
        date={popup.date}
        onClose={() => setPopup({ open: false, date: null })}
      />
    </div>
  );
}

function CalendarGrid({
  daysOfWeek,
  today,
  onDateClick,
  fullMonth,
  currentMonthHolidays,
  loading,
}) {

  // Helper function to get holidays for a specific date
  const getHolidaysForDate = (date) => {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString(); // Convert to 1-indexed
    const year = date.getFullYear().toString();
    
    // Check if we have holidays for this date
    if (currentMonthHolidays && 
        currentMonthHolidays[year] && 
        currentMonthHolidays[year][month] && 
        currentMonthHolidays[year][month][day]) {
      const holidays = currentMonthHolidays[year][month][day];
      return holidays;
    }
    
    // Fallback: try to get from the old localStorage format
    try {
      const calendarData = JSON.parse(localStorage.getItem("calendar-data"));
      const publicHolidays = calendarData?.publicHolidays;
      if (publicHolidays && publicHolidays[date.getMonth()]) {
        const monthHolidays = publicHolidays[date.getMonth()];
        const dayHolidays = monthHolidays.filter(holiday => {
          // Add proper null checks for holiday data structure
          if (!holiday || !holiday.date) {
            return false;
          }
          
          // Handle different date formats
          let holidayDate;
          if (typeof holiday.date === 'string') {
            holidayDate = new Date(holiday.date);
          } else if (holiday.date.iso) {
            holidayDate = new Date(holiday.date.iso);
          } else {
            return false;
          }
          
          return holidayDate.getDate() === date.getDate() && 
                 holidayDate.getMonth() === date.getMonth() && 
                 holidayDate.getFullYear() === date.getFullYear();
        });
        return dayHolidays;
      }
    } catch (error) {
      console.error('Error accessing localStorage holidays:', error);
    }
    
    return [];
  };

  // Helper function to check if a date is today
  const isToday = (date) => {
    const todayDate = today();
    return date.getDate() === todayDate.getDate() &&
           date.getMonth() === todayDate.getMonth() &&
           date.getFullYear() === todayDate.getFullYear();
  };

  // Helper function to get holiday type color
  const getHolidayTypeColor = (type) => {
    // Ensure type is a string before calling toLowerCase()
    const typeStr = typeof type === 'string' ? type.toLowerCase() : '';
    
    switch (typeStr) {
      case 'national':
      case 'optional holiday':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'religious':
      case 'hinduism':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'observance':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'season':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-orange-100 border-orange-300 text-orange-800';
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex w-full">
          <div className="w-[23px] bg-gray-100"></div>
          <div className="grid grid-cols-7 flex-1">
            {daysOfWeek.map((day, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    index < 6 ? "border-r-1 border-gray-200" : "border-0",
                    "text-center font-medium text-xs pt-1 text-gray-600",
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full h-full flex flex-col">
          {Object.entries(fullMonth).map(([weekIndex, DateArray]) => {
            return (
              <div key={weekIndex} role="row" className="flex flex-1 relative">
                <div className="w-[23px] bg-gray-100">
                  <p className="text-[11px] text-cemter ml-1 pt-2">
                    {weekIndex}
                  </p>
                </div>
                <div className="absolute top-0 left-[23px] bottom-0 right-0 grid grid-cols-7">
                  {DateArray.map((dateObj, index) => {
                    const date = new Date(+dateObj);
                    const dateNumber = date.getDate();
                    return (
                      <div
                        key={dateObj}
                        className={clsx(
                          index < 6 ? "border-r-1" : "",
                          "flex justify-center items-start w-full pt-1 border-b-1 border-gray-200",
                        )}
                      >
                        <h2
                          className={clsx(
                            isToday(date)
                              ? "bg-blue-700 text-white"
                              : "",
                            "text-center w-5 h-5 flex items-center justify-center text-[11px] rounded-full font-semibold text-gray-600",
                          )}
                        >
                          {dateNumber}
                        </h2>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full relative mt-7 z-[99999]">
                  <div className="grid grid-cols-7 flex-1 items-start relative z-[9999999]">
                    {DateArray.map((dateObj) => {
                      const date = new Date(+dateObj);
                      const holidays = getHolidaysForDate(date);
                      
                      return (
                        <div key={dateObj} role="cell" className="text-[11px] px-1">
                          <h3 className="sr-only">Holidays for {date.toDateString()}</h3>
                          <div className="space-y-1">
                            {loading ? (
                              // Loading indicator
                              <div className="rounded-md flex items-center bg-gray-100 text-center overflow-x-hidden animate-pulse">
                                <div className="ml-1 mr-1 rounded-full p-1 bg-gray-400 w-1 h-1"></div>
                                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-gray-500">
                                  Loading...
                                </div>
                              </div>
                            ) : (
                              // Holiday events
                              <>
                                {holidays.map((holiday, holidayIndex) => {
                                  return (
                                    <div 
                                      key={holidayIndex}
                                      className={clsx(
                                        "rounded-md flex items-center text-center overflow-x-hidden border cursor-pointer hover:opacity-80 transition-opacity",
                                        getHolidayTypeColor(holiday.type[0])
                                      )}
                                      title={`${holiday.name || 'Unknown Holiday'}${holiday.description ? ` - ${holiday.description}` : ''} (${holiday.type || 'Holiday'})`}
                                    >
                                      <div className="ml-1 mr-1 rounded-full p-1 w-1 h-1 bg-current opacity-60"></div>
                                      <div className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-xs">
                                        {holiday.name || 'Unknown Holiday'}
                                      </div>
                                    </div>
                                  );
                                })}
                                {/* Empty state for dates with no holidays */}
                                {holidays.length === 0 && (
                                  <div className="rounded-md flex items-center bg-transparent text-center overflow-x-hidden">
                                    <div className="ml-1 mr-1 rounded-full p-1 w-1 h-1 opacity-0"></div>
                                    <div className="whitespace-nowrap overflow-hidden text-ellipsis opacity-0">
                                      No events
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
