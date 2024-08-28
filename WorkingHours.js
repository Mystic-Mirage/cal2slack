// Time zone is the project's time zone
const WORKING_HOURS = {
  // Monday
  1: [
    "13:00-21:00",
  ],
  // Tuesday
  2: [
    "13:00-21:00",
  ],
  // Wednesday
  3: [
    "13:00-21:00",
  ],
  // Thursday
  4: [
    "13:00-21:00",
  ],
  // Friday
  5: [
    "13:00-21:00",
  ],
};

function* schedule(now) {
  let sched = [];
  for (let i = 0; i < 14; i++) {
    sched[i] = WORKING_HOURS[i % 7] || [];
  }

  let dayShift = 0;
  for (const day of sched.slice(now.getDay())) {
    for (const hours of day) {
      const [beginHour, beginMinute, endHour, endMinute] = hours.split(/\D/);

      const begin = new Date(now);
      begin.setHours(beginHour, beginMinute, 0, 0);
      begin.setDate(begin.getDate() + dayShift);

      const end = new Date(now);
      end.setHours(endHour, endMinute, 0, 0);
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
