const DEFAULT_COLUMN_WIDTH = 100;
const COLUMN_WIDTH = 200;

const WORKING_HOURS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]

const EventType = {
  NO_EVENT: "NoEvent",
  OUTSIDE_WORKING_HOURS: "OutsideWorkingHours",
  IN_A_MEETING: "InAMeeting",
  ONE_TO_ONE: "OneToOne",
}

/**
 * Init configuration sheets
 */
function init() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // create working hours sheet
  let workingHoursSheet = ss.getSheetByName(WORKING_HOURS_SHEET);
  if (!workingHoursSheet) {
    for (workingHoursSheet of ss.getSheets()) {
      if (workingHoursSheet.getSheetId() === 0) {
        workingHoursSheet.setName(WORKING_HOURS_SHEET);
        break;
      }
    }
  }

  let outOfOfficeSheet = ss.getSheetByName(OUT_OF_OFFICE_SHEET);
  if (!outOfOfficeSheet) {
      outOfOfficeSheet = ss.insertSheet();
      outOfOfficeSheet.setName(OUT_OF_OFFICE_SHEET);
  }

  let miscSheet = ss.getSheetByName(MISC_SHEET);
  if (!miscSheet) {
    miscSheet = ss.insertSheet();
    miscSheet.setName(MISC_SHEET);
  }

  // set column width for rest of the sheets
  for (const sheet of [outOfOfficeSheet, miscSheet]) {
    for (const columnNum of [1, 2]) {
      if (outOfOfficeSheet.getColumnWidth(columnNum) === DEFAULT_COLUMN_WIDTH) {
        outOfOfficeSheet.setColumnWidth(columnNum, COLUMN_WIDTH);
      }
    }
  }

  // fill default working hours
  if (!workingHoursSheet.getRange(1, 1).getValue()) {
    const workingHours = [WORKING_HOURS[8], WORKING_HOURS[17]];
    workingHoursSheet.getRange(1, 1, 5, 3).setValues([
      [WEEKDAYS[1], ...workingHours],
      [WEEKDAYS[2], ...workingHours],
      [WEEKDAYS[3], ...workingHours],
      [WEEKDAYS[4], ...workingHours],
      [WEEKDAYS[5], ...workingHours],
    ]);
    const weekdaysRange = workingHoursSheet.getRange(1, 1, 10, 1);
    const weekdaysRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(WEEKDAYS)
      .build();
    weekdaysRange.setDataValidation(weekdaysRule);
    const hoursRange = workingHoursSheet.getRange(1, 2, 10, 2);
    const hoursRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(WORKING_HOURS)
      .build();
    hoursRange.setDataValidation(hoursRule);
  }

  // fill out-of-office defaults
  if (!outOfOfficeSheet.getRange(1, 2).getValue()) {
    const outOfOfficeRange = outOfOfficeSheet.getRange(1, 1, 6, 2);
    outOfOfficeRange.setValues([
      ["", "no_entry"],
      ["vacation", "palm_tree"],
      ["doctor", "syringe"],
      ["sick", "face_with_thermometer"],
      ["connection|internet", "internet-problems"],
      ["power|electricity", "electric_plug"],
    ]);
  }

  // fill other sheet
  if (!miscSheet.getRange(1, 1).getValue()) {
    const otherRange = miscSheet.getRange(1, 1, 2, 2);
    otherRange.setValues([
      [EventType.NO_EVENT, ""],
      [EventType.OUTSIDE_WORKING_HOURS, "afk"],
      [EventType.IN_A_MEETING, "spiral_calendar_pad"],
      [EventType.ONE_TO_ONE, "busts_in_silhouette"],
    ]);
  }
}
