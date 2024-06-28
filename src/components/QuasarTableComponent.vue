<template>
  <div class="q-pa-md">
    <div class="flex row">
      <div class="flex row flex-center">
        <q-btn
          dense
          :dark="theme === 'dark'"
          color="grey-8"
          icon="add"
          class="q-ml-md q-mb-sm"
          @click="newTask"
        />
        <q-btn
          dense
          :dark="theme === 'dark'"
          color="grey-8"
          icon="category"
          class="q-ml-md q-mb-sm"
          @click="newCategory"
        />
        <div class="q-mr-md flex row flex-center">
          <q-select
            v-for="(option, key) in filterBarOptions"
            outlined
            :dark="theme === 'dark'"
            :key="key"
            v-model="filters[option.value]"
            :options="option.options"
            :label="option.label"
            class="t-select q-ml-md v-tasks q-mb-sm"
            :color="theme === 'dark' ? 'white' : 'dark'"
            dense
            @update:model-value="filterTasks"
            :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
            :style="'width: ' + key == 1 ? 170 : 70 + 'px'"
          />
        </div>
        <q-input
          dense
          :dark="theme === 'dark'"
          outlined
          :color="theme === 'dark' ? 'white' : 'dark'"
          debounce="200"
          v-model="filters.search"
          :placeholder="$t('pages.tasks.inputs.labels.search_task')"
          class="q-mr-md q-mb-sm"
          @update:model-value="filterTasks"
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-mt-md">
      <q-toggle
        :dark="theme === 'dark'"
        :color="theme === 'dark' ? 'grey-7' : 'grey-9'"
        v-model="filters.showArchives"
        :label="$t('pages.tasks.inputs.labels.show_archiveds')"
        dense
        :class="{ 'text-dark': theme !== 'dark' }"
        @update:model-value="filterTasks"
      />
      <q-toggle
        :dark="theme === 'dark'"
        :color="theme === 'dark' ? 'grey-7' : 'grey-9'"
        v-model="filters.showEndeds"
        :label="$t('pages.tasks.inputs.labels.show_finalizeds')"
        dense
        :class="{ 'q-ml-xl': true, 'text-dark': theme !== 'dark' }"
        @update:model-value="filterTasks"
      />
    </div>
    <div
      style="height: 58vh; overflow: auto; position: relative"
      :class="{
        'tasks-grid': true,
        'q-pl-md': true,
        'q-pr-md': true,
        't-light': theme !== 'dark',
      }"
    >
      <div
        v-if="rows.length === 0"
        class="absolute-top-left flex flex-center"
        style="width: 100%; height: 100%"
      >
        <div
          :class="{
            'text-h4': true,
            'text-grey-7': theme === 'dark',
            'text-grey-6': theme !== 'dark',
          }"
        >
          {{ $t("pages.tasks.titles.nothing_to_show") }}
        </div>
      </div>
      <div
        v-for="task in rows"
        :key="task.id"
        style="position: relative; height: 320px; width: 100%"
        :class="{
          'q-mt-md': true,
          'q-mb-sm': true,
          flex: true,
          'flex-center': true,
        }"
      >
        <q-card
          :dark="theme === 'dark'"
          :class="theme === 'dark' ? 'bg-grey-10' : 'bg-grey-5'"
          style="height: 100%; width: 100%"
        >
          <q-card-section
            :class="{
              'bg-grey-8': theme === 'dark',
              'bg-grey-6': theme !== 'dark',
              row: true,
            }"
          >
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
              :color="theme === 'dark' ? 'grey-5' : 'grey-8'"
              dense
              rounded
              :class="{
                'absolute-top-right q-mt-sm cursor-pointer': true,
                'task-archived': task.status === 'archived',
              }"
              style="margin-right: 40px"
              @click="assingTask(task.id, !task.fixed)"
            >
              <q-icon>
                <i class="fa fa-thumbtack" style="transform: rotate(45deg)"></i>
              </q-icon>
            </q-btn>
            <q-btn
              v-if="task.status === 'archived'"
              flat
              :color="theme === 'dark' ? 'grey-4' : 'grey-8'"
              dense
              rounded
              class="absolute-top-right q-mt-sm"
              style="margin-right: 40px"
              @click="archiveTask(task.id, 'created')"
            >
              <q-icon name="unarchive" />
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
              :class="{
                'absolute-top-right q-mr-xs q-mt-sm': true,
                'task-archived': task.status === 'archived',
              }"
              flat
              dense
              rounded
              :color="theme === 'dark' ? 'grey-5' : 'grey-8'"
              dropdown-icon="more_vert"
            >
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  :dark="theme === 'dark'"
                  @click="showTask(task)"
                  :class="theme === 'dark' ? 'bg-grey-9' : 'bg-grey-6'"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label
                      ><q-icon
                        name="visibility"
                        :color="theme === 'dark' ? 'grey-5' : 'grey-9'"
                        class="q-mr-md"
                        size="sm"
                      />{{ $t("pages.tasks.titles.view_task") }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  :dark="theme === 'dark'"
                  clickable
                  v-ripple
                  @click="archiveTask(task.id)"
                  :class="theme === 'dark' ? 'bg-grey-9' : 'bg-grey-6'"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label>
                      <q-icon
                        name="archive"
                        :color="theme === 'dark' ? 'grey-5' : 'grey-9'"
                        class="q-mr-md"
                        size="sm"
                      />{{ $t("pages.tasks.titles.archive") }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  :dark="theme === 'dark'"
                  clickable
                  v-ripple
                  @click="assingTask(task.id, !task.fixed)"
                  :class="theme === 'dark' ? 'bg-grey-9' : 'bg-grey-6'"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label
                      ><q-icon
                        name="keep_on"
                        :color="theme === 'dark' ? 'grey-5' : 'grey-9'"
                        class="q-mr-md"
                        size="sm"
                        ><i
                          class="fa fa-thumbtack absolute-top-left"
                          style="transform: rotate(45deg)"
                        ></i></q-icon
                      >{{
                        !task.fixed
                          ? $t("pages.tasks.titles.assign_task")
                          : $t("pages.tasks.titles.unassign_task")
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  :dark="theme === 'dark'"
                  clickable
                  v-ripple
                  @click="deleteTask(task.id)"
                  :class="theme === 'dark' ? 'bg-grey-9' : 'bg-grey-6'"
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label class="text-red-5"
                      ><q-icon
                        name="delete"
                        color="red-5"
                        class="q-mr-md"
                        size="sm"
                      />{{ $t("pages.tasks.titles.delete") }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-section>
          <q-separator :dark="theme === 'dark'" />
          <q-card-section
            :class="{
              'flex row': true,
              'task-archived': task.status === 'archived',
            }"
          >
            <div :class="{ 'q-mr-sm': true, 'text-dark': theme !== 'dark' }">
              {{ $t("pages.tasks.titles.categories") }}:
            </div>
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
          <q-card-section
            :class="{ 'task-archived': task.status === 'archived' }"
          >
            <q-item-label class="row">
              <div
                :class="{
                  'q-mr-sm': true,
                  'text-white': theme === 'dark',
                  'text-dark': theme !== 'dark',
                }"
              >
                {{ $t("pages.tasks.titles.priority") }}:
              </div>
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
                    ? $t("pages.tasks.messages.urgent_task")
                    : " " + priorities[task.priority.name].name
                }}
                {{
                  task.status === "ended"
                    ? ` (${$t("pages.tasks.titles.finalized")})`
                    : ""
                }}
              </div></q-item-label
            >
          </q-card-section>
          <q-separator :dark="theme === 'dark'" />
          <q-card-section
            :class="{ 'task-archived': task.status === 'archived' }"
          >
            <q-item-label
              style="user-select: text"
              :class="{ 'text-dark': theme !== 'dark' }"
              >{{
                task.description.length > 240
                  ? task.description.substring(0, 240) + "..."
                  : task.description
              }}</q-item-label
            >
          </q-card-section>
          <q-card-section
            :class="{
              'absolute-bottom-right': true,
              'text-grey-7': task.status !== 'ended',
              'text-green-5': task.status === 'ended',
              'task-archived': task.status === 'archived',
            }"
            style="margin-bottom: -12px"
          >
            <q-item-label>
              {{ $t("pages.tasks.titles.scheduled_for") }}
            </q-item-label>
            <q-item-label class="flex row flex-center"
              ><q-icon name="calendar_today" class="q-mr-sm q-mb-xs" />{{
                task.isoDate
              }}</q-item-label
            >
          </q-card-section>
          <q-card-section
            :class="{
              'absolute-bottom-left': true,
              'text-grey-7': theme === 'dark',
              'text-dark': theme !== 'dark',
              'task-archived': task.status === 'archived',
            }"
            style="margin-bottom: -12px"
          >
            <q-item-label>
              {{ $t("pages.tasks.titles.created_at") }}
            </q-item-label>
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
        :dark="theme === 'dark'"
        :class="{
          'q-mt-md': true,
          'text-dark': theme === 'dark',
          'text-white': theme !== 'dark',
        }"
        v-if="totalTasks > filters.limit && rows.length > 0"
        @click="filterTasks"
      />
      <q-select
        v-model="filters.limit"
        :options="rowsPerPageOptions"
        :dark="theme === 'dark'"
        style="min-width: 100px"
        dense
        :color="theme === 'dark' ? 'white' : 'dark'"
        class="q-ml-xl q-mt-md"
        label-color="grey-7"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getTasks, editTask, deleteTask } from "src/functions/task";
