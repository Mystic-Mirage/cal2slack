/**
 * The main function that should be triggered every minute
 */
function main() {
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

                // on a meeting
                return slack.setStatus(event.summary, ":spiral_calendar_pad:", endDate).setAway(false);
              }
            }
          }

          break;
        case "outOfOffice": // out of office event
          let emoji = ":no_entry:";
          if (event.summary) {
            if (event.summary.match(/vacation/i)) {  // vacation
              emoji = ":palm_tree:";
            } else if (event.summary.match(/doctor\s+appointment/i)) {  // gotta visit a doctor
              emoji = ":syringe:";
            } else if (event.summary.match(/(no\s+power|power\s+outage)/i)) {  // issues with electricity
              emoji = ":electric_plug:"
            }
          }

          return slack.setStatus(event.summary, emoji, endDate).setAway();
      }
    }
  }

  const nextWorkingDateTime = getNextWokringDateTime();
  if (nextWorkingDateTime) {
    // AFK if not within working hours
    return slack.setStatus("Outside working hours", ":afk:", nextWorkingDateTime).setAway();
  }

  // reset presence if there is no events but keep current status for custom ones
  return slack.resetAway();
}
