<template>
  <div class="q-pa-md">
    <q-table
      dark
      flat
      bordered
      title="Treats"
      :rows="
        rows.filter((r) => !(r.status === 'archived' && !showAffairArchives))
      "
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      class="t-affairs-table"
      :selected-rows-label="(n) => `${n} Affair(s) selected`"
      :rows-per-page-options="[5, 10, 20, 30, 50, 100]"
    >
      <template v-slot:top-right>
        <div class="flex row">
          <q-btn
            dense
            dark
            color="grey-8"
            icon="add"
            class="q-ml-md"
            @click="newAffair"
          />
          <q-btn
            dense
            dark
            color="grey-8"
            icon="archive"
            class="q-ml-md"
            @click="archiveAffair"
          />
          <q-btn
            dense
            dark
            color="grey-8"
            icon="inventory_2"
            class="q-ml-md"
            @click="showArchives"
          />
          <q-btn
            dense
            dark
            color="red"
            icon="delete"
            class="q-ml-md"
            @click="deleteAffair"
          />
        </div>
        <div class="flex row">
          <q-input
            dense
            dark
            outlined
            color="white"
            debounce="200"
            v-model="searchAffair"
            placeholder="Search Affair"
            class="q-ml-md"
            @update:model-value="filter(searchAffair)"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-model="props.selected" color="grey-6" dark />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="props.row.status === 'archived' ? 't-affair-archived' : ''"
        >
          <q-td auto-width>
            <q-checkbox v-model="props.selected" color="grey-6" dark />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'pap'" class="flex justify-center">
              <div class="q-mr-sm">{{ col.value.person }}</div>
              <q-separator vertical dark size="lg" />
              <div class="q-ml-sm">{{ col.value.phone }}</div>
            </div>
            <div v-else>
              {{ col.value }}
            </div>
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="grey-7"
              round
              dense
              @click="() => $emit('update:selectaffair', props.row)"
              icon="arrow_forward"
              class="q-ml-sm"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";
import affairs from "src/data/affairs/affairs.json";

const columns = [
  {
    name: "desc",
    required: true,
    label: "Affair title",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "pap",
    align: "center",
    label: "Person & Phone",
    field: "pap",
  },
];

const rows = ref(affairs);

export default {
  name: "AffairsTableComponent",
  setup() {
    const selected = ref([]);

    return {
      selected,
      columns,
      rows,
      searchAffair: ref(""),
      showAffairArchives: ref(false),
    };
  },
  methods: {
    newAffair() {
      this.$emit("update:newaffair", true);
    },
    archiveAffair() {
      console.log("Archive affair");
    },
    showArchives() {
      this.showAffairArchives = !this.showAffairArchives;
    },
    deleteAffair() {
      console.log("Delete affair");
    },
    filter(text) {
      text = text.toLowerCase();
      this.rows = affairs.filter((row) => {
        return (
          row.name.toLowerCase().includes(text) ||
          row.pap.person.toLowerCase().includes(text) ||
          row.pap.phone.toLowerCase().includes(text)
        );
      });
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
