<template>
  <q-tab-panel :name="name" class="flex flex-center t-settings-tab">
    <div class="flex flex-center column">
      <div
        :class="{
          'text-h6 q-mb-md': true,
          'text-dark': !dark,
          'text-light': dark,
        }"
      >
        {{ $t("pages.settings.titles.notification") }}
      </div>
      <div class="flex row justify-center">
        <q-toggle
          :label="$t('pages.settings.inputs.labels.show_notifications')"
          color="grey-9"
          :dark="dark"
          v-model="settings.showNotifications"
          :class="{ 'q-mr-md': true, 'text-dark': !dark }"
          @update:model-value="
            saveConfig(
              'showNotifications',
              settings.showNotifications ? 'true' : 'false'
            )
          "
        />
        <q-toggle
          :label="$t('pages.settings.inputs.labels.select_my_files')"
          color="grey-9"
          :dark="dark"
          v-model="selectMyFile"
          :class="{
            't-setting-disabled': !settings.showNotifications,
            'q-mr-md  t-disabled': true,
            'text-dark': !dark,
          }"
          :disable="!settings.showNotifications"
        />
        <q-file
          :color="dark ? 'white' : 'dark'"
          outlined
          dense
          :dark="dark"
          v-model="notificationSound"
          :label="$t('pages.settings.inputs.labels.notification_sound')"
          v-if="selectMyFile"
          :class="{
            't-setting-disabled': !settings.showNotifications,
            't-settings-select': true,
          }"
          accept=".mp3,.wav,.ogg"
          :disable="!settings.showNotifications"
          :label-color="dark ? 'grey-7' : 'grey-9'"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
        <q-select
          outlined
          dense
          :dark="dark"
          :label="$t('pages.settings.inputs.labels.notification_sound')"
          :color="dark ? 'white' : 'dark'"
          v-model="selectNotificationSound"
          :options="soundsLibrary"
          :class="{
            't-setting-disabled': !settings.showNotifications,
            't-settings-select': true,
          }"
          :disable="!settings.showNotifications"
          v-if="!selectMyFile"
          :label-color="dark ? 'grey-7' : 'grey-9'"
          @update:model-value="
            saveConfig('notificationSound', selectNotificationSound.value)
          "
        />
        <q-btn
          :flat="dark"
          :icon="playingSound ? 'pause' : 'play_arrow'"
          :color="dark ? 'grey-2' : 'grey-8'"
          :dark="dark"
          rounded
          size="md"
          dense
          :class="{
            'q-ml-sm q-pl-sm q-pr-sm': true,
            't-setting-disabled': !settings.showNotifications,
          }"
          :disable="!settings.showNotifications"
          :loading="loadingPlaySound"
          :percentage="0"
          @click="
            playSound(
              sounds.find((s) => s.id === selectNotificationSound.value).file
            )
          "
        />
      </div>
    </div>
    <q-separator
      :dark="dark"
      width="80%"
      class="q-mt-lg q-mb-lg"
      :color="dark ? 'grey-9' : 'grey-10'"
    />
    <div class="flex flex-center column">
      <div :class="{ 'text-h6 q-mb-md': true, 'text-dark': !dark }">
        {{ $t("pages.settings.titles.priorities_for_notifications") }}
      </div>
      <div class="flex row justify-center">
        <q-checkbox
          v-for="p in priorityElements"
          :key="p.value"
          v-model="settings.priorities[p.value]"
          :label="p.label"
          color="grey-9"
          :dark="dark"
          :class="{
            'q-mr-xl q-ml-xl': true,
            't-setting-disabled': !settings.showNotifications,
            'text-dark': !dark,
          }"
          :disable="!settings.showNotifications"
          @update:model-value="
            saveConfig(
              'allowNotificationsFor-' + p.value,
              settings.priorities[p.value] ? 'true' : 'false'
            )
          "
        />
      </div>
      <q-separator
        :dark="dark"
        width="80%"
        class="q-mt-lg q-mb-lg"
        :color="dark ? 'grey-9' : 'grey-10'"
      />
      <div class="flex row jutify-center">
        <q-toggle
          :label="$t('pages.settings.inputs.labels.group_notifications')"
          v-model="settings.groupNotifications"
          :color="dark ? 'grey-9' : 'grey-10'"
          :dark="dark"
          :class="{
            'q-mr-md': true,
            't-setting-disabled': !settings.showNotifications,
            'text-dark': !dark,
            'text-light': dark,
          }"
          @update:model-value="
            saveConfig(
              'groupNotifications',
              settings.groupNotifications ? 'true' : 'false'
            )
          "
        />
      </div>
    </div>
    <q-separator
      :dark="dark"
      width="80%"
      class="q-mt-lg q-mb-lg"
      :color="dark ? 'grey-9' : 'grey-10'"
    />
    <div
      class="flex flex-center column"
      v-if="
        settings.priorities.urgent ||
        settings.priorities.high ||
        settings.priorities.normal ||
        settings.priorities.low
      "
    >
      <div :class="{ 'text-h6 q-mb-md': true, 'text-dark': !dark }">
        {{ $t("pages.settings.titles.notification_frequency") }}
      </div>
      <div v-for="p in priorityElements" :key="p.value" style="width: 100%">
        <div
          class="column q-mb-lg"
          v-if="settings.priorities[p.value] === true"
        >
          <q-separator
            :dark="dark"
            width="100%"
            class="q-mt-lg q-mb-lg"
            :color="dark ? 'grey-9' : 'grey-10'"
          />
          <div class="flex row t-settings-tab q-mb-md">
            <q-radio
              v-model="settings.notificationFrequency[p.value].type"
              :color="dark ? 'grey-9' : 'grey-10'"
              :dark="dark"
              :label="$t('pages.settings.inputs.labels.horary')"
              :class="{
                'q-mr-md': true,
                't-setting-disabled': !settings.showNotifications,
                'text-dark': !dark,
              }"
              val="horary"
              :disable="!settings.showNotifications"
            />
            <q-radio
              v-model="settings.notificationFrequency[p.value].type"
              :color="dark ? 'grey-9' : 'grey-10'"
              :dark="dark"
              :label="$t('pages.settings.inputs.labels.time')"
              :class="{
                'q-mr-md': true,
                't-setting-disabled': !settings.showNotifications,
                'text-dark': !dark,
              }"
              val="time"
              :disable="!settings.showNotifications"
            />
            <b
              :class="{
                'text-grey-7': dark,
                'q-ml-xl': true,
                'text-dark text-bold': !dark,
              }"
              >{{ $t("pages.settings.titles.priority") }} {{ p.label }}</b
            >
          </div>
          <div
            v-if="settings.notificationFrequency[p.value].type === 'horary'"
            class="column"
          >
            <div class="row">
              <q-input
                outlined
                :dark="dark"
                dense
                :color="dark ? 'white' : 'dark'"
                v-model="schedules[p.value].start"
                :rules="['time']"
                :class="{
                  't-setting-row-component': true,
                  't-setting-disabled': !settings.showNotifications,
                }"
                mask="time"
                :label="$t('pages.settings.inputs.labels.start')"
                :disable="!settings.showNotifications"
                :label-color="dark ? 'grey-7' : 'grey-9'"
                @update:model-value="saveHorary(p.value)"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="schedules[p.value].start"
                        :dark="dark"
                        color="grey-7"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('pages.settings.buttons.close')"
                            :color="dark ? 'white' : 'dark'"
                            flat
                            @click="saveHorary(p.value)"
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                outlined
                dense
                v-model="schedules[p.value].end"
                mask="time"
                :rules="['time']"
                :dark="dark"
                :color="dark ? 'white' : 'dark'"
                :class="{
                  't-setting-row-component': true,
                  't-setting-disabled': !settings.showNotifications,
                }"
                :label="$t('pages.settings.inputs.labels.end')"
                :disable="!settings.showNotifications"
                :label-color="dark ? 'grey-7' : 'grey-9'"
                @update:model-value="saveHorary(p.value)"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        :dark="dark"
                        color="grey-7"
                        v-model="schedules[p.value].end"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :label="$t('pages.settings.buttons.close')"
                            :color="dark ? 'white' : 'dark'"
                            flat
                            @click="saveHorary(p.value)"
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-select
              v-model="selectedDays[p.value]"
              :options="dayNames"
              :dark="dark"
              :color="dark ? 'white' : 'dark'"
              :label="$t('pages.settings.inputs.labels.select_days')"
              :class="{
                't-setting-row-component full-width': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              outlined
              dense
              multiple
              @update:model-value="saveHorary(p.value)"
            />
          </div>
          <div
            v-if="settings.notificationFrequency[p.value].type === 'time'"
            class="row"
          >
            <q-input
              outlined
              :dark="dark"
              :color="dark ? 'white' : 'dark'"
              type="number"
              v-model="schedules[p.value].days"
              :label="$t('pages.settings.inputs.labels.days')"
              dense
              min="0"
              max="31"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              :disable="!settings.showNotifications"
              @update:model-value="saveHorary(p.value)"
            />
            <q-input
              outlined
              :dark="dark"
              :color="dark ? 'white' : 'dark'"
              type="number"
              v-model="schedules[p.value].hours"
              :label="$t('pages.settings.inputs.labels.hours')"
              dense
              min="0"
              max="23"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              :disable="!settings.showNotifications"
              @update:model-value="saveHorary(p.value)"
            />
            <q-input
              outlined
              :dark="dark"
              :color="dark ? 'white' : 'dark'"
              type="number"
              v-model="schedules[p.value].minutes"
              :label="$t('pages.settings.inputs.labels.minutes')"
              dense
              min="5"
              max="59"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              :disable="!settings.showNotifications"
              @update:model-value="saveHorary(p.value)"
            />
          </div>
        </div>
      </div>
    </div>
  </q-tab-panel>
