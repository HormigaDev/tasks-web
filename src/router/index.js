import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import Cookies from "js-cookie";

let Router; // Declara una variable para el router

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!Cookies.get("token")) {
        next({
          path: "/auth/login",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});

export { Router }; // Exporta la instancia del router
