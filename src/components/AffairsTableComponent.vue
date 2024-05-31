<template>
  <div class="q-pa-md">
    <div class="row flex flex-center">
      <div class="flex row t-table-header q-mt-sm">
        <q-toggle
          dense
          dark
          color="grey-8"
          class="q-ml-md"
          label="Show archiveds"
          v-model="filters.showArchiveds"
          @update:model-value="showArchiveds"
        />
        <q-btn
          dense
          dark
          color="grey-8"
          icon="add"
          class="q-ml-md"
          @click="newAffair"
        />
      </div>
      <div class="flex row q-mt-sm">
        <q-select
          dense
          dark
          outlined
          color="white"
          :options="orderByOptions"
          v-model="filters.order_by"
          label="Order By"
          class="q-ml-md"
          @update:model-value="filterAffairs"
          style="min-width: 140px"
        />
        <q-select
          dense
          dark
          outlined
          color="white"
          v-model="filters.asc_desc"
          :options="ascDescOptions"
          label="Order"
          class="q-ml-md"
          @update:model-value="filterAffairs"
          style="min-width: 100px"
        />
        <q-input
          dense
          dark
          outlined
          color="white"
          debounce="200"
          v-model="filters.search"
          placeholder="Search Affair"
          class="q-ml-md"
          @update:model-value="filterAffairs"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="t-affairs-content row">
      <div
        v-for="affair in affairs"
        :key="affair.id"
        class="col-12 column q-mb-md t-affair-card"
      >
        <q-card vertical dark class="row q-pa-md" style="height: 100%" flat>
          <q-card-section
            class="col-4 bg-grey-9 flex flex-center cursor-pointer"
            @click="showAffair(affair)"
          >
            <div class="text-h6">{{ affair.title }}</div>
          </q-card-section>
          <q-card-section class="col-2 flex flex-center">
            <div class="text-center">{{ affair.personName }}</div>
          </q-card-section>
          <q-card-section
            class="col-2 text-grey-7 text-right justify-center flex column"
          >
            <div>Created At:</div>
            <div class="text-left flex justify-end" style="font-size: 13px">
              <q-icon name="calendar_today" class="q-mr-xs" size="xs" />{{
                formatDate(affair.createdAt)
              }}
            </div>
          </q-card-section>
          <q-card-section
            class="col-2 text-brown text-right justify-center flex column"
          >
            <div>Last update:</div>
            <div class="text-left flex justify-end" style="font-size: 13px">
              <q-icon name="calendar_today" class="q-mr-xs" size="xs" />{{
                formatDate(affair.lastUpdate)
              }}
            </div>
          </q-card-section>
          <q-card-section class="col-2">
            <q-btn
              dense
              dark
              color="grey-8"
              icon="archive"
              class="q-mr-xs"
              @click="archiveAffair(affair.id)"
            />
            <q-btn
              dense
              dark
              color="red-5"
              icon="delete"
              class="q-ml-sm q-mr-xs"
              @click="confirmDeletion(affair.id)"
            />
            <q-chip
              label="Archived"
              color="grey-8"
              text-color="white"
              size="sm"
              v-if="affair.status === 'archived'"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- paginacion -->
    <div class="flex flex-center">
      <q-pagination
        v-model="filters.page"
        :max="Math.ceil(totalAffairs / filters.limit)"
        color="grey-8"
        dark
        class="q-mt-md text-dark"
        v-if="totalAffairs > filters.limit && affairs.length > 0"
        @click="filterAffairs(true)"
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
import { ref } from "vue";
import affairs from "src/data/affairs/affairs.json";
import formatDate from "src/functions/formatDate.js";
import { getAffairs, editAffair, deleteAffair } from "src/functions/affairs";
import EventBus from "src/functions/EventBus";
import storage from "src/functions/virtualStorage";
import { useQuasar } from "quasar";

export default {
  name: "AffairsTableComponent",
  setup() {
    const $q = useQuasar();
    const affairs = ref([]);
    const totalAffairs = ref(0);
    const filters = ref({
      page: 1,
      limit: 10,
      search: "",
      showArchiveds: false,
      order_by: {
        label: "Created At",
        value: "created_at",
      },
      asc_desc: {
        label: "Asc",
        value: "asc",
      },
    });

    const actualizeAffairs = () => {
      getAffairs(
        filters.value.search,
        filters.value.page,
        filters.value.limit,
        filters.value.showArchiveds,
        filters.value.order_by.value,
        filters.value.asc_desc.value
      ).then(({ data, status }) => {
        if (status === 200) {
          affairs.value = data.affairs;
          totalAffairs.value = data.total;
        }
      });
    };
    actualizeAffairs();

    setInterval(() => {
      actualizeAffairs();
    }, 10000);

    EventBus.on("affair-created", () => {
      actualizeAffairs();
    });
    EventBus.on("affair-updated", () => {
      actualizeAffairs();
    });

    return {
      actualizeAffairs,
      totalAffairs,
      filters,
      affairs,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      orderByOptions: [
        { label: "Created At", value: "created_at" },
        { label: "Last Update", value: "last_update" },
        { label: "Person Name", value: "person_name" },
        { label: "Title", value: "title" },
      ],
      ascDescOptions: [
        { label: "Asc", value: "asc" },
        { label: "Desc", value: "desc" },
      ],
      formatDate,
      confirmDelete: (confirm, id) => {
        $q.dialog({
          title: "Confirm",
          message: "Would you like to delete this affair?",
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
    newAffair() {
      this.$emit("update:newaffair", true);
    },
    archiveAffair(id) {
      editAffair({ affair_id: id, status: "archived" })
        .then(({ status }) => {
          if (status === 200) {
            this.actualizeAffairs();
            this.$q.notify({
              message: "Affair archived",
              color: "green-5",
              position: "bottom-right",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showArchiveds() {
      this.actualizeAffairs();
    },
    confirmDeletion(id) {
      this.confirmDelete(this.deleteAffair, id);
    },
    deleteAffair(id) {
      deleteAffair(id)
        .then(({ status }) => {
          if (status === 200) {
            this.actualizeAffairs();
            this.$q.notify({
              message: "Affair deleted",
              color: "red-5",
              position: "bottom-right",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            message: "Error deleting affair",
            color: "red-5",
            position: "bottom-right",
          });
        });
    },
    filterAffairs(keepPage = false) {
      if (!keepPage) {
        this.filters.page = 1;
      }
      this.actualizeAffairs();
    },
    showAffair(affair) {
      affair.timelines = [];
      storage.set("current_affair", affair.id);
      this.$emit("update:selectaffair", affair);
    },
  },
};
</script>
<style lang="sass">
.t-affairs-table
  /* height or max-height is important */
  max-height: 500px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #181818

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
