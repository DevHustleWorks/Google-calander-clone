
export const DateFn = function (date = new Date()) {
  this.date = date;
}



DateFn.prototype.millisecond = function (args, options = {}) {
  DateFn.call(this,  new Date());
  
  if (typeof args !== "string") {
    throw new Error("args must be a string");
  }

  const regex = /^--(hours|days|weeks|months)$/;
  const match = args.match(regex);

  if (!match) {
    throw new Error(
      "Invalid input: must be exactly one of --hour, --days, --weeks, or --months with no spaces or numbers"
    );
  }

  const type = match[1];

  const MS_MAP = {
    hours: 60 * 60 * 1000, 
    days: 24 * 60 * 60 * 1000, 
    weeks: 7 * 24 * 60 * 60 * 1000, 
    months: 30.44 * 24 * 60 * 60 * 1000  
  };

  return MS_MAP[type];
}



DateFn.prototype.startOfWeek = function (
  date = this.date, { weekStartsOn = 0 }
) {
  DateFn.call(this,  new Date());

  if (typeof date !== 'object' && typeof date !== 'string') return;

  if (!(date instanceof Date) && typeof date !== 'string' && typeof date !== 'number') {
    throw new Error("Invalid date input: must be a Date, string, or timestamp");
  }
   

  const inputDate = new Date(date);
  
  if (isNaN(inputDate)) throw new Error("Invalid date");
  
  const currentDay = inputDate.getDay();
  
  // Normalize weekStartsOn to 0–6
  weekStartsOn = ((weekStartsOn % 7) + 7) % 7;
  
  const diff = (currentDay - weekStartsOn + 7) % 7;
  
  const msInDays = this.millisecond("--days");

  return new Date(inputDate.getTime() - diff * msInDays);
}



DateFn.prototype.endOfWeek = function (date, { weekStartsOn = 0 } = {}) {
  DateFn.call(this,  new Date());
  
}

/**
 * Returns an array of Date objects between two dates, inclusive.
 * @param {{ start: Date | string, end: Date | string }} param0 - Start and end of the interval
 * @returns {Date[]} Array of Date objects from start to end
 */
DateFn.prototype.eachDayOfInterval = function ({ start, end }) {
  DateFn.call(this,  new Date());
  if (
    (!(start instanceof Date) && typeof start !== 'string') ||
    (!(end instanceof Date) && typeof end !== 'string')
  ) {
    throw new Error("Invalid input: start or end must be a Date or string");
  }


  if (
    (typeof start !== 'object' && typeof start !== 'string') &&
    (typeof end !== 'object' && typeof end !== 'string')
  ) return;

  let _eachDayOfInterval = new Array();

  let startDate = new Date(start);
  let endDate = new Date(end);
  // let diff = (startDate.getDay() - endDate.getDay()) * (-1);
  let msInDays = this.millisecond("--days")
  let weekStartsOn = startDate.getDay();

  for (let idx = startDate.getDay(); idx <= endDate.getDay(); idx++) {
    _eachDayOfInterval.push(
      new Date(+startDate + (idx - weekStartsOn) * msInDays)
    );
  }

  return _eachDayOfInterval;
}

// Returns an array of days in a week between two dates
// start and end should be Date or string
// start is inclusive, end is exclusive
// If start is not provided, it defaults to the start of the week of the current date
// Returns an array of strings representing the days of the week in short format (e.g., "Mon", "Tue", etc.)
DateFn.prototype.getDaysInWeek = function ({ start, end }) {
  DateFn.call(this,  new Date());

  if ((!(start instanceof Date) && typeof start !== 'string') ||
    (!(end instanceof Date) && typeof end !== 'string')
  ) {
    throw new Error("Invalid input: start or end must be a Date or string");
  }

  if (
    (typeof start !== 'object' && typeof start !== 'string') &&
    (typeof end !== 'object' && typeof end !== 'string')
  ) return;

  let _getDaysInWeek = new Array();

  let startDate = new Date(start);
  let endDate = new Date(end);

  let msInDays = this.millisecond("--days");

  let weekStartsOn = 0;  

  for (let idx = startDate.getDay(); idx <= endDate.getDay(); idx++) {
    _getDaysInWeek.push(
      new Date(+startDate + (idx - weekStartsOn) * msInDays).toLocaleDateString('en-US', {
         weekday: 'short',
      })
    );
  }

  return _getDaysInWeek;
}

// Returns the week of the year for a given date
// If date is not provided, it defaults to the current date
// If weekStartsOn is not provided, it defaults to 0 (Sunday)
// Returns the week number as an integer
DateFn.prototype.getWeekOfYear = function (
  date = new Date(), { weekStartsOn = 0 }
) {
  DateFn.call(this,  new Date());
  
  const year = date.getFullYear();

  const startOfYear = new Date(year, 0, 1);

  const firstWeekStart = new Date(startOfYear);
  firstWeekStart.setDate(firstWeekStart.getDate() - ((firstWeekStart.getDay() + 7 - weekStartsOn) % 7));

  const msInWeek = this.millisecond("--weeks");

  const diff = date.getTime() - firstWeekStart.getTime();

  const weeksPassed = Math.floor(diff / msInWeek) + 1;
  return weeksPassed;
}

// Returns an array of weeks in a month
// firstDateOfMonth should be a Date or string representing the first date of the month
// Returns an array of objects, each containing the week number as the key and an array of Date objects representing the days of that wee
DateFn.prototype.getFullMonth = function (firstDateOfMonth) {

  if ((!(firstDateOfMonth instanceof Date) && typeof firstDateOfMonth !== "string")) {
    return Error("Invalid Date format: firstDateOfMonth should be Date | String");
  }

  //  (this.millisecond("--hours")); 
  let _getFullMonth = {};
  
  if(firstDateOfMonth === "Invalid Date") return ; 
  const firstDate = (firstDateOfMonth instanceof Date) 
      ? new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), 1)  
      : new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), 1)
  const startDate = this.startOfWeek(firstDate, { weekStartsOn: 0 });
  const endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0); 

  const ms = this.millisecond("--weeks");

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 7)
  ) {
    const week = this.eachDayOfInterval({
      start: this.startOfWeek(currentDate, { weekStartsOn: 0 }),
      end: new Date(currentDate.getTime() + ms - 1),
    });
    _getFullMonth[this.getWeekOfYear(currentDate, { weekStartsOn: 0 })] = week
    // _getFullMonth.push({ [this.getWeekOfYear(currentDate, { weekStartsOn: 0 })]: week })
  }
  return _getFullMonth; 
}


DateFn.prototype.getFullWeek = function ({ start, end }) {
  DateFn.call(this,  new Date());
  if ((!(start instanceof Date) && typeof start !== 'string') ||
    (!(end instanceof Date) && typeof end !== 'string')) {
    throw new Error("Invalid input: start or end must be a Date or string");
  }

  if (
    (typeof start !== 'object' && typeof start !== 'string') &&
    (typeof end !== 'object' && typeof end !== 'string')
  ) return;

  let _getFullWeek = [];

  let startDate = new Date(start);
  let endDate = new Date(end);

  let msInDays = this.millisecond("--days");

  for (let idx = startDate.getDay(); idx <= endDate.getDay(); idx++) {
    _getFullWeek.push(
      new Date(+startDate + (idx - startDate.getDay()) * msInDays)
    );
  }

  return _getFullWeek;

}
