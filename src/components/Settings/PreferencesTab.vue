<template>
  <q-tab-panel :name="name" class="flex column t-settings-tab">
    <div class="flex flex-center column">
      <div :class="{ 'text-h6': true, 'text-dark': theme !== 'dark' }">
        {{ $t("pages.settings.titles.preferences") }}
      </div>
      <div class="flex row justify-center">
        <q-select
          v-model="settings.language"
          :options="languages"
          :label="$t('pages.settings.inputs.labels.app_language')"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          @update:model-value="changeLanguage"
        />
        <q-select
          v-model="settings.theme"
          :options="themes"
          :label="$t('pages.settings.inputs.labels.app_theme')"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          @update:model-value="saveConfigurations('theme')"
        />
        <q-select
          v-model="settings.timeFormat"
          :options="timeFormats"
          :label="$t('pages.settings.inputs.labels.time_format')"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          class="q-mt-md q-ml-md q-mr-md t-settings-select t-disabled"
          outlined
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          @update:model-value="saveConfigurations('timeFormat')"
        />
      </div>
    </div>
    <q-separator
      :dark="theme === 'dark'"
      width="80%"
      class="q-mt-lg q-mb-lg"
      color="grey-9"
    />
    <div class="flex flex-center column">
      <div :class="{ 'text-h6': true, 'text-dark': theme !== 'dark' }">
        {{ $t("pages.settings.titles.behavior") }}
      </div>
      <div class="flex row justify-center">
        <q-select
          v-model="settings.defaultPriority"
          :options="defaultPriorities"
          :label="$t('pages.settings.inputs.labels.default_priority')"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          @update:model-value="saveConfigurations('defaultPriority')"
        />
        <q-select
          v-model="settings.mainView"
          :options="viewOptions"
          :label="$t('pages.settings.inputs.labels.main_view')"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          class="q-mt-md q-ml-md q-mr-md t-settings-select"
          outlined
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          @update:model-value="saveConfigurations('mainView')"
        />
      </div>
    </div>
  </q-tab-panel>
</template>
<script>
import { ref, watch } from "vue";
import { getLocale, setConfig, getConfig } from "src/functions/configs";

export default {
  name: "PreferencesTab",
  props: {
    name: {
      type: String,
      required: true,
    },
    _theme: String,
  },
  data(props) {
    const theme = ref(props._theme);
    const languages = ref([]);
    const themes = ref([]);
    const timeFormats = ref([]);
    const defaultPriorities = ref([]);
    const viewOptions = ref([]);
    const settings = ref({
      language: {
        label: this.$t("pages.settings.inputs.options.languages.en-US"),
        value: "en-US",
      },
      theme: {
        label: this.$t("pages.settings.inputs.options.themes.dark"),
        value: "dark",
      },
      timeFormat: {
        label: this.$t("pages.settings.inputs.options.time_formats.12"),
        value: "12",
      },
      defaultPriority: {
        label: this.$t("pages.settings.inputs.options.priorities.normal"),
        value: "normal",
      },
      mainView: {
        label: this.$t("pages.settings.inputs.options.main_views.tasks"),
        value: "tasks",
      },
    });

    const actualizeConfigs = () => {
      languages.value = [
        {
          label: this.$t("pages.settings.inputs.options.languages.en-US"),
          value: "en-US",
        },
        {
          label: this.$t("pages.settings.inputs.options.languages.es-ES"),
          value: "es-ES",
        },
        {
          label: this.$t("pages.settings.inputs.options.languages.pt-BR"),
          value: "pt-BR",
        },
      ];

      themes.value = [
        {
          label: this.$t("pages.settings.inputs.options.themes.dark"),
          value: "dark",
        },
        {
          label: this.$t("pages.settings.inputs.options.themes.light"),
          value: "light",
        },
      ];

      timeFormats.value = [
        {
          label: this.$t("pages.settings.inputs.options.time_formats.12"),
          value: "12",
        },
        {
          label: this.$t("pages.settings.inputs.options.time_formats.24"),
          value: "24",
        },
      ];

      defaultPriorities.value = [
        {
          label: this.$t("pages.settings.inputs.options.priorities.low"),
          value: "low",
        },
        {
          label: this.$t("pages.settings.inputs.options.priorities.normal"),
          value: "normal",
        },
        {
          label: this.$t("pages.settings.inputs.options.priorities.high"),
          value: "high",
        },
        {
          label: this.$t("pages.settings.inputs.options.priorities.urgent"),
          value: "urgent",
        },
      ];

      viewOptions.value = [
        {
          label: this.$t("pages.settings.inputs.options.main_views.tasks"),
          value: "tasks",
        },
        {
          label: this.$t("pages.settings.inputs.options.main_views.calendar"),
          value: "calendar",
        },
        {
          label: this.$t("pages.settings.inputs.options.main_views.affairs"),
          value: "affairs",
        },
        {
          label: this.$t("pages.settings.inputs.options.main_views.stats"),
          value: "stats",
        },
      ];

      getLocale().then((locale) => {
        if (locale)
          settings.value.language = {
            label: this.$t("pages.settings.inputs.options.languages." + locale),
            value: locale,
          };
      });

      for (const key of Object.keys(settings.value)) {
        if (key === "language") continue;
        getConfig(key).then((data) => {
          if (data) {
            let key2 = key;
            if (key === "timeFormat") key2 = "time_formats";
            if (key === "defaultPriority") key2 = "priorities";
            if (key === "mainView") key2 = "main_views";
            if (key === "theme") key2 = "themes";
            settings.value[key] = {
              label: this.$t(
                "pages.settings.inputs.options." + key2 + "." + data
              ),
              value: data,
            };
          }
        });
      }
    };
    actualizeConfigs();

    watch(
      () => props._theme,
      (value) => {
        theme.value = value;
      }
    );

    return {
      theme,
      languages,
      themes,
      timeFormats,
      defaultPriorities,
      viewOptions,
      settings,
      actualizeConfigs,
    };
  },
  methods: {
    async changeLanguage() {
      this.$i18n.locale = this.settings.language.value;
      await setConfig("language", this.settings.language.value);
      this.actualizeConfigs();
    },
    saveConfigurations(config) {
      setConfig(config, this.settings[config].value).then(({ status }) => {
        if (status === 200) {
          console.log("Configurations saved successfully");
        } else {
          console.log("Error saving configurations");
        }
      });
    },
  },
};
</script>
