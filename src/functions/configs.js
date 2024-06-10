import API from "src/API.js";

export async function getLocale() {
  const { data, status } = await API.get(
    "/configuration?configuration=language"
  );
  // console.log(data);
  return data?.configuration;
}

export async function setConfig(config, value) {
  const { data, status } = await API.post("/configuration", {
    configuration: config,
    value: value,
  });
  // console.log(data.message);
  return { data, status };
}

export async function getConfig(config) {
  const { data } = await API.get(`/configuration?configuration=${config}`);
  // console.log(data.message);
  return data?.configuration;
}

export async function updateSchedule(
  weight = 1,
  time_start = "00:00",
  time_end = "00:00",
  weekdays = ["satur", "sun"],
  minutes = 5,
  hours = 0,
  days = 0
) {
  const { data, status } = await API.put("/update-schedule", {
    weight,
    time_start,
    time_end,
    weekdays,
    minutes,
    hours,
    days,
  });
  console.log(data?.message);
  return { data, status };
}

export async function getSchedule(priority) {
  const { data, status } = await API.get(`/get-schedule?priority=${priority}`);
  // console.log(data);
  return { data, status };
}
