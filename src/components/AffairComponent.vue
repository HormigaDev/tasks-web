<template>
  <q-dialog persistent v-model="show" :dark="theme === 'dark'">
    <q-card
      :dark="theme === 'dark'"
      style="min-width: 80%; position: relative; height: 100%; max-height: 80vh"
      class="q-mt-xl"
    >
      <q-btn
        flat
        rounded
        dense
        icon="close"
        class="absolute-top-right q-mr-xs q-mt-xs"
        :color="theme === 'dark' ? 'white' : 'dark'"
        style="z-index: 99"
        @click="() => $emit('update:show', false)"
      />
      <q-card-section class="flex" style="position: sticky">
        <div class="text-h6">
          {{ affair.title }}
          <q-btn
            dense
            color="grey-7"
            icon="add"
            size="sm"
            class="q-ml-lg"
            @click="newTimeline"
          />
          <q-btn
            dense
            color="grey-7"
            icon="edit"
            size="sm"
            class="q-ml-md"
            @click="editing = !editing"
          />
          <q-btn
            dense
            color="grey-7"
            icon="edit"
            size="sm"
            class="q-ml-md q-pr-sm q-pl-xs"
            :label="$t('pages.affairs.buttons.edit_affair')"
            v-if="editing"
            @click="editAffair(affair.id)"
          />
        </div>
      </q-card-section>
      <q-card-section style="max-height: 60vh; height: 100%">
        <div
          :class="{
            'q-px-lg': true,
            'q-py-md': true,
            't-light': theme !== 'dark',
          }"
          style="max-height: 60vh; height: 100%; overflow: auto"
        >
          <q-timeline color="secondary">
            <q-timeline-entry
              v-for="timeline in affair.timelines"
              :key="timeline.id"
              :title="timeline.title"
              :subtitle="formatDate(timeline.createdAt)"
              color="grey-7"
              :icon="editing ? 'edit' : 'schedule'"
            >
              <template v-slot:subtitle>
                <div>
                  <q-btn
                    size="xs"
                    icon="edit"
                    color="grey-7"
                    class="q-pa-xs q-mr-sm"
                    v-if="editing"
                    @click="editTimeline(timeline)"
                  />
                  <q-btn
                    size="xs"
                    icon="delete"
                    color="red"
                    class="q-pa-xs q-mr-sm"
                    v-if="editing"
                    @click="confirmDeletionTimeline(timeline.id)"
                  />
                  {{ formatDate(timeline.createdAt) }}
                </div>
              </template>
              <div style="user-select: text; white-space: pre-line">
                {{ timeline.description }}
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, watch } from "vue";
import formatDate from "src/functions/formatDate";
import { getAffairTimelines, deleteTimeline } from "src/functions/affairs";
import EventBus from "src/functions/EventBus";
import storage from "src/functions/virtualStorage";
import { useQuasar } from "quasar";

export default {
  name: "AffairComponent",
  props: {
    showProp: Boolean,
    affairProp: Object,
    _theme: String,
  },
  emits: ["update:show", "update:newtimeline", "update:editaffair"],
  data(props) {
    const theme = ref(props._theme);
    const affair = ref(props.affairProp);
    const $q = useQuasar();
    const actualizeTimelines = () => {
      getAffairTimelines(affair.value.id).then(({ data, status }) => {
        if (status === 200) {
          affair.value.timelines = data.timelines;
        }
      });
    };
    actualizeTimelines();

    watch(
      () => props.showProp,
      (value) => {
        if (value) {
          show.value = value;
        }
      }
    );

    watch(
      () => props.affairProp,
      (value) => {
        if (value) {
          affair.value = value;
        }
      }
    );

    watch(
      () => props._theme,
      (value) => {
        theme.value = value;
      }
    );

    EventBus.on("timeline-created", () => {
      actualizeTimelines();
    });
    EventBus.on("timeline-updated", () => {
      actualizeTimelines();
    });

    return {
      theme,
      actualizeTimelines,
      show: ref(props.showProp),
      affair,
      editing: ref(false),
      formatDate,
      confirmDelete: (confirm, id) => {
        $q.dialog({
          title: this.$t("pages.affairs.titles.confirm_deletion"),
          message: this.$t("pages.affairs.messages.confirm_delete_timeline"),
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
    randomColor() {
      const colors = [
        "primary",
        "secondary",
        "accent",
        "positive",
        "info",
        "warning",
        "purple",
        "pink",
        "green",
        "blue",
        "yellow",
        "cyan",
        "teal",
        "orange",
        "deep-orange",
        "deep-purple",
        "light-blue",
        "light-green",
        "lime",
        "amber",
        "brown",
        "grey",
        "blue-grey",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    newTimeline() {
      EventBus.emit("new-affair-timeline", this.affair.id);
      this.$emit("update:newtimeline", true);
    },
    editAffair(id) {
      storage.set("editingAffair", {
        title: this.affair.title,
        personName: this.affair.personName,
        id: id,
      });
      this.$emit("update:editaffair", true);
      this.$emit("update:show", false);
    },
    editTimeline(timeline) {
      storage.set("editingTimeline", timeline);
      this.$emit("update:newtimeline", true);
    },
    confirmDeletionTimeline(id) {
      this.confirmDelete(this.deleteTimeline, id);
    },
    deleteTimeline(id) {
      deleteTimeline(storage.get("current_affair"), id).then(({ status }) => {
        if (status === 200) {
          this.$q.notify({
            message: this.$t("pages.affairs.messages.timeline_deleted"),
            color: "green-5",
            position: "bottom-right",
            timeout: 2000,
          });
          this.actualizeTimelines();
        }
      });
    },
  },
};
</script>
