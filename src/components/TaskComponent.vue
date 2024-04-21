<template>
  <q-dialog
    style="height: 100%; z-index: 6000"
    v-model="showModal"
    dark
    class="t-tasks-task"
    persistent
  >
    <q-card
      dark
      borderer
      style="min-width: 80vw; height: 100%; position: relative"
      class="q-pt-lg t-task-card"
    >
      <div class="flex column t-tasks-task-options">
        <q-btn
          dense
          flat
          round
          :icon="task.status === 'ended' ? 'settings_backup_restore' : 'check'"
          class="q-mt-sm"
          :title="task.status === 'ended' ? 'Dismark Task' : 'Finalize Task'"
        />
        <q-btn dense flat round icon="edit" class="q-mt-md" />
        <q-btn dense flat round icon="delete" class="q-mt-md" color="red" />
      </div>
      <q-card-section>
        <div :class="'text-h6 text-white q-mb-md flex flex-center '">
          <div :class="task.status === 'ended' ? 'text-green' : ''">
            {{ task.name }}
          </div>
          <q-icon
            :title="task.priority"
            :name="icons[task.priority].name"
            :color="icons[task.priority].color"
            class="q-ml-sm"
            size="sm"
            v-if="task.status !== 'ended'"
          />
          <q-icon name="check" style="color: green" class="q-ml-sm" v-else />
        </div>
        <div>
          <q-badge
            v-for="(category, key) in task.category"
            :key="key"
            :label="categories[category.toLowerCase()].name"
            :color="categories[category.toLowerCase()].color"
            class="q-mr-sm"
          />
        </div>
      </q-card-section>
      <q-btn
        dense
        flat
        round
        icon="close"
        @click="() => $emit('update:show', false)"
        class="t-tasks-task-close"
      />
      <q-separator inset dark />
      <q-card-section>
        <p style="white-space: pre-line; user-select: text">
          {{ task.description }}
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, watch } from "vue";
import categories from "src/data/tasksPage/categories.json";
import icons from "src/data/tasksPage/icons.json";

export default {
  name: "TaskComponent",
  props: {
    task: Object,
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props) {
    const showModal = ref(props.show);

    watch(
      () => props.show,
      (val) => {
        showModal.value = val;
      }
    );
    return {
      showModal,
      categories,
      icons,
    };
  },
};
</script>
