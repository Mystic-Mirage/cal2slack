function listUpcomingEvents() {
  const calendarId = "primary";

  const timeMin = new Date();
  const timeMax = new Date(timeMin);
  timeMax.setSeconds(timeMax.getSeconds() + 1);

  const optionalArgs = {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime"
  };

  return Calendar.Events.list(calendarId, optionalArgs).items;
}

function testListUpcomingEvents() {
  const calendarId = "primary";

  const timeMin = new Date("2024-08-26 14:15");
  const timeMax = new Date(timeMin);
  timeMax.setSeconds(timeMax.getSeconds() + 1);

  const optionalArgs = {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime"
  };

  console.log(Calendar.Events.list(calendarId, optionalArgs).items);
}
