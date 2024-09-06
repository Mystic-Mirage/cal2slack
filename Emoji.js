const OUT_OF_OFFICE_SHEET = "OutOfOffice";
const MISC_SHEET = "Misc";

/**
 * Return colon if string is not colon and empty string if it is
 *
 * @param {string} str
 * @returns {":" | ""}
 */
function colon(str) {
  return str === ":" ? "" : ":";
}

/**
 * Add colons around emoji name
 *
 * @param {([string, string])[]} arr
 * @returns {([string, string])[]}
 */
function addColons(arr) {
  return arr.map(([key, value]) => [key, colon(value.substring(0, 1)) + value + colon(value.substring(-1))]);
}

class Emoji {
  constructor() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const outOfOfficeSheet = ss.getSheetByName(OUT_OF_OFFICE_SHEET);
    const miscSheet = ss.getSheetByName(MISC_SHEET);

    /** @private */
    this.outOfOfficeEmoji = addColons(outOfOfficeSheet.getDataRange().getValues().reverse());
    /** @private */
    this.otherEmoji = Object.fromEntries(addColons(miscSheet.getDataRange().getValues()));
  }

  /**
   * Return other emoji by name
   *
   * @param {string} key
   */
  get(key) {
    return this.otherEmoji[key] || "";
  }

  /**
   * Match out-of-office emoji by string
   *
   * @param {string} str
   * @returns {string}
   */
  match(str) {
    for (const [regexp, emoji] of this.outOfOfficeEmoji) {
      if (new RegExp(regexp, "i").test(str)) return emoji;
    }
    return this.outOfOfficeEmoji[0][1];
  }
}
