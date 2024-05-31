<template>
  <q-tab-panel :name="name" class="flex flex-center t-settings-tab">
    <div class="flex flex-center column">
      <div class="text-h6 q-mb-md">Notification</div>
      <div class="flex row justify-center">
        <q-toggle
          label="show notifications"
          color="grey-9"
          dark
          v-model="settings.showNotifications"
          class="q-mr-md"
        />
        <q-toggle
          label="Select my file"
          color="grey-9"
          dark
          v-model="selectMyFile"
          :class="{
            't-setting-disabled': !settings.showNotifications,
            'q-mr-md': true,
          }"
          :disable="!settings.showNotifications"
        />
        <q-file
          color="white"
          outlined
          dense
          dark
          v-model="notificationSound"
          label="Notification sound"
          v-if="selectMyFile"
          :class="{
            't-setting-disabled': !settings.showNotifications,
            't-settings-select': true,
          }"
          accept=".mp3,.wav,.ogg"
          :disable="!settings.showNotifications"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
        <q-select
          outlined
          dense
          dark
          color="white"
          v-model="selectNotificationSound"
          :options="soundsLibrary"
          :class="{
            't-setting-disabled': !settings.showNotifications,
            't-settings-select': true,
          }"
          :disable="!settings.showNotifications"
          v-if="!selectMyFile"
        />
        <q-btn
          flat
          :icon="playingSound ? 'pause' : 'play_arrow'"
          color="grey-2"
          dark
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
          @click="playSound"
        />
      </div>
    </div>
    <q-separator dark width="80%" class="q-mt-lg q-mb-lg" color="grey-9" />
    <div class="flex flex-center column">
      <div class="text-h6 q-mb-md">Priorities for notifications</div>
      <div class="flex row justify-center">
        <q-checkbox
          v-for="p in priorityElements"
          :key="p.value"
          v-model="settings.priorities[p.value]"
          :label="p.label"
          color="grey-9"
          dark
          :class="{
            'q-mr-xl q-ml-xl': true,
            't-setting-disabled': !settings.showNotifications,
          }"
          :disable="!settings.showNotifications"
        />
      </div>
    </div>
    <q-separator dark width="80%" class="q-mt-lg q-mb-lg" color="grey-9" />
    <div
      class="flex flex-center column"
      v-if="
        settings.priorities.urgent ||
        settings.priorities.high ||
        settings.priorities.normal ||
        settings.priorities.low
      "
    >
      <div class="text-h6 q-mb-md">Notification frequency</div>
      <div v-for="p in priorityElements" :key="p.value" style="width: 100%">
        <div
          class="column q-mb-lg"
          v-if="settings.priorities[p.value] === true"
        >
          <q-separator
            dark
            width="100%"
            class="q-mt-lg q-mb-lg"
            color="grey-9"
          />
          <div class="flex row t-settings-tab q-mb-md">
            <q-radio
              v-model="settings.notificationFrequency[p.value].type"
              color="grey-9"
              dark
              label="Horary"
              :class="{
                'q-mr-md': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              val="horary"
              :disable="!settings.showNotifications"
            />
            <q-radio
              v-model="settings.notificationFrequency[p.value].type"
              color="grey-9"
              dark
              label="Time"
              :class="{
                'q-mr-md': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              val="time"
              :disable="!settings.showNotifications"
            />
            <b class="text-grey-7 q-ml-xl">Priority {{ p.label }}</b>
          </div>
          <div
            v-if="settings.notificationFrequency[p.value].type === 'horary'"
            class="row"
            style="height: 40px"
          >
            <q-input
              outlined
              dark
              dense
              color="white"
              v-model="settings.notificationFrequency[p.value].horary.start"
              mask="time"
              :rules="['time']"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              label="Start"
              :disable="!settings.showNotifications"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="
                        settings.notificationFrequency[p.value].horary.start
                      "
                      dark
                      color="grey-7"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="white" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              outlined
              dense
              v-model="settings.notificationFrequency[p.value].horary.end"
              mask="time"
              :rules="['time']"
              dark
              color="white"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              label="End"
              :disable="!settings.showNotifications"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      dark
                      color="grey-7"
                      v-model="
                        settings.notificationFrequency[p.value].horary.end
                      "
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="white" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn
              outline
              dense
              color="grey-4"
              dark
              label="Select Days"
              style="height: 40px"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              size="sm"
              icon="calendar_month"
              :disable="!settings.showNotifications"
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  dark
                  color="grey-7"
                  multiple
                  v-model="settings.notificationFrequency[p.value].horary.days"
                  :rules="['']"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="white" flat />
                  </div>
                </q-date> </q-popup-proxy
            ></q-btn>
          </div>
          <div
            v-if="settings.notificationFrequency[p.value].type === 'time'"
            class="row"
          >
            <q-input
              outlined
              dark
              color="white"
              type="number"
              v-model="settings.notificationFrequency[p.value].time.days"
              label="Days"
              dense
              min="0"
              max="6"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              :disable="!settings.showNotifications"
            />
            <q-input
              outlined
              dark
              color="white"
              type="number"
              v-model="settings.notificationFrequency[p.value].time.hours"
              label="Hours"
              dense
              min="0"
              max="23"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              :disable="!settings.showNotifications"
            />
            <q-input
              outlined
              dark
              color="white"
              type="number"
              v-model="settings.notificationFrequency[p.value].time.minutes"
              label="Minutes"
              dense
              min="5"
              max="59"
              :class="{
                't-setting-row-component': true,
                't-setting-disabled': !settings.showNotifications,
              }"
              :disable="!settings.showNotifications"
            />
          </div>
        </div>
      </div>
    </div>
  </q-tab-panel>
</template>

<script>
import { ref } from "vue";

import alarmsLibrary from "src/data/settingsPage/alarmsLibrary.json";

export default {
  name: "NotificationsTab",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      selectMyFile: ref(false),
      notificationSound: ref(null),
      selectNotificationSound: ref({ label: "Default", value: "default" }),
      soundsLibrary: alarmsLibrary,
      playingSound: ref(false),
      loadingPlaySound: ref(false),
      priorityElements: [
        { label: "Urgent", value: "urgent" },
        { label: "High", value: "high" },
        { label: "Normal", value: "normal" },
        { label: "Low", value: "low" },
      ],
      settings: ref({
        showNotifications: true,
        priorities: {
          urgent: true,
          high: true,
          normal: false,
          low: false,
        },
        notificationFrequency: {
          urgent: {
            use: true,
            type: "horary",
            horary: {
              start: "",
              end: "",
              days: [],
            },
            time: {
              minutes: 5,
              hours: 0,
              days: 0,
            },
          },
          high: {
            use: true,
            type: "time",
            horary: {
              start: "",
              end: "",
              days: [],
            },
            time: {
              minutes: 5,
              hours: 0,
              days: 0,
            },
          },
          normal: {
            use: false,
            type: "time",
            horary: {
              start: "",
              end: "",
              days: [],
            },
            time: {
              minutes: 5,
              hours: 0,
              days: 0,
            },
          },
          low: {
            use: false,
            type: "time",
            horary: {
              start: "",
              end: "",
              days: [],
            },
            time: {
              minutes: 5,
              hours: 0,
              days: 0,
            },
          },
        },
      }),
    };
  },
  methods: {
    playSound() {
      this.loadingPlaySound = true;
      setTimeout(() => {
        this.loadingPlaySound = false;
      }, 1500);
      this.playingSound = !this.playingSound;
      setTimeout(() => {
        this.playingSound = false;
      }, 5000);
    },
  },
};
</script>
