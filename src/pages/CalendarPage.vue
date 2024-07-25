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
      :_theme="theme"
    />
    <TaskComponent
      :task="task"
      :show="showTask"
      @update:show="showTask = $event"
      @update:edittask="editTask"
      :_theme="theme"
    />
    <NewTaskComponent
      :show="showNewTask"
      :taskdate="newTaskDate"
      @update:show="showNewTask = $event"
      :_theme="theme"
    />
    <div class="q-mt-sm flex row justify-center" style="height: 32px">
      <q-icon
        name="chevron_left"
        :class="{
          'cursor-pointer': true,
          'calendar-chevron': true,
          'text-dark': theme !== 'dark',
        }"
        @click="selectMonth('prev')"
      />
      <div class="text-h6 text-center" style="min-width: 320px">
        {{
          $t(
            `pages.calendar.titles.months.${("0" + (date.month + 1)).slice(-2)}`
          )
        }}
        {{ $t("pages.calendar.words.of") }} {{ date.year }}
      </div>
      <q-icon
        name="chevron_right"
        :class="{
          'cursor-pointer': true,
          'calendar-chevron': true,
          'text-dark': theme !== 'dark',
        }"
        @click="selectMonth('next')"
      />
    </div>
    <div>
      <div class="calendar-row q-mt-sm">
        <div v-for="_day in days" :key="_day">
          {{ $t(`pages.calendar.titles.weekdays.${_day}`) }}
        </div>
      </div>
      <div class="calendar-row" style="overflow: auto">
        <div
          v-for="(day, i) in calendar"
          :key="i"
          :class="{
            'calendar-day': true,
            'calendar-day-empty': day === '',
            'calendar-day-now':
              ('0' + day).slice(-2) === ('0' + date.day).slice(-2) &&
              now.getMonth() === date.month &&
              now.getFullYear() === date.year,
            't-light': theme !== 'dark',
          }"
          @click="day !== '' ? showTasksData(day) : null"
        >
          <small
            :class="{
              'calendar-id': true,
              'calendar-weekend': isWeekend(day),
              't-light': theme !== 'dark',
              't-bold': theme !== 'dark',
            }"
            >{{ day }}</small
          >
          <div
            class="calendar-tasks flex column justify-end q-pl-sm q-pr-sm"
            style="height: 100%"
          >
            <div
              v-for="task in searchInDay(day).tasks"
              :key="task.id + date.month"
              class="calendar-task row full-width flex justify-between flex-center"
            >
              <q-badge
                :label="task.title.substring(0, 20) + '...'"
                :class="
                  'full-width q-mt-xs q-mb-xs bg-' +
                  getColor(task.runDate, task.status)
                "
                v-if="canActualize"
                style="overflow: hidden; max-width: 85%"
              />
              <q-icon
                size="xs"
                :name="
                  task.status === 'ended' ? 'check' : task.categories[0].icon
                "
                v-if="canActualize"
                :color="
                  task.status === 'ended'
                    ? 'green-5'
                    : theme === 'dark'
                    ? 'white'
                    : 'grey-8'
                "
              />
            </div>
            <div
              v-if="searchInDay(day).total > 2"
              class="calendar-task-more full-width flex row justify-end"
            >
              <small>+{{ searchInDay(day).total - 2 }} tasks</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref, onBeforeUnmount } from "vue";
