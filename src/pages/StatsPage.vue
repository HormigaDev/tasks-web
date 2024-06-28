<template>
  <q-page style="overflow: auto !important; max-height: calc(100vh - 74px)">
    <div class="full-width flex flex-center row q-mt-md">
      <q-input
        dark
        v-model="startDate"
        :label="$t('pages.stats.inputs.labels.start_date')"
        dense
        outlined
        class="q-mr-md"
        color="white"
      >
        <template v-slot:append>
          <q-icon name="event" color="white" class="cursor-pointer">
            <q-popup-proxy
              @before-show="updateStartProxy"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="startProxyDate" color="grey-8">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="grey-7" flat v-close-popup />
                  <q-btn
                    label="OK"
                    color="grey-7"
                    unelevated
                    @click="saveStart"
                    v-close-popup
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        dark
        v-model="endDate"
        :label="$t('pages.stats.inputs.labels.end_date')"
        dense
        outlined
        color="white"
        class="q-ml-md"
      >
        <template v-slot:append>
          <q-icon name="event" color="white" class="cursor-pointer">
            <q-popup-proxy
              @before-show="updateEndProxy"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="endProxyDate" color="grey-8">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="grey-7" flat v-close-popup />
                  <q-btn
                    label="OK"
                    color="grey-7"
                    unelevated
                    @click="saveEnd"
                    v-close-popup
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="full-width row q-mb-lg">
      <div class="q-pa-md t-chart-container col-6">
        <pie-chart
          id="my-chart-id"
          :options="affairsOptions"
          :data="affairsData"
        />
      </div>
      <div class="q-pa-md t-chart-container col-6">
        <pie-chart id="my-chart-id" :options="tasksOptions" :data="tasksData" />
      </div>
      <div class="q-pa-md t-chart-container col-6">
        <pie-chart
          id="my-chart-id"
          :options="categoriesOptions"
          :data="categoriesData"
        />
      </div>
      <div class="q-pa-md t-chart-container col-6">
        <pie-chart id="my-chart-id" :options="userOptions" :data="userData" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onBeforeUnmount } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getStats as getstats } from "src/functions/auth";
import { Loop } from "src/functions/utils";
import formatDate, { formatDateToISO } from "src/functions/formatDate";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  components: {
    PieChart: Pie,
  },
  data() {
    const startProxyDate = ref(formatDate(new Date(), "Y/M/D"));
    const endProxyDate = ref(formatDate(new Date(), "Y/M/D"));
    const startDate = ref(formatDate(startProxyDate.value));
    const endDate = ref(formatDate(endProxyDate.value));
    const dataChart = ref([0, 0, 0]);

    const tasksData = ref({
      labels: ["", "", ""],
      datasets: [
        {
          label: "",
          data: dataChart.value,
          backgroundColor: ["#b3ff99", "#99b3ff", "#FF5353"],
        },
      ],
    });
    const categoriesData = ref({
      labels: ["", "", ""],
      datasets: [
        {
          label: "",
          data: dataChart.value,
          backgroundColor: ["#b3ff99", "#99b3ff", "#FF5353"],
        },
      ],
    });
    const affairsData = ref({
      labels: ["", "", ""],
      datasets: [
        {
          label: "",
          data: dataChart.value,
          backgroundColor: ["#b3ff99", "#99b3ff", "#FF5353"],
        },
      ],
    });
    const userData = ref({
      labels: ["", ""],
      datasets: [
        {
          label: "",
          data: dataChart.value,
          backgroundColor: ["#b3ff99", "#99b3ff"],
        },
      ],
    });

    const getStats = () => {
      getstats(
        formatDateToISO(startDate.value),
        formatDateToISO(endDate.value)
      ).then(({ data, status }) => {
        if (status === 200) {
          const { stats, taskStats, affairStats } = data;
          tasksData.value = {
            labels: [
              this.$t("pages.stats.inputs.options.tasks.createds"),
              this.$t("pages.stats.inputs.options.tasks.editeds"),
              this.$t("pages.stats.inputs.options.tasks.finalizeds"),
              this.$t("pages.stats.inputs.options.tasks.archiveds"),
              this.$t("pages.stats.inputs.options.tasks.deleteds"),
            ],
            datasets: [
              {
                label: this.$t("pages.stats.titles.tasks"),
                data: [
                  stats.created_tasks,
                  stats.edited_tasks,
                  taskStats.finalized_tasks,
                  taskStats.archived_tasks,
                  stats.deleted_tasks,
                ],
                backgroundColor: [
                  "#b3ff99",
                  "#99b3ff",
                  "#90ff90",
                  "#565656",
                  "#FF5353",
                ],
              },
            ],
          };
          categoriesData.value = {
            labels: [
              this.$t("pages.stats.inputs.options.categories.createds"),
              this.$t("pages.stats.inputs.options.categories.editeds"),
              this.$t("pages.stats.inputs.options.categories.deleteds"),
            ],
            datasets: [
              {
                label: this.$t("pages.stats.titles.categories"),
                data: [
                  stats.created_categories,
                  stats.edited_categories,
                  stats.deleted_categories,
                ],
                backgroundColor: ["#b3ff99", "#99b3ff", "#FF5353"],
              },
            ],
          };
          affairsData.value = {
            labels: [
              this.$t("pages.stats.inputs.options.affairs.createds"),
              this.$t("pages.stats.inputs.options.affairs.editeds"),
              this.$t("pages.stats.inputs.options.affairs.archiveds"),
              this.$t("pages.stats.inputs.options.affairs.deleteds"),
            ],
            datasets: [
              {
                label: this.$t("pages.stats.titles.affairs"),
                data: [
                  stats.created_affairs,
                  stats.edited_affairs,
                  affairStats.archived_affairs,
                  stats.deleted_affairs,
                ],
                backgroundColor: ["#b3ff99", "#99b3ff", "#565656", "#FF5353"],
              },
            ],
          };
          userData.value = {
            labels: [
              this.$t("pages.stats.inputs.options.user.changed_passwords"),
              this.$t("pages.stats.inputs.options.user.changed_usernames"),
            ],
            datasets: [
              {
                label: this.$t("pages.stats.titles.user"),
                data: [stats.changed_passwords, stats.changed_usernames],
                backgroundColor: ["#b3ff99", "#99b3ff"],
              },
            ],
          };
        }
      });
    };
    const loop = new Loop(getStats);
    loop.start();
    const tasksOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: this.$t("pages.stats.titles.tasks"),
        },
      },
    });
    const categoriesOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: this.$t("pages.stats.titles.categories"),
        },
      },
    });
    const affairsOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: this.$t("pages.stats.titles.affairs"),
        },
      },
    });
    const userOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: this.$t("pages.stats.titles.user"),
        },
      },
    });

    onBeforeUnmount(() => {
      loop.stop();
    });

    return {
      tasksData,
      tasksOptions,
      categoriesData,
      categoriesOptions,
      affairsData,
      affairsOptions,
      userData,
      userOptions,
      startDate,
      startProxyDate,
      endDate,
      endProxyDate,
      getStats,
    };
  },
  methods: {
    updateStartProxy() {
      // this.startProxyDate = this.startDate;
    },
    saveStart() {
      this.startDate = formatDate(this.startProxyDate);
      this.getStats();
    },
    updateEndProxy() {
      // this.endProxyDate = this.endDate;
    },
    saveEnd() {
      this.endDate = formatDate(this.endProxyDate);
      this.getStats();
    },
  },
});
</script>
