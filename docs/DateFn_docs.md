# DateFn Class Documentation

A utility class for handling date operations in JavaScript.

## Constructor

### `DateFn(date = new Date())`
Creates a new DateFn instance.
- `date` (optional): Date object or date string. Defaults to current date.

## Methods

### `milliseconds(unit: string)`
Converts time units to milliseconds.
- `unit`: Time unit string ("hours", "days", "weeks", "months")
- Returns: Number of milliseconds for the specified unit

Example:
```javascript
milliseconds("hours")  // returns 3600000
milliseconds("days")   // returns 86400000
milliseconds("weeks")  // returns 604800000
milliseconds("months") // returns 2592000000
```

### `startOfWeek(date = this.date, { weekStartsOn = 0 })`
#### Parameters:
- `date`: (optional) Date object, string, or timestamp. Defaults to instance date
- `weekStartsOn`:  Optional parameter to specify the first day of the week (0-6, where 0 is Sunday)


#### returns:
- Returns: Date object representing start of week, or undefined for invalid input

#### example:
```javascript
startOfWeek("2023-11-15", { weekStartsOn: 0 }) // Returns Sunday 2023-11-12 00:00:00    
startOfWeek(1731628800000, { weekStartsOn: 1 }) // Returns Monday 2023-11-13 00:00:00
startOfWeek(new Date("2023-11-15"), { weekStartsOn: 1 }) // Returns Monday 2023-11-13 00:00:00
startOfWeek(new Date("invalid date"), { weekStartsOn: 1 }) // Returns undefined
```


#### working:
1. get Day Index as per current date:
  - Uses `getDay()` method to get the current day index (0-6)
  - Example: If today is Wednesday, `getDay()` returns 3

2. Day Difference Calculation:
  - Calculates the difference between the current day and the specified week start day
  - Example: If today is Wednesday (3) and weekStartsOn is sunday (0), the difference is 3 days
  - If today is Wednesday (3) and weekStartsOn is Monday (1):
  - Difference = 3 - 1 = 2 days 
  

3. Millisecond Adjustment:
  - Converts the day difference to milliseconds (1 day = 86400000 milliseconds)
  - Subtracts these milliseconds from the current date to reach the week's start
  - Example: 2 days = 2 * 86400000 = 172800000 milliseconds, 
  - (Today's time stamp - 172800000 milliseconds)
  so it wiil be like this (Today's time stamp) - 2 * (milliseconds in one day); 

4. Time Normalization:
  - Sets the time to midnight (00:00:00.000)
  - Ensures consistent start-of-day timing

Example:
```javascript
// If today is Wednesday 2023-11-15
startOfWeek(new Date(), { weekStartsOn: 1 }) // Returns Monday 2023-11-13 00:00:00
```


#### [NOTE]
- If the date is invalid, it returns undefined
- If no date is provided, it uses the instance's date
- If the date is a string or timestamp, it converts it to a Date object
- If the date is already a Date object, it uses it directly
- notmalization of `weekStartsOn` and  `calculated diffrence between days` these two notmalization is done like this
- Normalize weekStartsOn to 0–6
 ` weekStartsOn = ((weekStartsOn % 7) + 7) % 7;`
- Normalize the calculated difference between days to 0–6
 `diff = (currentDay - weekStartsOn + 7) % 7;`

### `eachDayOfInterval({ start, end })`
Returns array of dates between two dates.
- `start`: Start date (Date object or string)
- `end`: End date (Date object or string)
- Returns: Array of Date objects

### `getWeekOfYear(date, { weekStartsOn = 0 })`
Calculates week number of the year.
- `date`: Date to check
- `weekStartsOn`: First day of week (0 = Sunday)
- Returns: Week number

### `getFullMonth(firstDateOfMonth)`
Gets all dates of a month organized by weeks.
- `firstDateOfMonth`: First date of month (Date object or string)
- Returns: Array of weekly date arrays
