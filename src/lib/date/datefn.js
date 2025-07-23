
export const DateFn = function (date = new Date()) {
  this.date = date;
  this.eachDayOfInterval = this.eachDayOfInterval.bind(this);
}

DateFn.prototype.millisecond = function (args, options = {}) {
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

  return new Date(dateRef.getTime() - diff * msInDays);
}



DateFn.prototype.endOfWeek = function (date, { weekStartsOn = 0 } = {}) {
  
  
}

/**
 * Returns an array of Date objects between two dates, inclusive.
 * @param {{ start: Date | string, end: Date | string }} param0 - Start and end of the interval
 * @returns {Date[]} Array of Date objects from start to end
 */
DateFn.prototype.eachDayOfInterval = function ({ start, end }) {

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

DateFn.prototype.getDaysInWeek = function () {
}

DateFn.prototype.getWeekOfYear = function (
  date = new Date(), { weekStartsOn = 0 }
) {
  const year = date.getFullYear();

  const startOfYear = new Date(year, 0, 1);

  const firstWeekStart = new Date(startOfYear);
  firstWeekStart.setDate(firstWeekStart.getDate() - ((firstWeekStart.getDay() + 7 - weekStartsOn) % 7));

  const msInWeek = this.millisecond("--weeks");

  const diff = date.getTime() - firstWeekStart.getTime();

  const weeksPassed = Math.floor(diff / msInWeek) + 1;
  return weeksPassed;
}

DateFn.prototype.getFullMonth = function (firstDateOfMonth) {

  if ((!(firstDateOfMonth instanceof Date) && typeof firstDateOfMonth !== "string")) {
    return Error("Invalid Date format: firstDateOfMonth should be Date | String");
  }

  // console.log(this.millisecond("--hours")); 
  let _getFullMonth = [];

  const firstDate = (firstDateOfMonth instanceof Date) ? firstDateOfMonth : new Date(firstDateOfMonth);
  const startDate = this.startOfWeek(firstDate, { weekStartsOn: 0 });
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); 
  // this.endOfWeek(new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0), { weekStartsOn: 0 });
  // console.log({firstDate, startDate, endDate});  
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
    // _getFullMonth[this.getWeekOfYear(currentDate, { weekStartsOn: 0 })] = week
    _getFullMonth.push({ [this.getWeekOfYear(currentDate, { weekStartsOn: 0 })]: week })
  }
  return _getFullMonth; 
}
