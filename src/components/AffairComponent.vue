<template>
  <q-dialog persistent v-model="show" dark>
    <q-card
      dark
      style="min-width: 80%; position: relative; height: 100%; max-height: 80vh"
      class="q-mt-xl"
    >
      <q-btn
        flat
        rounded
        dense
        icon="close"
        class="absolute-top-right q-mr-xs q-mt-xs"
        color="white"
        style="z-index: 99"
        @click="() => $emit('update:show', false)"
      />
      <q-card-section class="flex" style="position: sticky">
        <div class="text-h6">
          {{ affair.name }}
          <q-btn
            dense
            color="grey-7"
            icon="add"
            size="sm"
            class="q-ml-lg"
            @click="() => $emit('update:newtimeline', true)"
          />
          <q-btn
            dense
            color="grey-7"
            icon="edit"
            size="sm"
            class="q-ml-md"
            @click="editing = !editing"
          />
        </div>
      </q-card-section>
      <q-card-section style="max-height: 60vh; height: 100%; overflow: auto">
        <div class="q-px-lg q-py-md">
          <q-timeline color="secondary">
            <q-timeline-entry
              v-for="(timeline, i) in affair.timeline"
              :key="i"
              :title="timeline.title"
              :subtitle="timeline.date"
              :color="timeline.color"
              :icon="editing ? 'edit' : ''"
            >
              <template v-slot:subtitle>
                <div>
                  <q-btn
                    size="xs"
                    icon="delete"
                    color="red"
                    class="q-pa-xs q-mr-sm"
                    v-if="editing"
                  />
                  {{ timeline.date }}
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

export default {
  name: "AffairComponent",
  props: {
    showProp: Boolean,
    affairProp: Object,
  },
  emits: ["update:show"],
  setup(props) {
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

    return {
      show: ref(props.showProp),
      affair: ref(props.affairProp),
      editing: ref(false),
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
  },
};
</script>
