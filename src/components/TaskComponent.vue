<template>
  <q-dialog
    style="height: 100%; z-index: 6000"
    v-model="showModal"
    dark
    class="t-tasks-task"
    persistent
  >
    <q-card
      dark
      borderer
      style="min-width: 80vw; height: 100%; position: relative"
      class="q-pt-lg t-task-card"
    >
      <div class="flex column t-tasks-task-options">
        <q-btn
          dense
          flat
          round
          :icon="task.status === 'ended' ? 'settings_backup_restore' : 'check'"
          class="q-mt-sm"
          :title="task.status === 'ended' ? 'Dismark Task' : 'Finalize Task'"
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
        <div :class="'text-h6 text-white q-mb-md flex flex-center '">
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
      <q-separator inset dark />
      <q-card-section>
        <p style="white-space: pre-line; user-select: text">
          {{ task.description }}
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, watch, defineEmits } from "vue";
import categories from "src/data/tasksPage/categories.json";
import icons from "src/data/tasksPage/icons.json";
import { editTask, deleteTask } from "src/functions/task";
import EventBus from "src/functions/EventBus";
import { useQuasar } from "quasar";

export default {
  name: "TaskComponent",
  props: {
    task: Object,
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props) {
    const $q = useQuasar();
    const showModal = ref(props.show);

    watch(
      () => props.show,
      (val) => {
        showModal.value = val;
      }
    );
    return {
      showModal,
      categories,
      icons,
      confirmDelete: (id, confirm) => {
        $q.dialog({
          title: "Confirm",
          message: "Would you like to delete the selected tasks?",
          cancel: true,
          persistent: true,
          color: "red-5",
          dark: true,
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
              message: "Task deleted successfully",
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
