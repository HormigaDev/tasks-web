<template>
  <div class="q-pa-md">
    <div class="row flex flex-center">
      <div class="flex row t-table-header q-mt-sm">
        <q-toggle
          dense
          :dark="theme === 'dark'"
          color="grey-8"
          class="q-ml-md"
          :label="$t('pages.affairs.inputs.labels.show_archiveds')"
          v-model="filters.showArchiveds"
          @update:model-value="showArchiveds"
        />
        <q-btn
          dense
          :dark="theme === 'dark'"
          color="grey-8"
          icon="add"
          class="q-ml-md"
          @click="newAffair"
        />
      </div>
      <div class="flex row q-mt-sm">
        <q-select
          dense
          :dark="theme === 'dark'"
          outlined
          :color="theme === 'dark' ? 'white' : 'dark'"
          :options="orderByOptions"
          v-model="filters.order_by"
          :label="$t('pages.affairs.inputs.labels.order_by')"
          class="q-ml-md"
          @update:model-value="filterAffairs"
          style="min-width: 140px"
        />
        <q-select
          dense
          :dark="theme === 'dark'"
          outlined
          :color="theme === 'dark' ? 'white' : 'dark'"
          v-model="filters.asc_desc"
          :options="ascDescOptions"
          :label="$t('pages.affairs.inputs.labels.order')"
          class="q-ml-md"
          @update:model-value="filterAffairs"
          style="min-width: 100px"
        />
        <q-input
          dense
          :dark="theme === 'dark'"
          outlined
          :color="theme === 'dark' ? 'white' : 'dark'"
          debounce="200"
          v-model="filters.search"
          :placeholder="$t('pages.affairs.inputs.labels.search_affair')"
          class="q-ml-md"
          @update:model-value="filterAffairs"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div
      :class="{
        't-light': theme !== 'dark',
        't-affairs-content': true,
        row: true,
      }"
      style="position: relative"
    >
      <div
        v-if="affairs.length === 0"
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
          {{ $t("pages.affairs.titles.nothing_to_show") }}
        </div>
      </div>
      <div
        v-for="affair in affairs"
        :key="affair.id"
        :class="{
          'col-12': true,
          column: true,
          'q-mb-md': true,
          't-affair-card': true,
          't-light': theme !== 'dark',
        }"
      >
        <q-card
          vertical
          :dark="theme === 'dark'"
          class="row q-pa-md"
          style="height: 100%"
          flat
        >
          <q-card-section
            :class="{
              'col-4': true,
              'bg-grey-9': theme === 'dark',
              'bg-grey-4': theme !== 'dark',
              flex: true,
              'flex-center': true,
              'cursor-pointer': true,
            }"
            @click="showAffair(affair)"
          >
            <div class="text-h6">{{ affair.title }}</div>
          </q-card-section>
          <q-card-section class="col-2 flex flex-center">
            <div
              :class="{ 'text-center': true, 'text-bold': theme !== 'dark' }"
            >
              {{ affair.personName }}
            </div>
          </q-card-section>
          <q-card-section
            :class="{
              'col-2': true,
              'text-grey-7': theme === 'dark',
              'text-grey-9': theme !== 'dark',
              'text-right': true,
              'justify-center': true,
              flex: true,
              column: true,
            }"
          >
            <div>{{ $t("pages.affairs.titles.created_at") }}</div>
            <div class="text-left flex justify-end" style="font-size: 13px">
              <q-icon name="calendar_today" class="q-mr-xs" size="xs" />{{
                formatDate(affair.createdAt)
              }}
            </div>
          </q-card-section>
          <q-card-section
            class="col-2 text-brown text-right justify-center flex column"
          >
            <div>{{ $t("pages.affairs.titles.last_update") }}</div>
            <div class="text-left flex justify-end" style="font-size: 13px">
              <q-icon name="calendar_today" class="q-mr-xs" size="xs" />{{
                formatDate(affair.lastUpdate)
              }}
            </div>
          </q-card-section>
          <q-card-section class="col-2">
            <q-btn
              dense
              :dark="theme === 'dark'"
              color="grey-8"
              :icon="affair.status === 'archived' ? 'unarchive' : 'archive'"
              class="q-mr-xs"
              @click="archiveAffair(affair.id, affair.status)"
            />
            <q-btn
              dense
              :dark="theme === 'dark'"
              color="red-5"
              icon="delete"
              class="q-ml-sm q-mr-xs"
              @click="confirmDeletion(affair.id)"
            />
            <q-chip
              :label="$t('pages.affairs.inputs.labels.archived')"
              :color="theme === 'dark' ? 'grey-8' : 'grey-5'"
              text-:color="theme === 'dark'?'white':'dark'"
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
        :dark="theme === 'dark'"
        class="q-mt-md text-dark"
        v-if="totalAffairs > filters.limit && affairs.length > 0"
        @click="filterAffairs(true)"
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
import { onBeforeUnmount, ref, watch } from "vue";
import affairs from "src/data/affairs/affairs.json";
import formatDate from "src/functions/formatDate.js";
import { getAffairs, editAffair, deleteAffair } from "src/functions/affairs";
import EventBus from "src/functions/EventBus";
import storage from "src/functions/virtualStorage";
import { useQuasar } from "quasar";
import { Loop } from "src/functions/utils";

