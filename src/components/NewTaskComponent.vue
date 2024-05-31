<template>
  <q-dialog persistent v-model="showForm" dark>
    <q-card style="min-width: 560px" dark>
      <q-card-section>
        <div class="text-h6">New Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form>
          <q-input
            outlined
            v-model="newTask.title"
            dark
            dense
            label="Title"
            class="q-mt-md"
            color="white"
            label-color="grey-7"
            maxlength="100"
          />
          <q-input
            dark
            dense
            outlined
            v-model="newTask.description"
            label="Description"
            type="textarea"
            class="q-mt-md"
            color="white"
            label-color="grey-7"
            maxlength="5000"
          />
          <q-select
            dark
            dense
            outlined
            v-model="newTask.priority"
            label="Priority"
            :options="priorities"
            class="q-mt-md"
            color="white"
            label-color="grey-7"
          />
          <q-select
            dark
            outlined
            dense
            v-model="newTask.categories"
            multiple
            :options="categories"
            label="Categories"
            class="q-mt-md"
            color="white"
            label-color="grey-7"
          />
          <q-input
            dark
            color="white"
            outlined
            dense
            v-model="newTask.date"
            label="Date"
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
              dark
              minimal
              v-model="date"
              @update:model-value="updateDate"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="grey-5" label="Cancel" @click="cancelNewTask" />
        <q-btn
          flat
          label="Save"
          @click="editing ? editTask() : saveNewTask()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { onMounted, ref, watch } from "vue";
import { getCategories } from "src/functions/categories";
import { newTask, newTask as saveTask, editTask } from "src/functions/task";
import EventBus from "src/functions/EventBus";
import storage from "src/functions/virtualStorage";

const rules = {
  title: {
    exp: /^.{10,100}$/i,
    message: "Title must be between 10 and 100 characters",
  },
  description: {
    exp: /^.{20,5000}$/i,
    message: "Description must be between 20 and 5000 characters",
  },
  date: {
    exp: /^(\d{4})-(\d{2})-(\d{2})$/i,
    message: "Invalid date format",
  },
};

export default {
  name: "NewTaskComponent",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props) {
    const categories = ref([]);
    const editing = ref(false);

    const showForm = ref(props.show);
    const now = new Date();

    console.log(storage.get("current_date"));
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
    setInterval(() => {
      const date = storage.get("current_date");
      if (date) {
        let [year, month, day] = date.split("-");
        today.value = `${year}/${month}/${day}`;
        today2.value = `${day}/${month}/${year}`;
      }
    }, 1000);
    const newTask = ref({
      title: "",
      description: "",
      priority: {
        label: "Normal",
        value: 2,
      },
      categories: [],
      date: ref(today2),
    });

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
      newTask.value.title = task.title;
      newTask.value.description = task.description;
      newTask.value.priority = {
        label: task.priority.name,
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
          newTask.value.priority = {
            label: "Normal",
            value: 2,
          };
          newTask.value.categories = [];
        }
        showForm.value = val;
      }
    );

    return {
      editing,
      today2,
      showForm,
      priorities: [
        { label: "Low", value: 1 },
        { label: "Normal", value: 2 },
        { label: "High", value: 3 },
        { label: "Urgent", value: 4 },
      ],
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
      if (!rules.title.exp.test(this.newTask.title)) {
        this.$q.notify({
          message: rules.title.message,
          color: "red-5",
          position: "bottom-right",
        });
        return;
      }
      if (
        this.newTask.description.length > 5000 ||
        this.newTask.description.length < 20
      ) {
        this.$q.notify({
          message: rules.description.message,
          color: "red-5",
          position: "bottom-right",
        });
        return;
      }
      const [day, month, year] = this.newTask.date.split("/");
      const date = `${year}-${month}-${day}`;
      if (!rules.date.exp.test(date)) {
        this.$q.notify({
          message: rules.date.message,
          color: "red-5",
          position: "bottom-right",
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
              message: "Task saved successfully",
              color: "green-5",
              position: "bottom-right",
            });
            this.resetForm();
            EventBus.emit("task-added");
            this.$emit("update:show", false);
          } else {
            this.$q.notify({
              message: "An error occurred while saving the task",
              color: "red-5",
              position: "bottom-right",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: "An error occurred while saving the task",
            color: "red-5",
            position: "bottom-right",
          });
        });
    },
    editTask() {
      if (!rules.title.exp.test(this.newTask.title)) {
        this.$q.notify({
          message: rules.title.message,
          color: "red-5",
          position: "bottom-right",
        });
        return;
      }
      if (
        this.newTask.description.length > 5000 ||
        this.newTask.description.length < 20
      ) {
        this.$q.notify({
          message: rules.description.message,
          color: "red-5",
          position: "bottom-right",
        });
        return;
      }
      const [day, month, year] = this.newTask.date.split("/");
      const date = `${year}-${month}-${day}`;
      if (!rules.date.exp.test(date)) {
        this.$q.notify({
          message: rules.date.message,
          color: "red-5",
          position: "bottom-right",
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
              message: "Task edited successfully",
              color: "green-5",
              position: "bottom-right",
            });
            this.resetForm();
            EventBus.emit("task-edited");
            this.$emit("update:show", false);
          } else {
            this.$q.notify({
              message: "An error occurred while editing the task",
              color: "red-5",
              position: "bottom-right",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: "An error occurred while editing the task",
            color: "red-5",
            position: "bottom-right",
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
