import API from "src/API.js";

export async function changePassword(prev_password, new_password) {
  const { data, status } = await API.put("/change-password", {
    prev_password,
    new_password,
  });
  console.log(data.message);
  return { data, status };
}

export async function getUserInfo() {
  const { data, status } = await API.get("/get-user");
  // console.log(data.message);
  return { data, status };
}

export async function getUsername() {
  const { data, status } = await API.get("/get-username");
  // console.log(data.message);
  return { data, status };
}

export async function updateUsername(newUsername) {
  const { data, status } = await API.put("/update-username", {
    newUsername,
  });
  // console.log(data.message);
  return { data, status };
}

export async function getNotifications() {
  const { data, status } = await API.get("/get-notifications");
  // console.log(data.message);
  return { data, status };
}
export async function ignoreNotification(notification_id, priority_name) {
  const { data, status } = await API.put("/ignore-notification", {
    priority_name,
    notification_id,
  });
  // console.log(data.message);
  return { data, status };
}

export async function getStats(dateStart, dateEnd) {
  const { data, status } = await API.get(
    `/user-stats?dateStart=${dateStart}&dateEnd=${dateEnd}`
  );
  // console.log(data);
  return { data, status };
}