export default {
  name: "AffairsTableComponent",
  props: {
    _theme: String,
  },
  data(props) {
    const theme = ref(props._theme);
    const $q = useQuasar();
    const affairs = ref([]);
    const totalAffairs = ref(0);
    const filters = ref({
      page: 1,
      limit: 10,
      search: "",
      showArchiveds: false,
      order_by: {
        label: this.$t("pages.affairs.inputs.options.orders_by.created_at"),
        value: "created_at",
      },
      asc_desc: {
        label: this.$t("pages.affairs.inputs.options.orders.asc"),
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

    const loop = new Loop(() => {
      actualizeAffairs();
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    EventBus.on("affair-created", () => {
      actualizeAffairs();
    });
    EventBus.on("affair-updated", () => {
      actualizeAffairs();
    });

    watch(
      () => theme.value,
      () => {
        storage.set("theme", theme.value);
      }
    );

    return {
      theme,
      actualizeAffairs,
      totalAffairs,
      filters,
      affairs,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      orderByOptions: [
        {
          label: this.$t("pages.affairs.inputs.options.orders_by.created_at"),
          value: "created_at",
        },
        {
          label: this.$t("pages.affairs.inputs.options.orders_by.last_update"),
          value: "last_update",
        },
        {
          label: this.$t("pages.affairs.inputs.options.orders_by.person_name"),
          value: "person_name",
        },
        {
          label: this.$t("pages.affairs.inputs.options.orders_by.title"),
          value: "title",
        },
      ],
      ascDescOptions: [
        {
          label: this.$t("pages.affairs.inputs.options.orders.asc"),
          value: "asc",
        },
        {
          label: this.$t("pages.affairs.inputs.options.orders.desc"),
          value: "desc",
        },
      ],
      formatDate,
      confirmDelete: (confirm, id) => {
        $q.dialog({
          title: this.$t("pages.affairs.titles.confirm_deletion"),
          message: this.$t("pages.affairs.messages.confirm_delete"),
          cancel: {
            label: this.$t("pages.affairs.buttons.cancel"),
            color: "grey-8",
          },
          persistent: true,
          color: "red-5",
          dark: theme.value === "dark",
          ok: {
            label: this.$t("pages.affairs.buttons.delete"),
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
    newAffair() {
      this.$emit("update:newaffair", true);
    },
    archiveAffair(id, _status) {
      editAffair({
        affair_id: id,
        status: _status === "archived" ? "created" : "archived",
      })
        .then(({ status }) => {
          if (status === 200) {
            console.log("status", status);
            this.$q.notify({
              message: this.$t(
                `pages.affairs.messages.affair_${
                  _status === "archived" ? "unarchived" : "archived"
                }`
              ),
              color: this.theme === "dark" ? "green-5" : "green",
              position: "bottom-right",
              timeout: 2000,
            });
            this.actualizeAffairs();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showArchiveds() {
      this.filters.page = 1;
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
              message: this.$t("pages.affairs.messages.affair_deleted"),
              color: this.theme === "dark" ? "red-5" : "red",
              position: "bottom-right",
              timeout: 2000,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            message: this.$t("pages.affairs.messages.error_deleting_affair"),
            color: this.theme === "dark" ? "red-5" : "red",
            position: "bottom-right",
            timeout: 2000,
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
