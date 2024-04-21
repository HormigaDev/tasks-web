const routes = [
  {
    path: "/",
    component: () => import("layouts/DeskTopLayout.vue"),
    children: [
      { path: "tasks", component: () => import("pages/TasksPage.vue") },
      { path: "calendar", component: () => import("pages/CalendarPage.vue") },
      { path: "affairs", component: () => import("pages/AffairsPage.vue") },
      { path: "settings", component: () => import("pages/SettingsPage.vue") },
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
