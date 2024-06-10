<template>
  <q-dialog persistent v-model="showTasks" :dark="theme === 'dark'">
    <q-card
      :dark="theme === 'dark'"
      style="min-width: 80%; position: relative; height: 100%; max-height: 80vh"
      class="q-mt-xl"
    >
      <q-btn
        flat
        rounded
        dense
        icon="close"
        class="absolute-top-right q-mr-xs q-mt-xs"
        :color="theme === 'dark' ? 'white' : 'dark'"
        @click="
          () => {
            $emit('update:show', false);
            showTasks = false;
          }
        "
        style="z-index: 99"
      />
      <q-card-section class="flex">
        <div class="text-h6">
          {{ $t("pages.calendar.titles.tasks") }}
          <q-btn
            class="q-ml-md q-pl-xs q-pr-xs q-pt-none q-pb-none"
            size="sm"
            color="grey-8"
            icon="add"
            @click="newTask(date)"
          />
        </div>
      </q-card-section>
      <!-- Aquí colocamos la lista de las tareas de esta fecha -->
      <div
        v-if="tasks.length === 0"
        class="absolute-top-left flex flex-center"
        style="width: 100%; height: 60%; overflow: hidden; top: 20%"
      >
        <div
          :class="{
            'text-h4': true,
            'text-grey-7': theme === 'dark',
            'text-grey-6': theme !== 'dark',
          }"
        >
          {{ $t("pages.affairs.titles.nothing_to_show") }}
        </div>
      </div>
      <q-card-section style="overflow: auto; max-height: 60vh">
        <q-list>
          <q-item
            v-for="(task, i) in tasks"
            :key="i"
            clickable
            v-ripple
            @click="viewTask(task)"
          >
            <q-item-section>
              <q-item-label>{{ task.title }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge
                :color="priorities[task.priority.name].color"
                :label="priorities[task.priority.name].name"
                v-if="task.status !== 'ended'"
              />
              <q-icon name="check" v-else style="color: green" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, watch } from "vue";
import storage from "src/functions/virtualStorage";
import EventBus from "src/functions/EventBus";

export default {
  name: "CalendarTasks",
  props: {
    show: Boolean,
    taskList: Array,
    taskdate: String,
    _theme: String,
  },
  emits: ["update:show"],
  data(props) {
    const theme = ref(props._theme);
    const showTasks = ref(props.show);
    const tasks = ref(props.taskList);
    const date = ref(props.taskdate);
    const priorities = {
      urgent: {
        name: this.$t("pages.calendar.titles.priorities.urgent"),
        color: "negative",
      },
      high: {
        name: this.$t("pages.calendar.titles.priorities.high"),
        color: "warning",
      },
      normal: {
        name: this.$t("pages.calendar.titles.priorities.normal"),
        color: "primary",
      },
      low: {
        name: this.$t("pages.calendar.titles.priorities.low"),
        color: "grey-5",
      },
    };
    watch(
      () => props.show,
      (val) => {
        showTasks.value = val;
      }
    );
    watch(
      () => props._theme,
      (val) => {
        theme.value = val;
      }
    );

    EventBus.on("task-added", () => {
      showTasks.value = false;
    });

    return {
      theme,
      showTasks,
      tasks,
      priorities,
      colors: {
        primary: "white",
        negative: "red",
        green: "green",
      },
      date,
    };
  },
  methods: {
    viewTask(task) {
      this.$emit("update:showtask", task);
    },
    newTask(date) {
      console.log(storage.get("current_date"));
      this.$emit("update:newtask", date);
    },
  },
};
</script>
