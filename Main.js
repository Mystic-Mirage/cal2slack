/**
 * The main function that should be triggered every minute
 */
function main() {
  const emoji = new Emoji();
  const slack = new Slack();

  for (const event of listUpcomingEvents().reverse()) {
    console.log(event);

    if (event.visibility !== "private") {
      const endDate = new Date(event.end.dateTime);
      // don't set status if an event ends in less than a minute
      if ((endDate - new Date()) < 60000) continue;

      switch (event.eventType) {
        case "default":  // regular event
          if (event.attendees) {
            const email = Session.getEffectiveUser().getEmail();

            for (const attendee of event.attendees) {
              if (attendee.email === email) {
                // don't set status if a user declined an event
                if (attendee.responseStatus === "declined") break;

                // one-to-one
                if (event.attendees.length === 2) {
                  return slack.setStatus(event.summary, emoji.get(EventType.ONE_TO_ONE), endDate).setAway(false);
                }

                // in a meeting
                return slack.setStatus(event.summary, emoji.get(EventType.IN_A_MEETING), endDate).setAway(false);
              }
            }
          }

          break;
        case "outOfOffice": // out of office event
          return slack.setStatus(event.summary, emoji.match(event.summary), endDate).setAway();
      }
    }
  }

  const nextWorkingDateTime = getNextWorkingDateTime();
  if (nextWorkingDateTime) {
    // AFK if not within working hours
    return slack.setStatus("Outside working hours", emoji.get(EventType.OUTSIDE_WORKING_HOURS), nextWorkingDateTime).setAway();
  }

  // set an emoji for no-event time if configured but keep if there's custom one set
  const noEventEmoji = emoji.get(EventType.NO_EVENT);
  if (noEventEmoji) {
    slack.setDefaultStatus("", noEventEmoji);
  }

  // reset presence
  return slack.resetAway();
}