import columns from "src/data/tasksPage/columns.json";
import { useQuasar } from "quasar";
import EventBus from "src/functions/EventBus";
import { getCategories } from "src/functions/categories";
import storage from "src/functions/virtualStorage";
import { Loop } from "src/functions/utils";

export default {
  name: "QuasarTableComponent",
  data() {
    const theme = ref(storage.get("theme"));

    const priorities = {
      urgent: {
        color: "#f22",
        name: this.$t("pages.tasks.inputs.options.priorities.urgent"),
        icon: "error",
      },
      high: {
        color: "#ff6",
        name: this.$t("pages.tasks.inputs.options.priorities.high"),
        icon: "warning",
      },
      normal: {
        color: "#66f",
        name: this.$t("pages.tasks.inputs.options.priorities.normal"),
      },
      low: {
        color: "#6f6",
        name: this.$t("pages.tasks.inputs.options.priorities.low"),
      },
    };
    const rows = ref([]);
    const categories = ref([]);
    const filters = ref({
      priority: {
        label: this.$t("pages.tasks.inputs.options.priorities.all"),
        value: 0,
      },
      order_by: {
        label: this.$t("pages.tasks.inputs.options.orders_by.run_date"),
        value: "run_date",
      },
      asc_desc: {
        label: this.$t("pages.tasks.inputs.options.orders.asc"),
        value: "asc",
      },
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

    const loop = new Loop(() => {
      theme.value = storage.get("theme");
      actualizeTasks();
    });
    loop.start();

    //!! dimounting component
    onBeforeUnmount(() => {
      loop.stop();
    });

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
      theme,
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
          label: this.$t("pages.tasks.inputs.labels.priority"),
          value: "priority",
          options: [
            {
              label: this.$t("pages.tasks.inputs.options.priorities.all"),
              value: 0,
            },
            {
              label: this.$t("pages.tasks.inputs.options.priorities.urgent"),
              value: 4,
            },
            {
              label: this.$t("pages.tasks.inputs.options.priorities.high"),
              value: 3,
            },
            {
              label: this.$t("pages.tasks.inputs.options.priorities.normal"),
              value: 2,
            },
            {
              label: this.$t("pages.tasks.inputs.options.priorities.low"),
              value: 1,
            },
          ],
        },
        {
          label: this.$t("pages.tasks.inputs.labels.order_by"),
          value: "order_by",
          options: [
            {
              label: this.$t("pages.tasks.inputs.options.orders_by.run_date"),
              value: "run_date",
            },
            {
              label: this.$t("pages.tasks.inputs.options.orders_by.created_at"),
              value: "created_at",
            },
            {
              label: this.$t("pages.tasks.inputs.options.orders_by.title"),
              value: "title",
            },
            {
              label: this.$t(
                "pages.tasks.inputs.options.orders_by.description"
              ),
              value: "description",
            },
          ],
        },
        {
          label: this.$t("pages.tasks.inputs.labels.order"),
          value: "asc_desc",
          options: [
            {
              label: this.$t("pages.tasks.inputs.options.orders.asc"),
              value: "asc",
            },
            {
              label: this.$t("pages.tasks.inputs.options.orders.desc"),
              value: "desc",
            },
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
              message: this.$t("pages.tasks.messages.task_deleted"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: this.$t("pages.tasks.messages.error_deleting_task"),
            color: "red-5",
            position: "bottom-right",
            timeout: 2000,
          });
        });
    },
    archiveTask(id, _status = "archived") {
      if (id) {
        editTask(id, { status: _status }).then(({ data, status }) => {
          if (status === 200) {
            this.$q.notify({
              message: this.$t(
                `pages.tasks.messages.task_${
                  _status === "archived" ? "archived" : "unarchived"
                }`
              ),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
          }
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
              message: on_off
                ? this.$t("pages.tasks.messages.task_assigned")
                : this.$t("pages.tasks.messages.task_unassigned"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
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
