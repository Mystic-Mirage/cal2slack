/**
 * Sort working hours
 *
 * @param {Events.SheetsOnEdit} e
 */
function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() === WORKING_HOURS_SHEET) {
    console.log(sheet.getName());
    sheet.getRange(1,1,100,3).sort([1, 2, 3]);
  }
}
