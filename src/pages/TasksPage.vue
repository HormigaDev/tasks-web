<template>
  <q-page class="flex" style="height: 100%; overflow: auto">
    <div id="t-tasks-content">
      <NewTaskComponent
        :show="showForm"
        @update:show="showForm = $event"
        @update:save="saveTask"
      />
      <CategoriesComponent
        :show="showNewCategoryForm"
        @update:show="showNewCategoryForm = $event"
      />
      <QuasarTableComponent
        @update:newtask="showNewTaskForm"
        @update:archivetask="archivedTaskHandler"
        @update:deletetask="deletedTaskHandler"
        @update:showtask="handleShowTask"
        @update:newcategory="showNewCategoryForm = $event"
      />
      <TaskComponent
        :task="task"
        @update:show="showTask = false"
        @update:edittask="
          () => {
            showForm = true;
            showTask = false;
          }
        "
        :show="showTask"
      />
      <q-btn
        color="grey-7"
        dark
        size="md"
        class="fixed-bottom-right q-mr-md q-mb-md"
        @click="showFixedTasks"
      >
        <i class="fa fa-thumbtack" style="transform: rotate(45deg)"></i
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import QuasarTableComponent from "src/components/QuasarTableComponent.vue";
import NewTaskComponent from "src/components/NewTaskComponent.vue";
import TaskComponent from "src/components/TaskComponent.vue";
import CategoriesComponent from "src/components/CategoriesComponent.vue";
import EventBus from "src/functions/EventBus";

import rows from "src/data/tasksPage/rows.json";

export default defineComponent({
  name: "TasksPage",
  mounted() {
    const $q = useQuasar();
    $q.loading.hide();
  },
  setup() {
    const $q = useQuasar();
    const showForm = ref(false);
    const showTask = ref(false);

    return {
      showForm,
      showTask,
      showMessage: (type, message) => {
        const messageTypes = {
          success: {
            color: "positive",
            icon: "verified",
          },
          error: {
            color: "negative",
            icon: "error",
          },
          warning: {
            color: "warning",
            icon: "warning",
          },
          info: {
            color: "info",
            icon: "notification_important",
          },
        };
        const { color, icon } = messageTypes[type];
        const [textColor, position, multiline, actions, timeout] = [
          "white",
          "bottom-right",
          true,
          null,
          1500,
        ];

        $q.notify({
          color,
          icon,
          textColor,
          position,
          message,
          multiline,
          actions,
          timeout,
        });
      },
      task: ref({}),
      tasks: ref(rows),
      showNewCategoryForm: ref(false),
    };
  },
  components: {
    QuasarTableComponent,
    NewTaskComponent,
    TaskComponent,
    CategoriesComponent,
  },
  methods: {
    showNewTaskForm() {
      this.showForm = true;
    },
    saveTask() {
      this.showForm = false;
      this.showMessage("success", "Task saved successfully");
    },
    archivedTaskHandler(ids) {
      let plural = ids.length > 1 ? "s" : "";
      if (ids.length > 0) {
        this.showMessage("info", `Task${plural} archived successfully`);
      } else {
        this.showMessage("warning", "No tasks selected");
      }
    },
    deletedTaskHandler(ids) {
      let plural = ids.length > 1 ? "s" : "";
      if (ids.length > 0) {
        this.showMessage("info", `Task${plural} deleted successfully`);
      } else {
        this.showMessage("warning", "No tasks selected");
      }
    },
    handleShowTask(task) {
      this.task = task;
      this.showTask = true;
    },
    showFixedTasks() {
      EventBus.emit("show-fixed-tasks");
    },
  },
});
</script>