import { getCalendar } from "src/functions/getCalendar.js";
import { useQuasar, date as dt } from "quasar";
import { getTasksByMonth } from "src/functions/task";
import EventBus from "src/functions/EventBus";
import storage from "src/functions/virtualStorage";
import { Loop } from "src/functions/utils";

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
    const theme = ref(storage.get("theme"));

    const calendar = ref(getCalendar());
    const canActualize = ref(true);
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
    const showTasks = ref(false);
    const days = ["sun", "mon", "tues", "wednes", "thurs", "fri", "satur"];
    const now = new Date();
    const newTaskDate = ref("");
    const data = ref([]);
    const date = ref({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });
    const tasks = ref([]);

    const actualizeTasks = () => {
      getTasksByMonth(date.value.month + 1, date.value.year)
        .then(({ data, status }) => {
          if (status === 200) {
            tasks.value = data.tasks;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const loop = new Loop(() => {
      theme.value = storage.get("theme");
      actualizeTasks();
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    EventBus.on("deleted-task", () => {
      actualizeTasks();
      showTasks.value = false;
    });

    EventBus.on("task-added", () => {
      actualizeTasks();
      showTasks.value = false;
    });

    EventBus.on("finalized-task", () => {
      actualizeTasks();
      showTasks.value = false;
    });

    return {
      theme,
      now,
      data,
      tasks,
      tasksDay: ref([]),
      calendar,
      months,
      date,
      days,
      getCalendar,
      showTasks,
      showTask: ref(false),
      showNewTask: ref(false),
      task: ref(null),
      newTaskDate,
      dateForTasks: ref(""),
      canActualize,
      actualizeTasks,
    };
  },
  methods: {
    selectMonth(direction) {
      this.canActualize = false;
      this.tasksDay = [];
      if (direction === "prev") {
        this.date.month -= 1;
        if (this.date.month < 0) {
          this.date.month = 11;
          this.date.year -= 1;
          if (this.date.year < 1900) {
            this.date.year = 1900;
            this.date.month = 0;
            return;
          }
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
      this.actualizeTasks();
      setTimeout(() => {
        this.canActualize = true;
      }, 100);
    },
    isWeekend(day) {
      let date = new Date(this.date.year, this.date.month, day);
      return date.getDay() === 0 || date.getDay() === 6;
    },
    searchInDay(day) {
      let tasks = this.tasks
        .filter((task) => {
          let [_1, _2, d] = task.runDate.split("-");
          return Number(d) === Number(day) && task.status !== "archived";
        })
        .sort((a, b) => {
          const status = {
            ended: 1,
            created: 2,
            archived: 0,
          };
          if (status[a.status] > status[b.status]) return -1;
          if (status[a.status] < status[b.status]) return 1;
          return 0;
        });
      return {
        tasks: tasks.slice(0, 2),
        total: tasks.length,
      };
    },
    showTasksData(day) {
      const { year: y, month: m } = this.date;
      this.dateForTasks = `${y}-${("0" + (Number(m) + 1)).slice(-2)}-${(
        "0" + day
      ).slice(-2)}`;
      storage.set("current_date", this.dateForTasks);
      this.tasksDay = this.tasks
        .filter((task) => {
          let [_1, _2, d] = task.runDate.split("-");
          return Number(d) === Number(day);
        })
        .sort((a, b) => {
          const statusOrder = {
            ended: 1,
            created: 0,
            archived: 0,
          };
          const priorities = {
            urgent: 4,
            high: 3,
            normal: 2,
            low: 1,
          };

          // Primero, ordena por estado
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }

          // Si los estados son iguales, ordena por prioridad
          if (priorities[a.priority.name] > priorities[b.priority.name])
            return -1;
          if (priorities[a.priority.name] < priorities[b.priority.name])
            return 1;
          return 0;
        })
        .filter((t) => t.status !== "archived");
      this.showTasks = true;
    },
    viewTask(task) {
      this.task = task;
      this.showTask = true;
    },
    newTask(date) {
      let [y, m, d] = date.split("-");
      date = `${y}-${("0" + m).slice(-2)}-${("0" + d).slice(-2)}`;
      // this.newTaskDate = date;
      this.showNewTask = true;
      EventBus.emit("calendar-new-task", date);
    },
    getColor(date, status) {
      if (status === "ended") return "green-5";
      let now = new Date();
      now = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(-2)}-${(
        "0" + now.getDate()
      ).slice(-2)}`;
      date = date.split(" ")[0].split("T")[0];
      date = date.split("-");
      date = new Date(
        `${date[0]}-${date[1]}-${("0" + (Number(date[2]) + 1)).slice(-2)}`
      );
      date = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
        -2
      )}-${("0" + date.getDate()).slice(-2)}`;

      // date = new Date(date);
      // now = new Date(now);
      console.log("DATE", date);
      console.log("NOW", now);
      if (date < now) return "red-5";
      if (date > now) return "blue-5";
      return "orange-5";
    },
    editTask() {
      this.showTask = false;
      this.showNewTask = true;
    },
  },
});
</script>