</template>

<script>
import { ref, watch } from "vue";
import {
  setConfig,
  getConfig,
  updateSchedule,
  getSchedule,
} from "src/functions/configs";
import { Sound } from "src/functions/utils";

import alarmsLibrary from "src/data/settingsPage/alarmsLibrary.json";
import sounds from "src/data/sounds.json";

export default {
  name: "NotificationsTab",
  props: {
    name: {
      type: String,
      required: true,
    },
    _theme: String,
    _configurations: Object,
  },
  data(props) {
    const playingSound = ref(false);
    const dark = ref(props._theme === "dark");
    const configurations = ref(props._configurations);
    const selectNotificationSound = ref(
      configurations.value.notificationSound
        ? {
            label: sounds.find(
              (s) => s.id === configurations.value.notificationSound
            ).name,
            value: configurations.value.notificationSound,
          }
        : {
            label: this.$t("pages.settings.inputs.labels.select_sound"),
            value: 0,
          }
    );
    watch(
      () => props._theme,
      (value) => {
        dark.value = value === "dark";
      }
    );
    watch(
      () => props._configurations,
      (value) => {
        configurations.value = value;
      }
    );
    const selectedDays = ref({
      urgent: [],
      high: [],
      normal: [],
      low: [],
    });
    const schedules = ref({
      urgent: {
        start: "",
        end: "",
        _days: [],
        minutes: 5,
        hours: 0,
        days: 0,
      },
      high: {
        start: "",
        end: "",
        _days: [],
        minutes: 5,
        hours: 0,
        days: 0,
      },
      normal: {
        start: "",
        end: "",
        _days: [],
        minutes: 5,
        hours: 0,
        days: 0,
      },
      low: {
        start: "",
        end: "",
        _days: [],
        minutes: 5,
        hours: 0,
        days: 0,
      },
    });
    for (const priority of Object.keys(schedules.value)) {
      getSchedule(priority)
        .then(({ data, status }) => {
          if (status === 200) {
            const timeS = data.schedule.time_start.split(" ")[1].split(":");
            const timeE = data.schedule.time_end.split(" ")[1].split(":");
            const days = [
              "mon",
              "tues",
              "wednes",
              "thurs",
              "fri",
              "satur",
              "sun",
            ];
            schedules.value[priority]._days = [];
            for (const day of days) {
              if (data.schedule[day] === 1) {
                schedules.value[priority]._days.push(day);
              }
            }
            selectedDays.value[priority] = schedules.value[priority]._days.map(
              (d) => {
                return {
                  label: this.$t(`pages.settings.inputs.options.days.${d}`),
                  value: d,
                };
              }
            );
            schedules.value[priority] = {
              start: `${timeS[0]}:${timeS[1]}`,
              end: `${timeE[0]}:${timeE[1]}`,
              minutes: data.schedule.minutes ?? 5,
              hours: data.schedule.hours,
              days: data.schedule.days,
            };
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return {
      schedules,
      dayNames: [
        {
          label: this.$t("pages.settings.inputs.options.days.mon"),
          value: "mon",
        },
        {
          label: this.$t("pages.settings.inputs.options.days.tues"),
          value: "tues",
        },
        {
          label: this.$t("pages.settings.inputs.options.days.wednes"),
          value: "wednes",
        },
        {
          label: this.$t("pages.settings.inputs.options.days.thurs"),
          value: "thurs",
        },
        {
          label: this.$t("pages.settings.inputs.options.days.fri"),
          value: "fri",
        },
        {
          label: this.$t("pages.settings.inputs.options.days.satur"),
          value: "satur",
        },
        {
          label: this.$t("pages.settings.inputs.options.days.sun"),
          value: "sun",
        },
      ],
      selectedDays,
      sounds,
      sound: new Sound(
        "src/assets/notifications/" +
          sounds.find((s) => s.id === configurations.value.notificationSound)
            ?.file,
        () => {
          playingSound.value = false;
        }
      ),
      configurations,
      dark,
      selectMyFile: ref(false),
      notificationSound: ref(null),
      selectNotificationSound,
      soundsLibrary: alarmsLibrary,
      playingSound,
      loadingPlaySound: ref(false),
      priorityElements: [
        { label: this.$t("pages.settings.titles.urgent"), value: "urgent" },
        { label: this.$t("pages.settings.titles.high"), value: "high" },
        { label: this.$t("pages.settings.titles.normal"), value: "normal" },
        { label: this.$t("pages.settings.titles.low"), value: "low" },
      ],
      settings: ref({
        groupNotifications: configurations.value.groupNotifications
          ? true
          : false,
        showNotifications: configurations.value.showNotifications
          ? true
          : false,
        priorities: {
          urgent: configurations.value["allowNotificationsFor-urgent"]
            ? true
            : false,
          high: configurations.value["allowNotificationsFor-high"]
            ? true
            : false,
          normal: configurations.value["allowNotificationsFor-normal"]
            ? true
            : false,
          low: configurations.value["allowNotificationsFor-low"] ? true : false,
        },
        notificationFrequency: {
          urgent: {
            use: true,
            type: "horary",
            horary: {
              start: ref(schedules.value.urgent.start),
              end: schedules.value.urgent.end,
              days: schedules.value.urgent._days.map((d) => {
                return {
                  label: this.$t(`pages.settings.inputs.options.days.${d}`),
                  value: d,
                };
              }),
            },
            time: {
              minutes: schedules.value.urgent.minutes,
              hours: schedules.value.urgent.hours,
              days: schedules.value.urgent.days,
            },
          },
          high: {
            use: true,
            type: "horary",
            horary: {
              start: schedules.value.high.start,
              end: schedules.value.high.end,
              days: [],
            },
            time: {
              minutes: schedules.value.high.minutes,
              hours: schedules.value.high.hours,
              days: schedules.value.high.days,
            },
          },
          normal: {
            use: false,
            type: "horary",
            horary: {
              start: schedules.value.normal.start,
              end: schedules.value.normal.end,
              days: [],
            },
            time: {
              minutes: schedules.value.normal.minutes,
              hours: schedules.value.normal.hours,
              days: schedules.value.normal.days,
            },
          },
          low: {
            use: false,
            type: "horary",
            horary: {
              start: schedules.value.low.start,
              end: schedules.value.low.end,
              days: [],
            },
            time: {
              minutes: schedules.value.low.minutes,
              hours: schedules.value.low.hours,
              days: schedules.value.low.days,
            },
          },
        },
      }),
    };
  },
  methods: {
    playSound(file) {
      this.loadingPlaySound = true;
      if (this.playingSound) {
        this.sound.stop();
        this.playingSound = false;
        this.loadingPlaySound = false;
        return;
      } else {
        if (this.sound.isPlaying()) this.sound.stop();
        this.sound.update("src/assets/notifications/" + file);
        this.sound.play();
        this.playingSound = true;
        this.loadingPlaySound = false;
      }
    },
    saveConfig(config, value) {
      setConfig(config, value)
        .then(({ status }) => {
          if (status === 200) {
            console.log("Config saved");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    testDate(element) {
      console.log(element);
    },
    saveHorary(priority) {
      let selectedDays = {};
      const horary = this.schedules[priority];
      selectedDays[priority] = this.selectedDays[priority].map((d) => d.value);
      if (this.selectedDays[priority].length === 0) {
        selectedDays[priority] = [
          "mon",
          "tues",
          "wednes",
          "thurs",
          "fri",
          "satur",
          "sun",
        ];
      }
      const weights = {
        urgent: 4,
        high: 3,
        normal: 2,
        low: 1,
      };
      updateSchedule(
        weights[priority],
        horary.start === "" ? "00:00" : horary.start,
        horary.end === "" ? "00:00" : horary.end,
        selectedDays[priority],
        this.schedules[priority].minutes ?? 5,
        this.schedules[priority].hours ?? 0,
        this.schedules[priority].days ?? 0
      )
        .then(({ status }) => {
          if (status === 200) {
            console.log("Schedule updated");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
