<template>
  <q-dialog persistent v-model="showTasks" dark>
    <q-card
      dark
      style="min-width: 80%; position: relative; height: 100%; max-height: 80vh"
      class="q-mt-xl"
    >
      <q-btn
        flat
        rounded
        dense
        icon="close"
        class="absolute-top-right q-mr-xs q-mt-xs"
        color="white"
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
          Tasks
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
              <q-item-label :style="'color: ' + colors[task.color]">{{
                task.name
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge
                :color="priorities[task.priority].color"
                :label="priorities[task.priority].name"
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

export default {
  name: "CalendarTasks",
  props: {
    show: Boolean,
    taskList: Array,
    taskdate: String,
  },
  emits: ["update:show"],
  setup(props) {
    const showTasks = ref(props.show);
    const tasks = ref(props.taskList);
    const date = ref(props.taskdate);
    const priorities = {
      urgent: {
        name: "Urgent",
        color: "negative",
      },
      high: {
        name: "High",
        color: "warning",
      },
      normal: {
        name: "Normal",
        color: "primary",
      },
      low: {
        name: "Low",
        color: "grey-5",
      },
    };
    watch(
      () => props.show,
      (val) => {
        showTasks.value = val;
      }
    );
    return {
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
      this.$emit("update:newtask", date);
    },
  },
};
</script>
