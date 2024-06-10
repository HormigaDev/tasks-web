import Storage from "src/Storage";
import { getConfig } from "./configs";

const storage = new Storage();
storage.set("theme", "dark");
storage.set("configurations", {});
const configs = [
  "groupNotifications",
  "defaultPriority",
  "mainView",
  "notificationSound",
  "showNotifications",
  "allowNotificationsFor-high",
  "allowNotificationsFor-urgent",
  "allowNotificationsFor-normal",
  "allowNotificationsFor-low",
];

getConfig("theme").then((value) => {
  if (value) {
    storage.set("theme", value);
  }
});

for (const config of configs) {
  getConfig(config).then((value) => {
    let configurations = storage.get("configurations");
    configurations[config] = value;
    storage.set("configurations", configurations);
  });
}

setInterval(() => {
  getConfig("theme").then((value) => {
    if (value) {
      storage.set("theme", value);
    }
  });
  for (const config of configs) {
    getConfig(config).then((value) => {
      let configurations = storage.get("configurations");
      configurations[config] = value;
      storage.set("configurations", configurations);
    });
  }
}, 1000);

export default storage;
