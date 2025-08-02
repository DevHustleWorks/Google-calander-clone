import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import { CalendarFn } from "../lib/CalenderFn/lib.calendar";

export const CalendarContext = createContext(null);

export const CalendarProvider = ({ user, children }) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState({});
  const [currentMonthHolidays, setCurrentMonthHolidays] = useState({});

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const value = useMemo(() => ({
    currentDate,
    setCurrentDate,
    goToNextMonth,
    goToPrevMonth,
    goToToday, 
    loading,
    holidays,
    currentMonthHolidays
  }), [currentDate, loading, goToNextMonth, goToPrevMonth, goToToday, holidays, currentMonthHolidays]);

  const ProviderValue = { ...value, calendar: new CalendarFn({ user }), };

  // Load holidays for the current year
  useEffect(() => {
    const loadHolidays = async () => {
      setLoading(true);
      try {
          
        
        await ProviderValue.calendar.loadPublicHolidays(currentDate.getFullYear());
        
        // Get holidays for the current month
        const monthHolidays = await ProviderValue.calendar.getHolidaysForMonth(
          currentDate.getFullYear(), 
          currentDate.getMonth()
        );
        
          
        setCurrentMonthHolidays(monthHolidays);
        
        // Get all holidays for the year (for future use)
        const yearHolidays = await ProviderValue.calendar.holidayCache.getCachedHolidaysFromIndexedDB();
        if (yearHolidays) {
            
          setHolidays(yearHolidays.data);
        }
      } catch (error) {
        console.error('Error loading holidays:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
  }, []);

  // Update current month holidays when month changes
  useEffect(() => {
    const updateMonthHolidays = async () => {
      try {
          
        
        const monthHolidays = await ProviderValue.calendar.getHolidaysForMonth(
          currentDate.getFullYear(), 
          currentDate.getMonth()
        );
        
          
        setCurrentMonthHolidays(monthHolidays);
      } catch (error) {
        console.error('Error updating month holidays:', error);
      }
    };

    updateMonthHolidays();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  return (
    <CalendarContext.Provider value={ProviderValue}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within a CalendarProvider");
  return ctx;
}
