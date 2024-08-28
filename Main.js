function main() {
  const slack = new Slack();

  for (const event of listUpcomingEvents().reverse()) {
    console.log(event);

    if (event.visibility !== "private") {
      const endDate = new Date(event.end.dateTime);

      switch (event.eventType) {
        case "default":
          if (event.attendees) {
            const email = Session.getEffectiveUser().getEmail();

            for (const attendee of event.attendees) {
              if (attendee.email === email) {
                if (attendee.responseStatus === "declined") break;

                return slack.setStatus(event.summary, ":spiral_calendar_pad:", endDate).setAway(false);
              }
            }
          }

          break;
        case "outOfOffice":
          let emoji = ":no_entry:";
          if (event.summary) {
            if (event.summary.match(/vacation/i)) {
              emoji = ":palm_tree:";
            } else if (event.summary.match(/doctor\s+appointment/i)) {
              emoji = ":syringe:";
            } else if (event.summary.match(/(no\s+power|power\s+outage)/i)) {
              emoji = ":electric_plug:"
            }
          }

          return slack.setStatus(event.summary, emoji, endDate).setAway();
      }
    }
  }

  const nextWorkingDateTime = getNextWokringDateTime();
  if (nextWorkingDateTime) {
    return slack.setStatus("Outside working hours", ":afk:", nextWorkingDateTime).setAway();
  }

  return slack.resetAway();
}
