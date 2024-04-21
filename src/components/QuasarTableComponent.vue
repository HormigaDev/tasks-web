<template>
  <div class="q-pa-md">
    <q-table
      rows-per-page-label="Rows per page: "
      :selected-rows-label="(n) => `${n} Task(s) selected`"
      dark
      title="Tasks"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      grid
      hide-header
      :rows-per-page-options="rowsPerPageOptions"
      card-container-style="max-height: 62vh; overflow: auto;"
      no-data-label="No tasks found"
    >
      <template v-slot:top-right>
        <div class="flex row">
          <q-btn
            dense
            dark
            color="grey-8"
            icon="add"
            class="q-ml-md"
            @click="newTask"
          />
          <q-btn
            dense
            dark
            color="grey-8"
            icon="archive"
            class="q-ml-md"
            @click="archiveTask"
          />
          <q-btn
            dense
            dark
            color="red"
            icon="delete"
            class="q-ml-md"
            @click="deleteTask"
          />
        </div>
        <div class="q-mr-md flex row">
          <q-select
            v-for="(option, key) in filterBarOptions"
            outlined
            dark
            :key="key"
            v-model="filterOptions[option.value]"
            :options="option.options"
            :label="option.label"
            class="t-select q-ml-md v-tasks"
            color="white"
            dense
            @update:model-value="filterTasks(option.value)"
            label-color="grey-7"
          />
        </div>
        <q-input
          dense
          dark
          outlined
          color="white"
          debounce="200"
          v-model="filter"
          placeholder="Search Task"
          class="q-mr-md"
          @update:model-value="filterTasks('text')"
          label-color="grey-7"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div
          dark
          class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition"
          :style="
            (props.selected ? 'transform: scale(0.95);' : '') +
            'overflow: auto; max-height: 70vh;'
          "
        >
          <q-card bordered dark class="t-task q-mt-xl">
            <q-card-section class="flex" style="justify-content: space-between">
              <q-checkbox
                dense
                dark
                color="grey"
                v-model="props.selected"
                :label="props.row.name"
              />
              <q-btn
                dense
                dark
                color="grey-8"
                icon="add"
                label="View More"
                class="q-pr-md q-pl-sm"
                @click="showTask(props.row)"
              />
            </q-card-section>
            <q-separator dark />
            <q-list dense>
              <q-item
                v-for="col in props.cols.filter((col) => col.name !== 'desc')"
                :key="col.name"
              >
                <q-item-section v-if="col.name === 'description'">
                  <p>
                    <b style="font-weight: bold">{{ col.label }}: </b
                    >{{
                      props.row[col.field].length > 100
                        ? props.row[col.field].substring(0, 100) + "..."
                        : props.row[col.field]
                    }}
                  </p>
                </q-item-section>
                <q-item-section v-if="col.name !== 'description'">
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="col.name !== 'description'">
                  <q-item-label
                    caption
                    :style="
                      col.name === 'priority'
                        ? `color: ${
                            priorities[props.row[col.field].toLowerCase()].color
                          }`
                        : 'color: #fafafa'
                    "
                    ><span
                      v-if="col.name !== 'category' && col.name !== 'priority'"
                      >{{ props.row[col.field] }}</span
                    >
                    <span v-if="col.name === 'priority'">
                      {{ priorities[props.row[col.field].toLowerCase()].name }}
                    </span>
                    <div v-if="col.name === 'category'">
                      <q-badge
                        v-for="(badge, key) in props.row[col.field].slice(0, 2)"
                        class="q-ml-xs"
                        :color="categories[badge.toLowerCase()].color"
                        :key="key"
                      >
                        {{ categories[badge.toLowerCase()].name }}
                      </q-badge>
                      {{
                        props.row[col.field].length > 2
                          ? "+" + (props.row[col.field].length - 2)
                          : ""
                      }}
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";
import columns from "src/data/tasksPage/columns.json";
import rows from "src/data/tasksPage/rows.json";
import categories from "src/data/tasksPage/categories.json";
import { useQuasar } from "quasar";

