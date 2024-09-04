const SLACK_USER_TOKEN_PROPERTY_NAME = "SLACK_TOKEN";
const Text = {
  SETTINGS: "⚙️ Settings",
  SLACK_USER_TOKEN_TITLE: "👤 Slack User Token",
  SLACK_USER_TOKEN_NOTE: "(write-only field)",
};


/**
 * Create a settings menu
 */
function onOpen() {
  init();

  const ui = SpreadsheetApp.getUi();
  ui.createMenu(Text.SETTINGS)
    .addItem(Text.SLACK_USER_TOKEN_TITLE, addSlackUserToken.name)
    .addToUi();
}

function addSlackUserToken() {
  const ui = SpreadsheetApp.getUi();

  const result = ui.prompt(Text.SLACK_USER_TOKEN_TITLE, Text.SLACK_USER_TOKEN_NOTE, ui.ButtonSet.OK_CANCEL);
  const button = result.getSelectedButton();
  const value = result.getResponseText();
  if (button === ui.Button.OK) {
    const sp = PropertiesService.getScriptProperties();
    sp.setProperty(SLACK_USER_TOKEN_PROPERTY_NAME, value);
  }
}
