/**
 * Sort working hours
 *
 * @param {Events.SheetsOnEdit} e
 */
function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() === WORKING_HOURS_SHEET) {
    const row = e.range.getRow();
    const editRange = sheet.getRange(row, 1, 1, 3);
    const values = editRange.getValues()[0];
    if (values.every(value => value) || values.every(value => !value)) {
      sheet.getRange(1,1,100,3).sort([1, 2, 3]);
    }
  }
}
