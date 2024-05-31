import Cookies from "js-cookie";
import { Router } from "./router";

class API {
  constructor() {
    this.url = "http://localhost:19222";
  }
  __getToken() {
    return Cookies.get("token");
  }
  __query(route, method = "GET") {
    return fetch(`${this.url}${route}`, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.__getToken()}`,
      },
    });
  }
  __body(route, method = "POST", body) {
    return fetch(`${this.url}${route}`, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.__getToken()}`,
      },
      body: JSON.stringify(body),
    });
  }
  __redirect() {
    Router.push("/auth/login");
    return false;
  }
  async get(route) {
    const response = await this.__query(route);
    // if (response.status === 401) {
    //   return this.__redirect();
    // }
    return { data: await response.json(), status: response.status };
  }
  async post(route, body) {
    const response = await this.__body(route, "POST", body);
    if (response.status === 401) {
      if ((await response.json().code) === "unauthorized") {
        return await response.json();
      }
      // return this.__redirect();
    }
    return { data: await response.json(), status: response.status };
  }
  async put(route, body) {
    const response = await this.__body(route, "PUT", body);
    if (response.status === 401) {
      // return this.__redirect();
    }
    return { data: await response.json(), status: response.status };
  }
  async delete(route) {
    const response = await this.__query(route, "DELETE");
    if (response.status === 401) {
      // return this.__redirect();
    }
    return { data: await response.json(), status: response.status };
  }
}

export default new API();
