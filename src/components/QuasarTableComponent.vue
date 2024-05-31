<template>
  <div class="q-pa-md">
    <div class="flex row">
      <div class="flex row flex-center">
        <q-btn
          dense
          dark
          color="grey-8"
          icon="add"
          class="q-ml-md q-mb-sm"
          @click="newTask"
        />
        <q-btn
          dense
          dark
          color="grey-8"
          icon="category"
          class="q-ml-md q-mb-sm"
          @click="newCategory"
        />
        <div class="q-mr-md flex row flex-center">
          <q-select
            v-for="(option, key) in filterBarOptions"
            outlined
            dark
            :key="key"
            v-model="filters[option.value]"
            :options="option.options"
            :label="option.label"
            class="t-select q-ml-md v-tasks q-mb-sm"
            color="white"
            dense
            @update:model-value="filterTasks"
            label-color="grey-7"
            :style="'width: ' + key == 1 ? 170 : 70 + 'px'"
          />
        </div>
        <q-input
          dense
          dark
          outlined
          color="white"
          debounce="200"
          v-model="filters.search"
          placeholder="Search Task"
          class="q-mr-md q-mb-sm"
          @update:model-value="filterTasks"
          label-color="grey-7"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-mt-md">
      <q-toggle
        dark
        color="grey-7"
        v-model="filters.showArchives"
        label="Show Archived Tasks"
        dense
        @update:model-value="filterTasks"
      />
      <q-toggle
        dark
        color="grey-7"
        v-model="filters.showEndeds"
        label="Show Finalized Tasks"
        dense
        class="q-ml-xl"
        @update:model-value="filterTasks"
      />
    </div>
    <div
      style="height: 58vh; overflow: auto"
      class="tasks-grid q-pl-md q-pr-md"
    >
      <div
        v-for="task in rows"
        :key="task.id"
        style="position: relative; height: 320px; width: 100%"
        :class="{
          'q-mt-md': true,
          'q-mb-sm': true,
          flex: true,
          'flex-center': true,
          'task-archived': task.status === 'archived',
        }"
      >
        <q-card dark class="bg-grey-10" style="height: 100%; width: 100%">
          <q-card-section class="bg-grey-8 row">
            <q-item-label style="font-size: 13px">
              {{
                task.title.length > 40
                  ? task.title.substring(0, 40) + "..."
                  : task.title
              }}</q-item-label
            >
            <q-btn
              v-if="task.fixed && task.status !== 'ended'"
              flat
              color="grey-5"
              dense
              rounded
              class="absolute-top-right q-mt-sm"
              style="margin-right: 40px"
              @click="assingTask(task.id, !task.fixed)"
            >
              <q-icon>
                <i class="fa fa-thumbtack" style="transform: rotate(45deg)"></i>
              </q-icon>
            </q-btn>
            <q-btn
              v-if="task.status === 'ended'"
              flat
              color="green-5"
              dense
              rounded
              class="absolute-top-right q-mt-sm"
              style="margin-right: 40px; pointer-events: none"
            >
              <q-icon name="check"> </q-icon>
            </q-btn>
            <q-btn-dropdown
              class="absolute-top-right q-mr-xs q-mt-sm"
              flat
              dense
              rounded
              color="grey-5"
              dropdown-icon="more_vert"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  dark
                  @click="showTask(task)"
                  class="bg-grey-9"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label
                      ><q-icon
                        name="visibility"
                        color="grey-5"
                        class="q-mr-md"
                        size="sm"
                      />View</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  dark
                  clickable
                  v-ripple
                  @click="archiveTask(task.id)"
                  class="bg-grey-9"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label>
                      <q-icon
                        name="archive"
                        color="grey-5"
                        class="q-mr-md"
                        size="sm"
                      />Archive</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  dark
                  clickable
                  v-ripple
                  @click="assingTask(task.id, !task.fixed)"
                  class="bg-grey-9"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label
                      ><q-icon
                        name="keep_on"
                        color="grey-5"
                        class="q-mr-md"
                        size="sm"
                        ><i
                          class="fa fa-thumbtack absolute-top-left"
                          style="transform: rotate(45deg)"
                        ></i></q-icon
                      >{{
                        !task.fixed ? "Assing Task" : "UnAssing Task"
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  dark
                  clickable
                  v-ripple
                  @click="deleteTask(task.id)"
                  class="bg-grey-9"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label class="text-red-5"
                      ><q-icon
                        name="delete"
                        color="red-5"
                        class="q-mr-md"
                        size="sm"
                      />Delete</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
          <q-separator dark />
          <q-card-section class="flex row">
            <div class="q-mr-sm">Categories:</div>
            <q-badge
              v-for="category in task.categories.slice(0, 3)"
              :key="category.id"
              :label="category.name"
              :style="'background-color: #' + category.color + ' !important'"
              class="q-mr-xs"
              dense
            >
              <q-icon :name="category.icon" color="white" class="q-ml-xs" />
            </q-badge>
          </q-card-section>
          <q-card-section>
            <q-item-label class="row">
              <div class="q-mr-sm text-white">Priority:</div>
              <div
                :class="{
                  'text-grey-7':
                    task.priority.weight < 3 && task.status !== 'ended',
                  'text-red-5':
                    task.priority.weight === 4 && task.status !== 'ended',
                  'text-orange-5':
                    task.priority.weight === 3 && task.status !== 'ended',
                  'text-green-5': task.status === 'ended',
                }"
              >
                {{
                  task.priority.weight > 3 && task.status !== "ended"
                    ? ` This task is ${priorities[task.priority.name].name}!!`
                    : " " + priorities[task.priority.name].name
                }}
                {{ task.status === "ended" ? " (Finalized)" : "" }}
              </div></q-item-label
            >
          </q-card-section>
          <q-separator dark />
          <q-card-section>
            <q-item-label style="user-select: text">{{
              task.description.length > 240
                ? task.description.substring(0, 240) + "..."
                : task.description
            }}</q-item-label>
          </q-card-section>
          <q-card-section
            :class="{
              'absolute-bottom-right': true,
              'text-grey-7': task.status !== 'ended',
              'text-green-5': task.status === 'ended',
            }"
            style="margin-bottom: -12px"
          >
            <q-item-label> Scheduled for: </q-item-label>
            <q-item-label class="flex row flex-center"
              ><q-icon name="calendar_today" class="q-mr-sm q-mb-xs" />{{
                task.isoDate
              }}</q-item-label
            >
          </q-card-section>
          <q-card-section
            class="absolute-bottom-left text-grey-7"
            style="margin-bottom: -12px"
          >
            <q-item-label> Created at: </q-item-label>
            <q-item-label class="flex row flex-center"
              ><q-icon name="calendar_today" class="q-mr-sm q-mb-xs" />{{
                task.isoCreatedAt
              }}</q-item-label
            >
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- paginacion -->
    <div class="flex flex-center">
      <q-pagination
        v-model="filters.page"
        :max="Math.ceil(totalTasks / filters.limit)"
        color="grey-8"
        dark
        class="q-mt-md text-dark"
        v-if="totalTasks > filters.limit && rows.length > 0"
        @click="filterTasks"
      />
      <q-select
        v-model="filters.limit"
        :options="rowsPerPageOptions"
        dark
        style="min-width: 100px"
        dense
        color="white"
        class="q-ml-xl q-mt-md"
        label-color="grey-7"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getTasks, editTask, deleteTask } from "src/functions/task";
