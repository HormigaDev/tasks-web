function getLastDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
function getNameofDay(date = new Date()) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

export function getCalendar(date = new Date()) {
  let calendar = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
  ];
  const lastDay = getLastDay(date);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  let day = 1;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        calendar[i][j] = "";
      } else if (day > lastDay) {
        calendar[i][j] = "";
      } else {
        calendar[i][j] = day;
        day++;
      }
    }
  }
  let newCalendar = [];
  for (let i = 0; i < calendar.length; i++) {
    for (let j = 0; j < calendar[i].length; j++) {
      newCalendar.push(calendar[i][j]);
    }
  }
  return newCalendar;
}
