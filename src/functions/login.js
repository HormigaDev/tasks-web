import API from "src/API";
import Cookies from "js-cookie";

/**
 *
 * @param {string} email_username - The username or email of the user
 * @param {string} password - The password of the user
 * @returns {<boolean>}
 */
export default async function login(email_username, password) {
  const { data, status } = await API.post("/login", {
    email_username,
    password,
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
