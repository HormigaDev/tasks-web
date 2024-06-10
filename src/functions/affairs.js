import API from "src/API";

export async function getAffairs(
  search,
  page,
  limit,
  archiveds,
  order_by,
  asc_desc
) {
  const q = new URLSearchParams();
  q.append("search", search);
  q.append("page", page);
  q.append("limit", limit);
  q.append("archiveds", archiveds ? "true" : false);
  q.append("order_by", order_by);
  q.append("asc_desc", asc_desc);
  const { data, status } = await API.get(`/get-affairs?${q.toString()}`);
  // console.log(data.affairs);
  return {
    data,
    status,
  };
}

export async function getAffairTimelines(affair_id) {
  const { data, status } = await API.get(
    `/get-affair-timelines?affair_id=${affair_id}`
  );
  // console.log(data.message);
  return { data, status };
}

export async function newAffair(
  title,
  person_name,
  first_timeline_description
) {
  const { data, status } = await API.post("/new-affair", {
    title,
    person_name,
    first_timeline_description,
  });
  // console.log(data.message);
  return { data, status };
}

export async function newAffairTimeline(affair_id, title, description) {
  const { data, status } = await API.post("/new-affair-timeline", {
    affair_id,
    title,
    description,
  });
  console.log(affair_id);
  console.log(data.message);
  return { data, status };
}

export async function editAffair({ affair_id, title, person_name, status }) {
  const { data, status: _status } = await API.put("/edit-affair", {
    affair_id,
    title,
    person_name,
    status,
  });
  console.log(data.message);
  return { data, status: _status };
}

export async function deleteAffair(affair_id) {
  const { data, status } = await API.delete(
    `/delete-affair?affair_id=${affair_id}`
  );
  // console.log(data.message);
  return { data, status };
}

export async function editTimeline({
  affair_id,
  timeline_id,
  title,
  description,
}) {
  const { data, status } = await API.put("/edit-affair-timeline", {
    affair_id,
    timeline_id,
    title,
    description,
  });
  // console.log(data.message);
  return { data, status };
}

export async function deleteTimeline(affair_id, timeline_id) {
  const { data, status } = await API.delete(
    `/delete-affair-timeline?affair_id=${affair_id}&timeline_id=${timeline_id}`
  );
  // console.log(data.message);
  return { data, status };
}
