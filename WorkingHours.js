// Time zone is the project's time zone
// Timezone of the script should match time zone of the spreadsheet

const WEEKDAYS = [
  "0 - Sunday",
  "1 - Monday",
  "2 - Tuesday",
  "3 - Wednesday",
  "4 - Thursday",
  "5 - Friday",
  "6 - Saturday",
];

/**
 * @param {Date} now
 * @yields {[Date, Date]}
 */
function* schedule(now) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const outOfOfficeSheet = ss.getSheetByName("WorkingHours");
  const workingHours = outOfOfficeSheet.getDataRange().getValues()

  const schedRaw = [];
  for (const [dayName, time1, time2] of workingHours) {
    schedRaw[dayName] = schedRaw[dayName] || [];
    if (time1 && time2 && time1 < time2) {
      schedRaw[dayName].push([time1, time2]);
    }
  }

  const sched = [];
  for (let i = 0; i < 14; i++) {
    sched[i] = (schedRaw[WEEKDAYS[i % 7]] || []).sort(([a], [b]) => a - b);
  }

  let dayShift = 0;
  for (const day of sched.slice(now.getDay())) {
    for (const [beginTime, endTime] of day) {
      const begin = new Date(now);
      begin.setHours(beginTime.getHours(), beginTime.getMinutes(), 0, 0);
      begin.setDate(begin.getDate() + dayShift);

      const end = new Date(now);
      end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
      end.setDate(end.getDate() + dayShift);

      yield [begin, end];

    }

    dayShift++;
  }
}

function getNextWokringDateTime() {
  const now = new Date();
  const sched = schedule(now);

  for (const [begin, end] of sched) {
    if (now < begin) return begin;
    if (now < end) return null;
  }
}
