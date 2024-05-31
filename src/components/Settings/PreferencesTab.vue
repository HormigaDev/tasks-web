<template>
  <q-tab-panel :name="name" class="flex column t-settings-tab">
    <div class="flex flex-center column">
      <div class="text-h6">Apperance</div>
      <div class="flex row justify-center">
        <q-select
          v-model="settings.language"
          :options="languages"
          label="App language"
          dark
          color="white"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          label-color="grey-7"
        />
        <q-select
          v-model="settings.theme"
          :options="themes"
          label="App theme"
          dark
          color="white"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          label-color="grey-7"
        />
        <q-select
          v-model="settings.timeFormat"
          :options="timeFormats"
          label="Time format"
          dark
          color="white"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          label-color="grey-7"
        />
      </div>
    </div>
    <q-separator dark width="80%" class="q-mt-lg q-mb-lg" color="grey-9" />
    <div class="flex flex-center column">
      <div class="text-h6">Behavior</div>
      <div class="flex row justify-center">
        <!-- default priority -->
        <q-select
          v-model="settings.defaultPriority"
          :options="defaultPriorities"
          label="Default priority"
          dark
          color="white"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          label-color="grey-7"
        />
      </div>
    </div>
  </q-tab-panel>
</template>
<script>
import { ref } from "vue";

export default {
  name: "PreferencesTab",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      languages: [
        {
          label: "English",
          value: "en",
        },
        {
          label: "Spanish",
          value: "es",
        },
        {
          label: "Portuguese",
          value: "pt",
        },
      ],
      themes: [
        {
          label: "Dark",
          value: "dark",
        },
        {
          label: "Light",
          value: "light",
        },
      ],
      timeFormats: [
        {
          label: "12 hours",
          value: "12",
        },
        {
          label: "24 hours",
          value: "24",
        },
      ],
      defaultPriorities: [
        {
          label: "Low",
          value: "low",
        },
        {
          label: "Normal",
          value: "normal",
        },
        {
          label: "High",
          value: "high",
        },
        {
          label: "Urgent",
          value: "urgent",
        },
      ],
      settings: ref({
        language: {
          label: "English",
          value: "en",
        },
        theme: {
          label: "Dark",
          value: "dark",
        },
        timeFormat: {
          label: "12 hours",
          value: "12",
        },
        defaultPriority: {
          label: "Normal",
          value: "normal",
        },
      }),
    };
  },
};
</script>
