/**
 * Get current calendar events
 *
 * @returns {Calendar.Schema.Event[]}
 */
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
