/**
 * Working with Slack API
 */
class Slack {
  constructor() {
    const props = PropertiesService.getScriptProperties().getProperties();
    /** @private */
    this.token = props.SLACK_TOKEN;
    /** @private */
    this.url = "https://slack.com/api/";
  }

  /**
   * Generate API URL with specified path
   *
   * @private
   * @param {string} path
   * @returns {string}
   */
  apiUrl(path) {
    return `${this.url}${path}`;
  }

  /**
   * Perform a POST-request
   *
   * @private
   * @param {string} url
   * @param {{[p: string]: any}} [data]
   */
  post(url, data) {
    const params = {
      method: "post",
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
    if (data) {
      params.payload = JSON.stringify(data);
    }

    const result = UrlFetchApp.fetch(url, params);
    const response = result.getContentText();
    console.log(response);
    return JSON.parse(response);
  }

  /**
   * Slack API helper for POST-requests
   *
   * @private
   * @param {string} path
   * @param {{[p: string]: any}} [data]
   */
  postApi(path, data) {
    const url = this.apiUrl(path);
    return this.post(url, data);
  }

  /**
   * Get current Slack status
   *
   * @returns {[text, text, Date]}
   */
  getStatus() {
    /** @type {{profile: {status_text: string, status_emoji: string, status_expiration: number}}} */
    const result = this.postApi("users.profile.get");
    return [result.profile.status_text, result.profile.status_emoji, new Date(result.profile.status_expiration * 1000)];
  }

  /**
   * Check user presence
   *
   * @returns {boolean}
   */
  isAway() {
    /** @type {{presence: string}} */
    const result = this.postApi("users.getPresence");
    return result.presence === "away";
  }

  /**
   * Set user's Slack status
   *
   * @param {string} text
   * @param {string} emoji
   * @param {Date} expirationDate
   * @returns {Slack}
   */
  setStatus(text, emoji, expirationDate) {
    if (!this.getStatus().every((value, index) => value.valueOf() === arguments[index].valueOf())) {
      const expiration = expirationDate.valueOf() / 1000 | 0;
      const data = {
        profile: {
          status_text: text,
          status_emoji: emoji,
          status_expiration: expiration,
        }
      };
      this.postApi("users.profile.set", data);
    }

    return this;
  }

  /**
   * Reset user's Slack status
   *
   * @returns {Slack}
   */
  clearStatus() {
    return this.setStatus("", "", 0);
  }

  /**
   * Set user presence
   *
   * @param {boolean} [away=true]
   * @returns {Slack}
   */
  setAway(away=true) {
    if (this.isAway() !== away) {
      this.postApi("users.setPresence", {presence: away ? "away" : "auto"});
    }

    return this;
  }

  /**
   * Reset user presence
   *
   * @returns {Slack}
   */
  resetAway() {
    return this.setAway(false);
  }
}
