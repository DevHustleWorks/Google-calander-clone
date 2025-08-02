import { DateFn } from "../date/lib.datefn";
import HolidayCacheService from "../holidayCache.js";

class CalendarFn {
  constructor({ user } = {}) {
    this.dateFn = new DateFn();
    this.currentUser = user || null;
    this.key = 'calendar-data';
    this.calendars = JSON.parse(localStorage.getItem(this.key)) || {};
    this.holidayCache = new HolidayCacheService();

    if (this.currentUser && this.currentUser.email) {
      const email = this.currentUser?.email;

      if (!this.calendars[email]) {
        this.calendars[email] = [];
      }
    }

    delete this.calendars["undefined"];
    localStorage.setItem(this.key, JSON.stringify(this.calendars));
  }

  createCalendar(
    name,
    calendarDescription = "",
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  ) {

    if (!name) {
      throw new Error("Calendar name is required");
    }

    if (this.calendars[name]) {
      throw new Error(`Calendar with name "${name}" already exists`);
    }

    const calendarData = {
      calendarName: name,
      calendarDescription: calendarDescription,
      timeZone: timeZone,
      owner: this.currentUser
    };

    // Get existing data or initialize empty object
    const existingData = JSON.parse(localStorage.getItem(this.key)) || {};

    if (this.currentUser && this.currentUser?.email) {
      const userEmail = this.currentUser?.email;
      existingData[userEmail].push(calendarData);
      localStorage.setItem(this.key, JSON.stringify(existingData));
    }
    return calendarData;
  }

  async fetchPublicHolidays(currentYear) {
    // This method is now deprecated in favor of the cache system
    // Keeping for backward compatibility
    console.warn('fetchPublicHolidays is deprecated. Use loadPublicHolidays instead.');
    return this.loadPublicHolidays(currentYear);
  }

  async loadPublicHolidays(year) {
    try {
      // Ensure we have cached holiday data
      const holidayData = await this.holidayCache.ensureHolidayCache();
      
      // Convert the cached data to the expected format (by month arrays)
      const byMonth = Array.from({ length: 12 }, () => []);
      
      // Get holidays for the specific year
      const yearStr = year.toString();
      if (holidayData[yearStr]) {
        Object.keys(holidayData[yearStr]).forEach(monthStr => {
          const monthIndex = parseInt(monthStr) - 1; // Convert back to 0-indexed
          const monthHolidays = holidayData[yearStr][monthStr];
          
          // Flatten the daily holidays into a single array for the month
          Object.values(monthHolidays).forEach(dayHolidays => {
            byMonth[monthIndex].push(...dayHolidays);
          });
        });
      }
      
      // Update the calendars object
      this.calendars["publicHolidays"] = byMonth;
      localStorage.setItem(this.key, JSON.stringify(this.calendars));
      
      return byMonth;
    } catch (error) {
      console.error('Error loading public holidays:', error);
      // Fallback to empty array if cache fails
      const byMonth = Array.from({ length: 12 }, () => []);
      this.calendars["publicHolidays"] = byMonth;
      localStorage.setItem(this.key, JSON.stringify(this.calendars));
      return byMonth;
    }
  }

  async getHolidaysForDate(date) {
    return await this.holidayCache.getHolidaysForDate(date);
  }

  async getHolidaysForMonth(year, month) {
    return await this.holidayCache.getHolidaysForMonth(year, month);
  }

  async clearHolidayCache() {
    await this.holidayCache.clearCache();
  }
}

class Event {
  constructor({
    id,
    title,
    desc,
    loc,
    start,
    end,
    timeZone,
    recurrence,
    reminders = [],
    attendees = [],
    colorId,
    visibility,
  }) {
    this.id = id || crypto.randomUUID();
    this.title = title;
    this.description = desc;
    this.location = loc;
    this.start = start;    // e.g. ISO datetime
    this.end = end;
    this.timeZone = timeZone;
    this.recurrence = recurrence || [];
    this.reminders = reminders;
    this.attendees = attendees;
    this.colorId = colorId || 'default';
    this.visibility = visibility || 'default';
  }

  get startDate() {
    return new Date(this.start);
  }

  get endDate() {
    return new Date(this.end);
  }

  get duration() {
    return this.endDate - this.startDate;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      location: this.location,
      start: this.start,
      end: this.end,
      timeZone: this.timeZone,
      recurrence: this.recurrence,
      reminders: this.reminders,
      attendees: this.attendees,
      colorId: this.colorId,
      visibility: this.visibility,
    };
  }

  store() {
    const existingEvents = JSON.parse(localStorage.getItem('event-data')) || [];
    existingEvents.push(this.toJSON());
    localStorage.setItem('event-data', JSON.stringify(existingEvents));
  }

  static getAll() {
    const existingEvents = JSON.parse(localStorage.getItem('event-data')) || [];
    return existingEvents.map(eventData => new Event(eventData));
  }

  static getById(id) {
    const existingEvents = JSON.parse(localStorage.getItem('event-data')) || [];
    const event = existingEvents.find(eventData => eventData.id === id);
    return event ? new Event(event) : null;
  }

  static deleteById(id) {
    const existingEvents = JSON.parse(localStorage.getItem('event-data')) || [];
    const newEvents = existingEvents.filter(eventData => eventData.id !== id);
    localStorage.setItem('event-data', JSON.stringify(newEvents));
  }

  static clear() {
    localStorage.removeItem('event-data');
  }
}
// export default class CalendarFn {

//   constructor({user}) {
//     this.dateFn = new DateFn();
//     this.calendars = {}; 
//     this.events = {};
//     this.currentUser = user;
//     this.calendarId = this.currentUser?.email; 
//     this.key = 'calendar-data';
//   }

//   createCalendar(
//     name, 
//     calendarDescription = "", 
//     timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone, 
//   ) {
//     if (!name) {
//       throw new Error("Calendar name is required");
//     }
//     if (this.calendars[name]) {
//       throw new Error(`Calendar with name "${name}" already exists`);
//     }
//     const calendarData = {
//       calendarName: name,
//       calendarDescription: calendarDescription,
//       timeZone: timeZone,
//       owner: this.currentUser
//     };

//     // Get existing data or initialize empty object
//     const existingData = JSON.parse(localStorage.getItem(this.key)) || {};
//     const userCalendar = []; 

//     // if( existingData[this.calendarId?.email]) {
//       existingData[this.calendarId.email] = userCalendar
//     // }
//     // if( this.currentUser.email) { 
//         userCalendar.push(calendarData);
//     // }

//       
//     return calendarData;
//   }
// }
// export default class MyCalendar {

//   constructor() {

//   }

//   createCalender(name, date = new Date()) {
//     const dateFn = new DateFn();
//     const currentDate = new Date();
//     const firstDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const monthData = dateFn.getFullMonth(firstDateOfMonth, { weekStartsOn: 0 });
//     return monthData;
//   }





// }


export {
  CalendarFn,
  Event
}
