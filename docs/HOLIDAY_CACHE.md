# Holiday Cache System

## Overview

The holiday cache system provides efficient storage and retrieval of public holiday data for the Google Calendar clone. It fetches holiday data for 10 consecutive years and stores it in IndexedDB for fast access without repeated API calls.

## Features

- **10-Year Data Fetching**: Automatically fetches holiday data for 10 consecutive years
- **IndexedDB Storage**: Uses IndexedDB instead of localStorage for better performance with large datasets
- **Automatic Cache Management**: Automatically refreshes data when it becomes older than 10 years
- **Geolocation-Based Country Detection**: Automatically detects user's country for relevant holidays
- **Structured Data Organization**: Groups holidays by year → month → date for efficient querying

## Architecture

### Core Components

1. **HolidayCacheService** (`src/lib/holidayCache.js`)
   - Main service class for managing holiday data
   - Handles API calls, data grouping, and IndexedDB operations

2. **Updated CalendarFn** (`src/lib/CalenderFn/lib.calendar.js`)
   - Integrates with the cache service
   - Provides backward compatibility with existing code

3. **CalendarProvider** (`src/providers/CalendarProvider.jsx`)
   - Safely handles cache initialization
   - Manages loading states

### Data Structure

Holidays are stored in a nested structure:

```javascript
{
  "2025": {
    "8": {  // August (1-indexed)
      "15": [
        {
          name: "Independence Day",
          iso: "2025-08-15",
          description: "National holiday",
          type: "National",
          country: "US"
        }
      ],
      "20": [
        {
          name: "Full Moon",
          iso: "2025-08-20",
          description: "Astronomical event",
          type: "Observance",
          country: "US"
        }
      ]
    }
  }
}
```

### IndexedDB Schema

```javascript
{
  name: "calendarDB",
  version: 1,
  objectStores: {
    holiday_cache: { keyPath: "id" },
    meta: { keyPath: "key" }
  }
}
```

## API Methods

### HolidayCacheService

#### `fetchHolidaysFor10Years(startYear, countryCode)`
- Fetches holiday data for 10 consecutive years starting from `startYear`
- Returns aggregated holiday array

#### `groupHolidaysByYearMonthDate(holidaysArray)`
- Groups holidays into the nested year/month/date structure
- Returns organized holiday data

#### `storeHolidaysInIndexedDB(data, startYear)`
- Stores grouped holiday data in IndexedDB
- Saves metadata including fetch timestamp and start year

#### `getCachedHolidaysFromIndexedDB()`
- Retrieves cached holiday data from IndexedDB
- Validates data freshness (must be less than 10 years old)
- Returns null if data is missing or expired

#### `ensureHolidayCache()`
- Main method for ensuring holiday data is available
- Automatically fetches new data if cache is missing or expired
- Returns the holiday data structure

#### `getHolidaysForDate(date)`
- Returns holidays for a specific date
- Returns empty array if no holidays found

#### `getHolidaysForMonth(year, month)`
- Returns all holidays for a specific month
- Returns empty object if no holidays found

### CalendarFn Integration

#### `loadPublicHolidays(year)`
- Main method for loading holidays for a specific year
- Uses cache system internally
- Maintains backward compatibility with existing code

#### `getHolidaysForDate(date)`
- Convenience method to get holidays for a specific date

#### `getHolidaysForMonth(year, month)`
- Convenience method to get holidays for a specific month

#### `clearHolidayCache()`
- Clears all cached holiday data

## Usage

### Basic Usage

```javascript
import { useCalendar } from '../providers/CalendarProvider';

function MyComponent() {
  const { calendar } = useCalendar();
  
  // Load holidays for current year (automatically uses cache)
  useEffect(() => {
    calendar.loadPublicHolidays(new Date().getFullYear());
  }, []);
  
  // Get holidays for a specific date
  const getHolidays = async (date) => {
    const holidays = await calendar.getHolidaysForDate(date);
      
  };
}
```

### Advanced Usage

```javascript
import HolidayCacheService from '../lib/holidayCache.js';

const holidayCache = new HolidayCacheService();

// Manually ensure cache is up to date
const holidayData = await holidayCache.ensureHolidayCache();

// Get holidays for specific date
const today = new Date();
const holidays = await holidayCache.getHolidaysForDate(today);

// Clear cache if needed
await holidayCache.clearCache();
```

## Debug Component

The `HolidayCacheDebug` component provides a UI for testing and monitoring the cache system:

- View cache information (start year, fetch date, validity)
- Clear cache manually
- Refresh cache (force new API calls)
- View holidays for current date
- Monitor cache status

Access the debug panel by clicking the "Show Debug" button in the top-right corner of the calendar interface.

## Configuration

### API Key

The system uses the Calendarific API. The API key is currently hardcoded in the `HolidayCacheService`:

```javascript
const api_key = "h3TU9hN4mugMQghpCo31z523FeQwHHVp";
```

### Country Detection

The system automatically detects the user's country using geolocation:

1. Gets user's coordinates using `navigator.geolocation`
2. Reverse geocodes coordinates to get country code
3. Falls back to 'US' if geolocation fails

### Cache Duration

Holiday data is cached for 10 years from the start year. After 10 years, the system automatically fetches new data.

## Error Handling

- **API Failures**: Gracefully handles API errors and returns empty arrays
- **Geolocation Failures**: Falls back to 'US' as default country
- **IndexedDB Errors**: Logs errors and falls back to empty data
- **Network Issues**: Continues with cached data if available

## Performance Benefits

1. **Reduced API Calls**: Only fetches data once per 10 years
2. **Fast Access**: IndexedDB provides quick data retrieval
3. **Offline Support**: Works with cached data when offline
4. **Smooth UX**: No loading delays when navigating between months/years

## Future Enhancements

- Support for multiple countries
- Customizable cache duration
- Background sync for cache updates
- Export/import cache data
- Holiday data validation and correction 