import columns from "src/data/tasksPage/columns.json";
import { useQuasar } from "quasar";
import EventBus from "src/functions/EventBus";
import { getCategories } from "src/functions/categories";

const priorities = {
  urgent: {
    color: "#f22",
    name: "Urgent",
    icon: "error",
  },
  high: {
    color: "#ff6",
    name: "High",
    icon: "warning",
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
    const rows = ref([]);
    const categories = ref([]);
    const filters = ref({
      priority: { label: "All", value: 0 },
      order_by: { label: "Date of execution", value: "run_date" },
      asc_desc: { label: "Asc", value: "asc" },
      page: 1,
      categories: [],
      limit: 10,
      search: "",
      fixed: false,
      showArchives: false,
      showEndeds: false,
    });
    const totalTasks = ref(0);
    onMounted(() => {
      getCategories().then(({ data, status }) => {
        if (status === 200) {
          const ctg = data.categories.map((c) => {
            return { label: c.name, value: c.id };
          });
          categories.value = ctg;
        }
      });
    });
    const actualizeTasks = async () => {
      getTasks(
        filters.value.page,
        filters.value.limit,
        [],
        filters.value.search,
        filters.value.order_by.value,
        filters.value.asc_desc.value,
        filters.value.priority.value,
        filters.value.fixed,
        filters.value.showArchives,
        filters.value.showEndeds
      ).then(({ data, status }) => {
        if (status === 200) {
          data.tasks = data.tasks.map((t) => {
            let [y, m, d] = t.runDate.split("-");
            t.isoDate = `${d}/${m}/${y}`;
            [y, m, d] = t.createdAt.split("-");
            d = d.split(" ")[0];
            t.isoCreatedAt = `${d}/${m}/${y}`;
            return t;
          });
          rows.value = data.tasks;
          totalTasks.value = data.total ?? 0;
        } else if (status === 404) {
          rows.value = [];
        }
      });
    };
    setInterval(() => {
      actualizeTasks();
    }, 1000);

    EventBus.on("task-added", () => {
      getTasks(
        filters.value.page,
        filters.value.limit,
        filters.value.categories.map((c) => c.id),
        filters.value.search,
        filters.value.order_by.value,
        filters.value.asc_desc.value,
        filters.value.priority.value
      ).then(({ data, status }) => {
        if (status === 200) {
          rows.value = data.tasks;
        }
      });
    });
    EventBus.on("show-fixed-tasks", () => {
      console.log("Fixed tasks");
      filters.value.fixed = !filters.value.fixed;
      actualizeTasks();
    });
    EventBus.on("filter-by-category", (category) => {
      filters.value.categories = [category];
      actualizeTasks();
    });
    EventBus.on("task-updated", () => {
      actualizeTasks();
    });

    const $q = useQuasar();

    return {
      pagination: ref(1),
      filter: ref(""),
      selected: ref([]),
      columns,
      rows,
      originalRows: ref(rows),
      categories,
      priorities,
      filterBarOptions: [
        {
          label: "Priority",
          value: "priority",
          options: [
            { label: "All", value: 0 },
            { label: "Urgent", value: 4 },
            { label: "High", value: 3 },
            { label: "Normal", value: 2 },
            { label: "Low", value: 1 },
          ],
        },
        {
          label: "Order By",
          value: "order_by",
          options: [
            {
              label: "Date of execution",
              value: "run_date",
            },
            {
              label: "Date of creation",
              value: "created_at",
            },
            {
              label: "Title",
              value: "title",
            },
            {
              label: "Description",
              value: "description",
            },
          ],
        },
        {
          label: "Order",
          value: "asc_desc",
          options: [
            { label: "Asc", value: "asc" },
            { label: "Desc", value: "desc" },
          ],
        },
      ],
      filters,
      totalTasks,
      actualizeTasks,
      rowsPerPage: ref(10),
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      confirmDelete: (confirm, id) => {
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
    newCategory() {
      this.$emit("update:newcategory", true);
    },
    newTask() {
      this.$emit("update:newtask", true);
    },
    deleteTask(id) {
      if (id) {
        this.confirmDelete(this.confirm, id);
      }
    },
    confirm(id) {
      deleteTask(id)
        .then(({ status }) => {
          if (status === 200) {
            this.$q.notify({
              message: "Task deleted",
              color: "green-5",
              position: "bottom-right",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: "Error deleting task",
            color: "red-5",
            position: "bottom-right",
          });
        });
    },
    archiveTask(id) {
      if (id) {
        editTask(id, { status: "archived" }).then(({ data, status }) => {
          if (status === 200) {
            this.$q.notify({
              message: "Task archived",
              color: "green-5",
              position: "bottom-right",
            });
          }
        });
      } else {
        this.$q.notify({
          message: "Select a task to archive",
          color: "red-5",
          position: "bottom-right",
        });
      }
    },
    showTask(task) {
      this.$emit("update:showtask", task);
    },
    filterTasks() {
      this.actualizeTasks();
    },
    assingTask(id, on_off) {
      editTask(id, { fixed: on_off })
        .then(({ status }) => {
          if (status === 200) {
            this.$q.notify({
              message: on_off ? "Task assigned" : "Task unassigned",
              color: "green-5",
              position: "bottom-right",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss">
.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px 64px;
}
.task-archived {
  opacity: 0.5;
  pointer-events: none;
}
</style>
