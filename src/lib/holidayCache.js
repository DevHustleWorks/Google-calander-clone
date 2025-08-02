import { openDB } from 'idb';

class HolidayCacheService {
  constructor() {
    this.dbName = 'calendarDB';
    this.dbVersion = 1;
    this.holidayStoreName = 'holiday_cache';
    this.metaStoreName = 'meta';
  }

  async initDB() {
    return openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('holiday_cache')) {
          db.createObjectStore('holiday_cache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      },
    });
  }

  async getCountryCode() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();
      return data.countryCode || 'US';
    } catch (error) {
      console.error('Error getting location:', error);
      return 'US';
    }
  }

  async fetchHolidaysFromAPI(year, countryCode) {
    try {
      const api_key = "h3TU9hN4mugMQghpCo31z523FeQwHHVp";
      const url = `https://calendarific.com/api/v2/holidays?&api_key=${api_key}&country=${countryCode}&year=${year}`;
      const response = await fetch(url);
      const json = await response.json();
      return json?.response?.holidays || [];
    } catch (error) {
      console.error('Error fetching public holidays:', error);
      return [];
    }
  }

  async fetchHolidaysFor10Years(startYear, countryCode) {
    const allHolidays = [];
    
    for (let year = startYear; year < startYear + 10; year++) {
      try {
        const holidays = await this.fetchHolidaysFromAPI(year, countryCode);
        allHolidays.push(...holidays);
          
      } catch (error) {
        console.error(`Error fetching holidays for year ${year}:`, error);
      }
    }
    
    return allHolidays;
  }

  groupHolidaysByYearMonthDate(holidaysArray) {
    const grouped = {};
    
    holidaysArray.forEach(holiday => {
      const date = new Date(holiday.date.iso);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString(); // Convert to 1-indexed
      const day = date.getDate().toString();
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = {};
      }
      if (!grouped[year][month][day]) {
        grouped[year][month][day] = [];
      }
      
      grouped[year][month][day].push({
        name: holiday.name,
        iso: holiday.date.iso,
        description: holiday.description,
        type: holiday.type,
        country: holiday.country
      });
    });
    
    return grouped;
  }

  async storeHolidaysInIndexedDB(data, startYear) {
    const db = await this.initDB();
    
    await db.put(this.holidayStoreName, {
      id: 'holidays',
      data: data,
      startYear: startYear,
      fetchedAt: new Date().toISOString()
    });
    
    // Store metadata
    await db.put(this.metaStoreName, {
      key: 'holiday_meta',
      startYear: startYear,
      fetchedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    
      
  }

  async getCachedHolidaysFromIndexedDB() {
    try {
      const db = await this.initDB();
      
      const holidayData = await db.get(this.holidayStoreName, 'holidays');
      const metaData = await db.get(this.metaStoreName, 'holiday_meta');
      
      if (!holidayData || !metaData) {
        return null;
      }
      
      const now = new Date().getFullYear();
      const isDataValid = now < metaData.startYear + 10;
      
      if (!isDataValid) {
          
        return null;
      }
      
        
      return {
        data: holidayData.data,
        startYear: metaData.startYear,
        fetchedAt: metaData.fetchedAt
      };
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      return null;
    }
  }

  async getHolidaysForDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString(); // Convert to 1-indexed
    const day = date.getDate().toString();
    
    const cachedData = await this.getCachedHolidaysFromIndexedDB();
    
    if (cachedData && cachedData.data[year] && cachedData.data[year][month] && cachedData.data[year][month][day]) {
      return cachedData.data[year][month][day];
    }
    
    return [];
  }

  async getHolidaysForMonth(year, month) {
    const yearStr = year.toString();
    const monthStr = (month + 1).toString(); // Convert to 1-indexed
    
      
    
    const cachedData = await this.getCachedHolidaysFromIndexedDB();
      
    
    if (cachedData && cachedData.data[yearStr] && cachedData.data[yearStr][monthStr]) {
      const monthData = cachedData.data[yearStr][monthStr];
        
      return { [yearStr]: { [monthStr]: monthData } };
    }
    
      
    return { [yearStr]: { [monthStr]: {} } };
  }

  async ensureHolidayCache() {
    const now = new Date().getFullYear();
    const cache = await this.getCachedHolidaysFromIndexedDB();
    
    if (!cache || now >= cache.startYear + 10) {
        
      const countryCode = await this.getCountryCode();
      const newHolidays = await this.fetchHolidaysFor10Years(now, countryCode);
      const grouped = this.groupHolidaysByYearMonthDate(newHolidays);
      await this.storeHolidaysInIndexedDB(grouped, now);
      return grouped;
    }
    
    return cache.data;
  }

  async clearCache() {
    try {
      const db = await this.initDB();
      await db.clear(this.holidayStoreName);
      await db.clear(this.metaStoreName);
        
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default HolidayCacheService; 
