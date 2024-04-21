<template>
  <q-page class="flex column">
    <CalendarTasks
      :taskList="tasksDay"
      :show="showTasks"
      :taskdate="dateForTasks"
      @update:show="showTasks = $event"
      @update:showtask="viewTask"
      @update:newtask="newTask"
      v-if="showTasks"
    />
    <TaskComponent
      :task="task"
      :show="showTask"
      @update:show="showTask = $event"
    />
    <NewTaskComponent
      :show="showNewTask"
      :taskdate="newTaskDate"
      @update:show="showNewTask = $event"
    />
    <div class="q-mt-sm flex row justify-center" style="height: 32px">
      <q-icon
        name="chevron_left"
        class="cursor-pointer calendar-chevron"
        @click="selectMonth('prev')"
      />
      <div class="text-h6 text-center" style="min-width: 320px">
        {{ months[date.month] }} of {{ date.year }}
      </div>
      <q-icon
        name="chevron_right"
        class="cursor-pointer calendar-chevron"
        @click="selectMonth('next')"
      />
    </div>
    <div>
      <div class="calendar-row q-mt-sm">
        <div v-for="_day in days" :key="_day">{{ _day }}day</div>
      </div>
      <div class="calendar-row" style="overflow: auto">
        <div
          v-for="(day, i) in calendar"
          :key="i"
          :class="
            ('0' + day).slice(-2) === ('0' + date.day).slice(-2) &&
            new Date().getMonth() === date.month &&
            new Date().getFullYear() === date.year
              ? 'calendar-day calendar-day-now'
              : 'calendar-day' + (day === '' ? ' calendar-day-empty' : '')
          "
          @click="showTasksData(day)"
        >
          <small
            :class="'calendar-id ' + (isWeekend(day) ? 'calendar-weekend' : '')"
            >{{ day }}</small
          >
          {{ (data = searchInDay(day)) ? "" : "" }}
          <div
            v-if="data.tasks.length > 0 || data.number > 0"
            class="flex column justify-end"
            style="height: 100%"
          >
            <div
              v-for="(task, i) in data.tasks"
              :key="i"
              class="flex q-mb-xs q-pl-sm"
            >
              <q-badge
                :label="task.name"
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                class="calendar-badge q-mr-xs"
                :color="task.color"
              />
              <q-icon
                :name="task.icon"
                class="q-ml-xs"
                :color="task.iconColor"
                v-if="task.status !== 'ended'"
              />
              <q-icon
                name="check"
                style="color: green"
                v-if="task.status === 'ended'"
                class="q-ml-xs"
              />
            </div>
            <small class="text-right q-pr-sm" v-if="data.number > 0"
              >+{{ data.number }} tasks</small
            >
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { getCalendar } from "src/functions/getCalendar.js";
import tasks from "src/data/tasksPage/rows.json";
import { useQuasar } from "quasar";

import CalendarTasks from "src/components/CalendarTasks.vue";
import TaskComponent from "src/components/TaskComponent.vue";
import NewTaskComponent from "src/components/NewTaskComponent.vue";

export default defineComponent({
  components: {
    CalendarTasks,
    TaskComponent,
    NewTaskComponent,
  },
  mounted() {
    const $q = useQuasar();
    $q.loading.hide();
  },
  setup() {
    const calendar = ref(getCalendar());
    const months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    };
    const days = ["Sun", "Mon", "Tues", "Wednes", "Thues", "Fri", "Satur"];

    return {
      tasks: ref(tasks),
      tasksDay: ref([]),
      calendar,
      months,
      date: ref({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
      }),
      days,
      getCalendar,
      data: null,
      showTasks: ref(false),
      showTask: ref(false),
      showNewTask: ref(false),
      task: ref(null),
      newTaskDate: ref(""),
      dateForTasks: ref(""),
    };
  },
  methods: {
    selectMonth(direction) {
      if (direction === "prev") {
        this.date.month -= 1;
        if (this.date.month < 0) {
          this.date.month = 11;
          this.date.year -= 1;
        }
      } else {
        this.date.month += 1;
        if (this.date.month > 11) {
          this.date.month = 0;
          this.date.year += 1;
        }
      }
      let date = new Date(this.date.year, this.date.month);
      this.calendar = getCalendar(date);
    },
    isWeekend(day) {
      let date = new Date(this.date.year, this.date.month, day);
      return date.getDay() === 0 || date.getDay() === 6;
    },
    filterTasks(day) {
      let date = `${this.date.year}-${("0" + (this.date.month + 1)).slice(
        -2
      )}-${("0" + day).slice(-2)}`;
      let tasks = this.tasks.filter((task) => task.created_at === date);
      let priorityValues = {
        urgent: 3,
        high: 2,
        normal: 1,
        low: 0,
      };
      tasks = tasks.sort((a, b) => {
        let ap = priorityValues[a.priority];
        let bp = priorityValues[b.priority];
        if (ap > bp) return -1;
        if (ap < bp) return 1;
        return 0;
      });
      let statusValues = {
        created: 1,
        ended: 0,
      };
      tasks = tasks.sort((a, b) => {
        let ast = statusValues[a.status];
        let bst = statusValues[b.status];
        if (ast > bst) return -1;
        if (ast < bst) return 1;
        return 0;
      });
      return tasks;
    },
    setIconsAndColors(tasks) {
      const icons = {
        urgent: "error",
        high: "warning",
        normal: "info",
        low: "circle",
      };
      const iconColors = {
        urgent: "negative",
        high: "warning",
        normal: "primary",
        low: "green",
      };
      tasks = tasks.map((t) => {
        t.color = "primary";
        let date1 = new Date(t.created_at);
        let date2 = new Date();
        if (date1 - date2 < 0) t.color = "negative";
        if (t.status === "ended") t.color = "green";
        t.icon = icons[t.priority];
        t.iconColor = iconColors[t.priority];
        return t;
      });
      return tasks;
    },
    searchInDay(day) {
      if (day === "") return { tasks: [], number: 0 };
      let tasks = this.filterTasks(day);
      let number = tasks.length - 2;
      tasks = tasks.slice(0, 2);
      tasks = this.setIconsAndColors(tasks);
      return { tasks, number };
    },
    showTasksData(day) {
      let tasks = this.filterTasks(day);
      tasks = this.setIconsAndColors(tasks);
      tasks = tasks.map((t) => {
        const [year, month, day] = t.created_at.split("-");
        t.isoDate = `${day}/${month}/${year}`;
        return t;
      });
      this.tasksDay = tasks;
      this.dateForTasks = `${this.date.year}-${(
        "0" +
        (this.date.month + 1)
      ).slice(-2)}-${("0" + day).slice(-2)}`;
      this.showTasks = true;
    },
    viewTask(task) {
      this.task = task;
      this.showTask = true;
    },
    newTask(date) {
      this.newTaskDate = date;
      this.showNewTask = true;
    },
  },
});
</script>
