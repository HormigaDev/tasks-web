import API from "src/API.js";

export async function openDevTools(password) {
  const { status } = await API.post("/open-dev-tools", {
    password,
  });
  return { status };
}
