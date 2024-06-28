<template>
  <q-dialog
    style="height: 100%; z-index: 6000"
    v-model="showModal"
    :dark="theme === 'dark'"
    class="t-tasks-task"
    persistent
  >
    <q-card
      :dark="theme === 'dark'"
      borderer
      style="min-width: 80vw; height: 100%; position: relative"
      :class="{
        'q-pt-lg q-mt-lg': true,
        't-task-card': true,
        't-light': theme !== 'dark',
      }"
    >
      <div class="flex column t-tasks-task-options">
        <q-btn
          dense
          flat
          round
          :icon="task.status === 'ended' ? 'settings_backup_restore' : 'check'"
          class="q-mt-sm"
          @click="finalizeTask(task.id, task.status === 'created')"
        />
        <q-btn
          dense
          flat
          round
          icon="edit"
          class="q-mt-md"
          @click="editTask(task)"
        />
        <q-btn
          dense
          flat
          round
          icon="delete"
          class="q-mt-md"
          color="red-5"
          @click="confirmDelete(task.id, confirm)"
        />
      </div>
      <q-card-section>
        <div
          :class="{
            'text-h6': true,
            'text-white': theme === 'dark',
            'q-mb-md': true,
            flex: true,
            'flex-center': true,
            'text-dark': theme !== 'dark',
          }"
        >
          <div :class="task.status === 'ended' ? 'text-green' : ''">
            {{ task.title }}
          </div>
          <q-icon
            :title="task.priority.name"
            :name="icons[task.priority.name].name"
            :color="icons[task.priority.name].color"
            class="q-ml-sm"
            size="sm"
            v-if="task.status !== 'ended'"
          />
          <q-icon name="check" style="color: green" class="q-ml-sm" v-else />
        </div>
        <div>
          <q-badge
            v-for="(category, key) in task.categories"
            :key="key"
            :label="category.name"
            :style="'background-color: #' + category.color + ' !important'"
            class="q-mr-sm cursor-pointer"
            @click="filterByCategory(category.id, category.name)"
          >
            <q-icon
              :name="category.icon"
              style="color: white"
              class="q-ml-sm"
            />
          </q-badge>
        </div>
      </q-card-section>
      <q-btn
        dense
        flat
        round
        icon="close"
        @click="() => $emit('update:show', false)"
        class="t-tasks-task-close"
      />
      <q-separator inset :dark="theme === 'dark'" />
      <q-card-section>
        <p style="white-space: pre-line; user-select: text">
          <MarkDown :markdown="task.description" :dark="theme === 'dark'" />
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, watch } from "vue";
import categories from "src/data/tasksPage/categories.json";
import icons from "src/data/tasksPage/icons.json";
import { editTask, deleteTask } from "src/functions/task";
import EventBus from "src/functions/EventBus";
import { useQuasar } from "quasar";
import MarkDown from "./MarkDown.vue";

export default {
  name: "TaskComponent",
  components: {
    MarkDown,
  },
  props: {
    task: Object,
    show: Boolean,
    _theme: String,
  },
  emits: ["update:show"],
  data(props) {
    const theme = ref(props._theme);
    const $q = useQuasar();
    const showModal = ref(props.show);

    watch(
      () => props.show,
      (val) => {
        showModal.value = val;
      }
    );
    watch(
      () => props._theme,
      (val) => {
        theme.value = val;
      }
    );
    return {
      theme,
      showModal,
      categories,
      icons,
      confirmDelete: (id, confirm) => {
        $q.dialog({
          title: this.$t("pages.tasks.titles.confirm_deletion"),
          message: this.$t("pages.tasks.messages.confirm_delete"),
          cancel: {
            label: this.$t("pages.tasks.buttons.cancel"),
            color: "grey-8",
          },
          persistent: true,
          color: "red-5",
          dark: theme.value === "dark",
          ok: {
            label: this.$t("pages.tasks.buttons.delete"),
            color: "red-5",
          },
        })
          .onOk(() => {
            confirm(id);
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          });
      },
    };
  },
  methods: {
    filterByCategory(categoryId, categoryName) {
      EventBus.emit("filter-by-category", {
        label: categoryName,
        value: categoryId,
      });
      this.$emit("update:show", false);
    },
    finalizeTask(id, on_off) {
      editTask(id, { status: on_off ? "ended" : "created" })
        .then(({ status }) => {
          if (status === 200) {
            EventBus.emit("task-updated");
            EventBus.emit("finalized-task");
            this.$q.notify({
              message: this.$t("pages.tasks.messages.task_finalized"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
            this.$emit("update:show", false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editTask(task) {
      task.categories = task.categories.map((c) => {
        return {
          label: c.name,
          value: c.id,
        };
      });
      EventBus.emit("edit-task", task);
      this.$emit("update:edittask", false);
    },
    confirm(id) {
      deleteTask(id)
        .then(({ status }) => {
          if (status === 200) {
            this.$q.notify({
              message: this.$t("pages.tasks.messages.task_deleted"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
            EventBus.emit("task-updated");
            EventBus.emit("deleted-task");
            this.$emit("update:show", false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
