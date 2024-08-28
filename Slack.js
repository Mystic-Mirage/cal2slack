class Slack {
  constructor() {
    const props = PropertiesService.getScriptProperties().getProperties();
    /** @private */
    this.token = props.SLACK_TOKEN;
    /** @private */
    this.url = "https://slack.com/api/";
  }

  apiUrl(path) {
    return `${this.url}${path}`;
  }

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

  postApi(path, data) {
    const url = this.apiUrl(path);
    return this.post(url, data);
  }

  getStatus() {
    const result = this.postApi("users.profile.get");
    return [result.profile.status_text, result.profile.status_emoji, new Date(result.profile.status_expiration * 1000)];
  }

  isAway() {
    const result = this.postApi("users.getPresence");
    return result.presence == "away";
  }

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

  clearStatus() {
    return this.setStatus("", "", 0);
  }

  setAway(away=true) {
    if (this.isAway() !== away) {
      this.postApi("users.setPresence", {presence: away ? "away" : "auto"});
    }

    return this;
  }

  resetAway() {
    return this.setAway(false);
  }
}

function test() {
  const slack = new Slack();
  console.log(slack.getStatus());
}
