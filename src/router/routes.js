const routes = [
  {
    path: "/main",
    component: () => import("layouts/DeskTopLayout.vue"),
    children: [
      {
        path: "tasks",
        component: () => import("pages/TasksPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "calendar",
        component: () => import("pages/CalendarPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "affairs",
        component: () => import("pages/AffairsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        component: () => import("pages/SettingsPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthMainLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("../pages/AuthLoginPage.vue"),
      },
      {
        path: "register",
        component: () => import("../pages/AuthRegisterPage.vue"),
      },
      {
        path: "dev-tools",
        component: () => import("pages/OpenDevTools.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
