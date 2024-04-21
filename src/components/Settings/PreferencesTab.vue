<template>
  <q-tab-panel :name="name" class="flex column" style="align-items: center">
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
      }),
    };
  },
};
</script>
