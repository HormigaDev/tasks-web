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
        <q-btn
          flat
          color="grey-5"
          label="Cancel"
          @click="() => $emit('update:show', false)"
        />
        <q-btn
          flat
          label="Save"
          @click="
            () => {
              resetForm();
              $emit('update:save', newTask);
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { ref, watch } from "vue";

export default {
  name: "NewTaskComponent",
  props: {
    show: Boolean,
    taskdate: String,
  },
  emits: ["update:show"],
  setup(props) {
    const showForm = ref(props.show);
    const now = new Date();
    let [year, month, day] = props.taskdate?.split("-") ?? ["--"];
    let today = ref(
      `${year ?? now.getFullYear()}/${month ?? now.getMonth() + 1}/${
        day ?? now.getDate()
      }`
    );
    let today2 = ref(
      `${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(
        -2
      )}/${now.getFullYear()}`
    );
    watch(
      () => props.show,
      (val) => {
        showForm.value = val;
      }
    );
    watch(
      () => props.taskdate,
      (val) => {
        let [year, month, day] = val.split("-");
        today.value = `${year}/${month}/${day}`;
        today2.value = `${day}/${month}/${year}`;
      }
    );

    return {
      today2,
      showForm,
      priorities: [
        { label: "Low", value: "low" },
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" },
        { label: "Urgent", value: "urgent" },
      ],
      categories: [
        { label: "Bug", value: "bug" },
        { label: "Suggestion", value: "sg" },
        { label: "Base Aperture", value: "a_b" },
      ],
      newTask: ref({
        title: "",
        description: "",
        priority: "normal",
        categories: [],
        date: ref(today2),
      }),
      showCalendar: ref(false),
      date: ref(today),
    };
  },
  methods: {
    resetForm() {
      this.newTask = {
        title: "",
        description: "",
        priority: "normal",
        categories: [],
        date: this.today2,
      };
    },
    updateDate(value) {
      let [year, month, day] = value.split("/");
      this.newTask.realDate = `${year}-${month}-${day}`;
      this.newTask.date = `${day}/${month}/${year}`;
      this.showCalendar = false;
    },
  },
};
</script>