const priorities = {
  urgent: {
    color: "#f22",
    name: "Urgent",
  },
  high: {
    color: "#ff6",
    name: "High",
  },
  normal: {
    color: "#66f",
    name: "Normal",
  },
  low: {
    color: "#6f6",
    name: "Low",
  },
};

export default {
  name: "QuasarTableComponent",
  setup() {
    const $q = useQuasar();
    const filterOptions = ref({
      priority: { label: "All", value: "all" },
      order_by: { label: "Ancient", value: "ancient" },
      status: { label: "All", value: "all" },
    });
    return {
      filter: ref(""),
      selected: ref([]),
      columns,
      rows: ref(rows),
      originalRows: ref(rows),
      categories,
      priorities,
      filterBarOptions: [
        {
          label: "Priority",
          value: "priority",
          options: [
            { label: "All", value: "all" },
            { label: "Urgent", value: "urgent" },
            { label: "High", value: "high" },
            { label: "Normal", value: "normal" },
            { label: "Low", value: "low" },
          ],
        },
        {
          label: "Order By",
          value: "order_by",
          options: [
            { label: "Ancient", value: "ancient" },
            { label: "Recent", value: "recent" },
          ],
        },
        {
          label: "Status",
          value: "status",
          options: [
            { label: "All", value: "all" },
            { label: "Created", value: "created" },
            { label: "Ended", value: "ended" },
            { label: "Archived", value: "archived" },
          ],
        },
      ],
      filterOptions,
      rowsPerPageOptions: [4, 10, 20, 30, 50, 100],
      confirmDelete: (confirm) => {
        $q.dialog({
          title: "Confirm",
          message: "Would you like to delete the selected tasks?",
          cancel: true,
          persistent: true,
          color: "negative",
          dark: true,
        })
          .onOk(() => {
            confirm();
          })
          .onOk(() => {
            // console.log('>>>> second OK catcher')
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      },
    };
  },
  methods: {
    newTask() {
      this.$emit("update:newtask", true);
    },
    deleteTask() {
      if (this.selected.length === 0) {
        return this.$emit("update:deletetask", []);
      }
      this.confirmDelete(this.confirm);
    },
    confirm() {
      let ids = this.selected.map((task) => task.name);
      this.rows = this.rows.filter((task) => !ids.includes(task.name));
      this.selected = [];
      this.$emit("update:deletetask", ids);
    },
    archiveTask() {
      let ids = this.selected.map((task) => task.name);
      this.rows = this.rows.filter((task) => !ids.includes(task.name));
      this.selected = [];
      this.$emit("update:archivetask", ids);
    },
    showTask(task) {
      this.$emit("update:showtask", task);
    },
    filterTasks() {
      this.rows = this.originalRows.sort((a, b) => {
        let [da, db] = [new Date(a.created_at), new Date(b.created_at)];
        if (this.filterOptions.order_by.value === "ancient") {
          if (da > db) return 1;
          if (da < db) return -1;
          return 0;
        } else {
          if (da < db) return 1;
          if (da > db) return -1;
          return 0;
        }
      });
      this.rows = this.rows.filter(
        (task) =>
          task.priority.toLowerCase() === this.filterOptions.priority.value ||
          this.filterOptions.priority.value === "all"
      );
      this.rows = this.rows.filter(
        (task) =>
          task.status === this.filterOptions.status.value ||
          this.filterOptions.status.value === "all"
      );
      this.rows = this.rows.filter((task) => {
        let text = this.filter.toLowerCase();
        return (
          task.name.toLowerCase().includes(text) ||
          task.description.toLowerCase().includes(text) ||
          task.category.join(" ").toLowerCase().includes(text)
        );
      });
      return;
    },
  },
};
</script>
<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>
