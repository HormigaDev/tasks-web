<template>
  <q-dialog persistent v-model="showForm" :dark="theme === 'dark'">
    <q-card
      style="min-width: 560px; max-height: 90vh; margin-top: 8vh"
      :dark="theme === 'dark'"
    >
      <q-card-section>
        <div class="text-h6">
          {{
            !editing
              ? $t("pages.tasks.titles.new_task")
              : $t("pages.tasks.titles.edit_task")
          }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form>
          <q-input
            outlined
            v-model="newTask.title"
            :dark="theme === 'dark'"
            dense
            :label="$t('pages.tasks.inputs.labels.title')"
            class="q-mt-md"
            :color="theme === 'dark' ? 'white' : 'dark'"
            label-color="grey-7"
            maxlength="100"
          />
          <q-input
            :dark="theme === 'dark'"
            dense
            outlined
            v-model="newTask.description"
            :label="$t('pages.tasks.inputs.labels.description')"
            type="textarea"
            class="q-mt-md"
            :color="theme === 'dark' ? 'white' : 'dark'"
            label-color="grey-7"
            maxlength="5000"
          />
          <q-select
            :dark="theme === 'dark'"
            dense
            outlined
            v-model="newTask.priority"
            :label="$t('pages.tasks.inputs.labels.priority')"
            :options="priorities"
            class="q-mt-md"
            :color="theme === 'dark' ? 'white' : 'dark'"
            label-color="grey-7"
          />
          <q-select
            :dark="theme === 'dark'"
            outlined
            dense
            v-model="newTask.categories"
            multiple
            :options="categories"
            :label="$t('pages.tasks.inputs.labels.categories')"
            class="q-mt-md"
            :color="theme === 'dark' ? 'white' : 'dark'"
            label-color="grey-7"
          />
          <q-input
            :dark="theme === 'dark'"
            :color="theme === 'dark' ? 'white' : 'dark'"
            outlined
            dense
            v-model="newTask.date"
            :label="$t('pages.tasks.inputs.labels.date')"
            class="q-mt-md"
            readonly
            label-color="grey-7"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" @click="showCalendar = true" />
            </template>
          </q-input>
          <div class="flex flex-center q-mt-md">
            <q-date
              v-if="showCalendar"
              dense
              :dark="theme === 'dark'"
              minimal
              v-model="date"
              @update:model-value="updateDate"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          :color="theme === 'dark' ? 'grey-5' : 'grey-9'"
          :label="$t('pages.tasks.buttons.cancel')"
          @click="cancelNewTask"
        />
        <q-btn
          flat
          :label="
            !editing
              ? $t('pages.tasks.buttons.save')
              : $t('pages.tasks.buttons.update')
          "
          @click="editing ? editTask() : saveNewTask()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getCategories } from "src/functions/categories";
import { newTask, newTask as saveTask, editTask } from "src/functions/task";
import { Loop } from "src/functions/utils";
import EventBus from "src/functions/EventBus";
import storage from "src/functions/virtualStorage";

export default {
  name: "NewTaskComponent",
  props: {
    show: Boolean,
    _theme: String,
    _configurations: Object,
  },
  emits: ["update:show"],
  data(props) {
    const theme = ref(props._theme);
    const configurations = ref(props._configurations);
    const priorities = [
      {
        label: this.$t("pages.tasks.inputs.options.priorities.low"),
        value: 1,
      },
      {
        label: this.$t("pages.tasks.inputs.options.priorities.normal"),
        value: 2,
      },
      {
        label: this.$t("pages.tasks.inputs.options.priorities.high"),
        value: 3,
      },
      {
        label: this.$t("pages.tasks.inputs.options.priorities.urgent"),
        value: 4,
      },
    ];
    const rules = {
      title: {
        exp: /^.{10,100}$/i,
        message: this.$t("pages.tasks.messages.invalid_title"),
      },
      description: {
        exp: /^.{20,5000}$/i,
        message: this.$t("pages.tasks.messages.invalid_description"),
      },
      date: {
        exp: /^(\d{4})-(\d{2})-(\d{2})$/i,
        message: this.$t("pages.tasks.messages.invalid_date"),
      },
    };
    const categories = ref([]);
    const editing = ref(false);

    const showForm = ref(props.show);
    const now = new Date();

    let [year, month, day] = storage.get("current_date")?.split("-") ?? [
      "2000",
      "01",
      "01",
    ];
    const today = ref(
      storage.get("current_date")?.split("-").join("/") ??
        `${year ?? now.getFullYear()}/${month ?? now.getMonth() + 1}/${
          day ?? now.getDate()
        }`
    );
    const today2 = ref(
      storage.get("current_date")?.split("-").reverse().join("/") ??
        `${("0" + now.getDate()).slice(-2)}/${(
          "0" +
          (now.getMonth() + 1)
        ).slice(-2)}/${now.getFullYear()}`
    );
    const priorityWeights = {
      low: 1,
      normal: 2,
      high: 3,
      urgent: 4,
    };
    const newTask = ref({
      title: "",
      description: "",
      priority: configurations.value?.defaultPriority
        ? {
            label: this.$t(
              `pages.tasks.inputs.options.priorities.${configurations.value.defaultPriority}`
            ),
            value: priorityWeights[configurations.value.defaultPriority],
          }
        : {
            label: this.$t("pages.tasks.inputs.options.priorities.normal"),
            value: 2,
          },
      categories: [],
      date: ref(today2),
    });

    const loop = new Loop(() => {
      const date = storage.get("current_date");
      if (date) {
        let [year, month, day] = date.split("-");
        today.value = `${year}/${month}/${day}`;
        today2.value = `${day}/${month}/${year}`;
      }
    });
    loop.start();

    onMounted(() => {
      getCategories().then(({ data, status }) => {
        if (status === 200) {
          categories.value = [];
          for (const category of data.categories) {
            categories.value.push({
              label: category.name,
              value: category.id,
            });
          }
        }
      });
    });

    EventBus.on("edit-task", (task) => {
      newTask.value.id = task.id;
      newTask.value.title = task.title;
      newTask.value.description = task.description;
      newTask.value.priority = {
        label: this.$t(
          `pages.tasks.inputs.options.priorities.${task.priority.name}`
        ),
        value: task.priority.weight,
      };
      newTask.value.categories = task.categories;
      editing.value = true;
    });

    watch(
      () => props.show,
      (val) => {
        getCategories().then(({ data, status }) => {
          if (status === 200) {
            categories.value = [];
            for (const category of data.categories) {
              categories.value.push({
                label: category.name,
                value: category.id,
              });
            }
          }
        });
        if (editing.value === false) {
          newTask.value.title = "";
          newTask.value.description = "";
          newTask.value.categories = [];
        }
        showForm.value = val;
      }
    );
    watch(
      () => props._theme,
      (val) => {
        theme.value = val;
      }
    );
    watch(
      () => props._configurations,
      (val) => {
        configurations.value = val;
      }
    );

    onBeforeUnmount(() => {
      loop.stop();
      EventBus.off("edit-task");
      editing.value = false;
    });

    return {
      theme,
      rules,
      editing,
      today2,
      showForm,
      priorities,
      categories,
      newTask,
      showCalendar: ref(false),
      date: ref(today),
    };
  },
  methods: {
    resetForm() {
      this.newTask.title = "";
      this.newTask.description = "";
      this.newTask.priority = {
        label: "Normal",
        value: 2,
      };
      this.newTask.categories = [];
    },
    updateDate(value) {
      let [year, month, day] = value.split("/");
      this.newTask.realDate = `${year}-${month}-${day}`;
      this.newTask.date = `${day}/${month}/${year}`;
      this.showCalendar = false;
    },
    saveNewTask() {
      if (!this.rules.title.exp.test(this.newTask.title)) {
        this.$q.notify({
          message: this.rules.title.message,
          color: "red-5",
          position: "bottom-right",
          timeout: 2000,
        });
        return;
      }
      if (
        this.newTask.description.length > 5000 ||
        this.newTask.description.length < 20
      ) {
        this.$q.notify({
          message: this.rules.description.message,
          color: "red-5",
          position: "bottom-right",
          timeout: 2000,
        });
        return;
      }
      const [day, month, year] = this.newTask.date.split("/");
      const date = `${year}-${month}-${day}`;
      if (!this.rules.date.exp.test(date)) {
        this.$q.notify({
          message: this.rules.date.message,
          color: "red-5",
          position: "bottom-right",
          timeout: 2000,
        });
        return;
      }
      const categories = this.newTask.categories.map((c) => c.value);
      const priority = this.newTask.priority.value;
      saveTask(
        this.newTask.title,
        this.newTask.description,
        date,
        priority,
        categories
      )
        .then(({ status }) => {
          if (status === 201) {
            this.$q.notify({
              message: this.$t("pages.tasks.messages.task_saved"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
            this.resetForm();
            EventBus.emit("task-added");
            this.$emit("update:show", false);
          } else {
            this.$q.notify({
              message: this.$t("pages.tasks.messages.error_saving_task"),
              color: "red-5",
              position: "bottom-right",
              timeout: 2000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: this.$t("pages.tasks.messages.error_saving_task"),
            color: "red-5",
            position: "bottom-right",
            timeout: 2000,
          });
        });
    },
    editTask() {
      if (!this.rules.title.exp.test(this.newTask.title)) {
        this.$q.notify({
          message: this.rules.title.message,
          color: "red-5",
          position: "bottom-right",
          timeout: 2000,
        });
        return;
      }
      if (
        this.newTask.description.length > 5000 ||
        this.newTask.description.length < 20
      ) {
        this.$q.notify({
          message: this.rules.description.message,
          color: "red-5",
          position: "bottom-right",
          timeout: 2000,
        });
        return;
      }
      const [day, month, year] = this.newTask.date.split("/");
      const date = `${year}-${month}-${day}`;
      if (!this.rules.date.exp.test(date)) {
        this.$q.notify({
          message: this.rules.date.message,
          color: "red-5",
          position: "bottom-right",
          timeout: 2000,
        });
        return;
      }
      const categories = this.newTask.categories.map((c) => c.value);
      const priority = this.newTask.priority.value;
      editTask(this.newTask.id, {
        title: this.newTask.title,
        description: this.newTask.description,
        run_date: date,
        priority_id: priority,
        categories,
      })
        .then(({ status }) => {
          if (status === 200) {
            this.$q.notify({
              message: this.$t("pages.tasks.messages.task_updated"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
            this.resetForm();
            EventBus.emit("task-edited");
            this.$emit("update:show", false);
          } else {
            this.$q.notify({
              message: this.$t("pages.tasks.messages.error_updating_task"),
              color: "red-5",
              position: "bottom-right",
              timeout: 2000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: this.$t("pages.tasks.messages.error_updating_task"),
            color: "red-5",
            position: "bottom-right",
            timeout: 2000,
          });
        });
    },
    cancelNewTask() {
      this.$emit("update:show", false);
      this.resetForm();
    },
  },
};
</script>
