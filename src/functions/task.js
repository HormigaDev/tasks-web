import API from "src/API";

export async function getTasks(
  page = 0,
  limit = 10,
  categories = [0],
  search = "",
  order_by = "run_date",
  asc_desc = "asc",
  priority = 0,
  fixed = false,
  show_archives = false,
  show_endeds = false
) {
  if (!categories.length) categories = [0];
  const queries = new URLSearchParams();
  queries.append("page", page);
  queries.append("limit", limit);
  queries.append("categories", categories.join(","));
  queries.append("search", search);
  queries.append("order_by", order_by);
  queries.append("asc_desc", asc_desc);
  queries.append("priority", priority);
  queries.append("fixed", fixed ? 1 : 0);
  queries.append("show_archives", show_archives ? 1 : 0);
  queries.append("show_endeds", show_endeds ? 1 : 0);
  const { data, status } = await API.get(`/get-tasks?${queries.toString()}`);
  // console.log(data.message);
  return {
    data,
    status,
  };
}

export async function newTask(
  title,
  description,
  run_date,
  priority_id,
  categories = []
) {
  const { data, status } = await API.post("/new-task", {
    title,
    description,
    run_date,
    priority_id,
    categories: JSON.stringify(categories),
  });

  // console.log(data?.message);
  return { data, status };
}

export async function editTask(task_id, props) {
  if (!props) props = {};
  const {
    title,
    description,
    status,
    fixed,
    priority_id,
    run_date,
    categories,
  } = props;
  const { data, status: status_ } = await API.put("/edit-task", {
    task_id,
    title,
    description,
    status,
    fixed: fixed ? 1 : 0,
    priority_id,
    run_date,
    categories: categories?.join(",") ?? "",
  });
  // console.log(data?.message);
  return { data, status: status_ };
}

export async function deleteTask(task_id) {
  console.log("ID de la tarea a eliminar: ", task_id);
  const { data, status } = await API.delete(`/delete-task?task_id=${task_id}`);
  // console.log(data?.message);
  return { data, status };
}

export async function getTasksOfDay(date) {
  const { data, status } = await API.get(
    `/get-tasks-calendar-day?date=${date}`
  );
  // console.log(data.message);
  return { data, status };
}

export async function getTasksByMonth(month, year) {
  const { data, status } = await API.get(
    `/get-tasks-by-month?month=${month}&year=${year}`
  );
  // console.log(data.message);
  return { data, status };
}
