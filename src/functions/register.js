import API from "src/API";
import Cookies from "js-cookie";

export default async function register(
  username,
  email,
  password,
  ddd,
  ph_number,
  ph_type,
  avatar_url
) {
  const { data, status } = await API.post("/new-user", {
    username,
    email,
    password,
    ddd,
    ph_number,
    ph_type,
    avatar_url,
  });
  if (data.token) {
    Cookies.set("token", data.token, {
      expires: 365,
      secure: true,
      sameSite: "strict",
    });
    delete data.token;
    console.log(data.message);
    return { status, res: true };
  } else {
    console.log(data.message);
    return { status, res: false };
  }
}
