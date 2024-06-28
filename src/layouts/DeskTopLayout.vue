<template>
  <div>
    <q-layout view="hHh lpR lFr" style="height: 100vh">
      <q-header
        dense
        :class="{
          't-bg-banner': true,
          't-light': theme !== 'dark',
          'no-padding-header': true,
        }"
        style="z-index: 99999"
      >
        <div
          style="height: 24px"
          :class="{
            'flex justify-between': true,
            't-app-bar-light': theme !== 'dark',
            't-app-bar-dark': theme === 'dark',
          }"
        >
          <div class="flex flex-center">
            <q-img
              :src="logo"
              style="height: 20px; width: 20px; margin-top: 2px"
              class="q-ml-xs"
            />
            <div style="margin-top: 2px; margin-left: 14px">BBEL Tasks</div>
          </div>
          <div class="t-app-dragregion"></div>
          <div>
            <q-btn
              :dark="theme === 'dark'"
              dense
              square
              flat
              size="sm"
              icon="minimize"
              @click="minimizeApp"
            />
            <q-btn
              :dark="theme === 'dark'"
              dense
              square
              flat
              size="sm"
              icon="check_box_outline_blank"
              @click="maximizeApp"
            />
            <q-btn
              :dark="theme === 'dark'"
              dense
              square
              flat
              size="sm"
              icon="close"
              color="red"
              @click="closeApp"
            />
          </div>
        </div>
        <q-toolbar style="position: relative" class="flex justify-between">
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
            :color="theme === 'dark' ? 'white' : 'dark'"
          />
          <div class="flex q-absolute-top-right" side>
            <div
              :class="{
                'text-h6 row': true,
                'text-dark': theme !== 'dark',
                'q-mr-md': true,
              }"
            >
              {{ $t("layouts.main.titles.welcome") }}
              <div
                :class="{
                  'text-bold q-ml-md': true,
                  'text-grey-6': theme === 'dark',
                }"
              >
                {{ user.username }}
              </div>
              !
            </div>
            <div style="position: relative">
              <q-badge
                color="red-7"
                v-if="notifications.length"
                size="xs"
                class="q-mr-md absolute-top-right text-white"
                style="z-index: 999"
              >
                {{ notifications.length }}
              </q-badge>
              <q-icon
                name="notifications"
                :color="theme === 'dark' ? 'white' : 'dark'"
                class="q-mr-md q-ml-md cursor-pointer"
                size="md"
              >
                <q-menu fit :dark="theme === 'dark'" side="right">
                  <div class="column no-wrap q-pa-sm">
                    <q-item v-if="notifications.length">
                      <q-item-section>
                        <div class="text-h6">
                          {{ $t("layouts.main.titles.notifications") }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item v-else>
                      <q-item-section>
                        <div
                          :class="{
                            'text-subtitle2': true,
                            'text-grey-7': theme === 'dark',
                            'text-grey-6': theme !== 'dark',
                          }"
                        >
                          {{ $t("layouts.main.titles.noNotifications") }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-banner
                      rounded
                      inline-actions
                      v-for="notification in notifications"
                      :key="notification.id"
                      :class="{
                        'q-mt-md': true,
                        'bg-grey-9':
                          theme === 'dark' &&
                          notification.priority !== 'urgent',
                        'bg-grey-4':
                          theme !== 'dark' &&
                          notification.priority !== 'urgent',
                        'bg-red-6': notification.priority === 'urgent',
                      }"
                    >
                      <q-item-section>
                        <div
                          :class="{
                            'text-subtitle2': true,
                            'text-grey-2': theme === 'dark',
                            'text-grey-9': theme !== 'dark',
                          }"
                        >
                          {{ notification.title }}
                          <q-icon
                            size="xs"
                            name="error"
                            color="red-1"
                            class="q-ml-sm"
                            v-if="notification.priority === 'urgent'"
                          />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <div
                          :class="{
                            'text-subtitle4': true,
                            'text-grey-5':
                              theme === 'dark' &&
                              notification.priority !== 'urgent',
                            'text-grey-7':
                              theme !== 'dark' &&
                              notification.priority !== 'urgent',
                            'text-red-2': notification.priority === 'urgent',
                          }"
                        >
                          {{ notification.description }}
                        </div>
                      </q-item-section>
                      <template v-slot:action>
                        <q-btn
                          flat
                          :dark="theme === 'dark'"
                          :color="theme === 'dark' ? 'grey-2' : 'grey-9'"
                          icon="close"
                          rounded
                          class="q-pa-xs"
                          size="sm"
                          @click="dismissNotification(notification)"
                        />
                      </template>
                    </q-banner>
                  </div>
                </q-menu>
              </q-icon>
            </div>
            <q-avatar size="md">
              <img
                :src="user.avatarURL"
                :class="{
                  't-image-invert': theme === 'dark' && !isValidImage,
                }"
              />
              <q-menu :dark="theme === 'dark'">
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">
                      {{ $t("layouts.main.titles.settings") }}
                    </div>
                  </div>
                  <q-separator
                    :dark="theme === 'dark'"
                    vertical
                    inset
                    class="q-mx-lg"
                  />

                  <div class="column items-center">
                    <q-avatar size="72px">
                      <img
                        :src="user.avatarURL"
                        :class="{
                          't-image-invert': theme === 'dark' && !isValidImage,
                        }"
                      />
                      <q-icon
                        name="camera_alt"
                        class="absolute-bottom-right cursor-pointer"
                        size="md"
                        :color="theme === 'dark' ? 'grey-7' : 'grey-5'"
                        @click="pickAvatar"
                      />
                    </q-avatar>

                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                      {{ user.username }}
                    </div>

                    <q-btn
                      @click="logout"
                      :dark="theme === 'dark'"
                      :color="theme === 'dark' ? 'white' : 'dark'"
                      outline
                      :label="$t('layouts.main.titles.logout')"
                      push
                      size="sm"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-menu>
            </q-avatar>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer
        show-if-above
        v-model="leftDrawerOpenY"
        side="left"
        bordered
        :dark="theme === 'dark'"
        :width="leftDrawerOpen ? 200 : 56"
        :class="{
          't-bg-drawer': true,
          'flex column justify-space-between': true,
          't-light': theme !== 'dark',
        }"
      >
        <q-list>
          <q-item
            to="/main/tasks"
            :active-class="
              theme === 'dark' ? 't-item-selected' : 't-light-item-selected'
            "
            @click="showLoading"
          >
            <q-item-section>
              <div
                :class="{
                  't-drawer-item': true,
                  'text-white': theme === 'dark',
                  'text-dark': theme !== 'dark',
                  't-light': theme !== 'dark',
                }"
              >
                <q-icon name="description" class="t-icon" />
                <span
                  class="t-item-text"
                  v-if="leftDrawerOpen && isTotalityOpen"
                  >{{ $t("layouts.main.titles.tasks") }}</span
                >
              </div>
            </q-item-section>
          </q-item>
          <q-item
            to="/main/calendar"
            :active-class="
              theme === 'dark' ? 't-item-selected' : 't-light-item-selected'
            "
            @click="showLoading"
          >
            <q-item-section>
              <div
                :class="{
                  't-drawer-item': true,
                  'text-white': theme === 'dark',
                  'text-dark': theme !== 'dark',
                  't-light': theme !== 'dark',
                }"
              >
                <q-icon name="calendar_month" class="t-icon" />
                <span
                  class="t-item-text"
                  v-if="leftDrawerOpen && isTotalityOpen"
                  >{{ $t("layouts.main.titles.calendar") }}</span
                >
              </div>
            </q-item-section>
          </q-item>
          <q-item
            to="/main/affairs"
            :active-class="
              theme === 'dark' ? 't-item-selected' : 't-light-item-selected'
            "
            @click="showLoading"
          >
            <q-item-section>
              <div
                :class="{
                  't-drawer-item': true,
                  'text-white': theme === 'dark',
                  'text-dark': theme !== 'dark',
                  't-light': theme !== 'dark',
                }"
              >
                <q-icon name="receipt_long" class="t-icon" />
                <span
                  class="t-item-text"
                  v-if="leftDrawerOpen && isTotalityOpen"
                  >{{ $t("layouts.main.titles.affairs") }}</span
                >
              </div>
            </q-item-section>
          </q-item>
          <q-item
            to="/main/stats"
            :active-class="
              theme === 'dark' ? 't-item-selected' : 't-light-item-selected'
            "
            @click="showLoading"
          >
            <q-item-section>
              <div
                :class="{
                  't-drawer-item': true,
                  'text-white': theme === 'dark',
                  'text-dark': theme !== 'dark',
                  't-light': theme !== 'dark',
                }"
              >
                <q-icon name="leaderboard" class="t-icon" />
                <span
                  class="t-item-text"
                  v-if="leftDrawerOpen && isTotalityOpen"
                  >{{ $t("layouts.main.titles.stats") }}</span
                >
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list class="absolute-bottom flex column justify-center">
          <q-item
            to="/main/settings"
            :active-class="
              theme === 'dark' ? 't-item-selected' : 't-light-item-selected'
            "
            @click="showLoading"
          >
            <q-item-section>
              <div
                :class="{
                  't-drawer-item': true,
                  'text-white': theme === 'dark',
                  'text-dark': theme !== 'dark',
                  't-light': theme !== 'dark',
                }"
              >
                <q-icon name="settings" class="t-icon" />
                <span
                  class="t-item-text"
                  v-if="leftDrawerOpen && isTotalityOpen"
                  >{{ $t("layouts.main.titles.settings") }}</span
                >
              </div>
            </q-item-section>
          </q-item>
          <small
            style="width: 100%; text-align: center"
            :class="{ 'text-dark': theme !== 'dark' }"
            >{{ APP_VERSION }}</small
          >
        </q-list>
      </q-drawer>

      <q-page-container
        :class="{ 't-page-container': true, 't-light': theme !== 'dark' }"
      >
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from "vue";
import Cookies from "js-cookie";
import storage from "src/functions/virtualStorage";
import {
  getUserInfo,
  getUsername,
  getNotifications,
  ignoreNotification,
} from "src/functions/auth";
import {
  isAllowedImage,
  updateAvatar,
  Loop,
  Sound,
  closeApp,
  minimizeApp,
  maximizeApp,
} from "src/functions/utils";
import sounds from "src/data/sounds.js";
import { getConfig } from "src/functions/configs";
import avatar from "src/assets/avatar.png";
import logo_dark from "src/assets/logo_dark.png";
import logo_light from "src/assets/logo_light.png";

export default {
  data() {
    const theme = ref(storage.get("theme"));
    const logo = ref(theme.value === "dark" ? logo_light : logo_dark);
    const user = ref({});
    const notifications = ref([]);
    const isValidImage = ref(false);
    const sound = ref(null);
    let sendedGrouped = false;

    getUserInfo().then(({ data, status }) => {
      if (status === 200) {
        isAllowedImage(data.user.avatarURL).then((res) => {
          if (res) {
            user.value = data.user;
            isValidImage.value = true;
          } else {
            user.value = {
              ...data.user,
              avatarURL: avatar,
            };
            isValidImage.value = false;
          }
        });
      }
    });

    const loop = new Loop(() => {
      getConfig("notificationSound").then((config) => {
        if (config) {
          sound.value = new Sound(
            sounds.find((s) => s.id === config)?.file,
            () => {}
          );
        }
      });
      theme.value = storage.get("theme");
      logo.value = theme.value === "dark" ? logo_light : logo_dark;
      getUsername().then(({ data, status }) => {
        if (status === 200) {
          user.value.username = data.username;
        }
      });
      getNotifications().then(({ data, status }) => {
        if (status === 200) {
          if (data.grouped) {
            notifications.value = [];
          } else {
            notifications.value = notifications.value.filter((n) => !n.grouped);
            sendedGrouped = false;
          }
          let included = false;
          for (const notification of data.notifications) {
            if (!notifications.value.find((n) => n.id === notification.id)) {
              if (!data.grouped) {
                notifications.value.push({
                  id: notification.id,
                  title:
                    notification.title.length > 20
                      ? `${notification.title.slice(0, 20)}...`
                      : notification.title,
                  priority: notification.name,
                  description:
                    notification.description.length > 50
                      ? `${notification.description.slice(0, 50)}...`
                      : notification.description,
                  grouped: false,
                });
                included = true;
              } else {
                notifications.value.push({
                  id: notification.id,
                  title: `${notification.quantity} ${this.$t(
                    `layouts.main.titles.${notification.name}s`
                  )}`,
                  priority: notification.name,
                  description: this.$t(
                    `layouts.main.messages.notifications_${notification.name}`
                  ),
                  grouped: true,
                });
                included = true;
              }
            }
          }
          if (included && !data.grouped) {
            const btn = document.createElement("button");
            btn.onclick = () => {
              sound.value.play();
            };
            btn.click();
          }
          if (
            data.grouped &&
            !sendedGrouped &&
            notifications.value.length > 0
          ) {
            const btn = document.createElement("button");
            btn.onclick = () => {
              sound.value.play();
            };
            btn.click();
            sendedGrouped = true;
          }
        }
      });
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    const leftDrawerOpen = ref(false);
    return {
      avatar,
      logo,
      isValidImage,
      theme,
      notifications,
      leftDrawerOpenY: ref(true),
      leftDrawerOpen,
      isTotalityOpen: ref(false),
      user,
      mobileData: ref(false),
      bluetooth: ref(false),
      APP_VERSION: "v1.3.0",
      showLoading(route) {},
    };
  },
  methods: {
    validade(route) {
      return route === this.$route.path;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
      setTimeout(() => {
        this.isTotalityOpen = this.leftDrawerOpen;
      }, 200);
    },
    logout() {
      Cookies.remove("token");
      this.$router.push("/auth/login");
    },
    dismissNotification(notification) {
      ignoreNotification(notification.id, notification.priority).then(
        ({ status }) => {
          if (status === 200) {
            this.notifications = this.notifications.filter(
              (n) => n.id !== notification.id
            );
          }
        }
      );
    },
    isAllowedImage,
    pickAvatar() {
      const avatarInput = document.createElement("input");
      avatarInput.type = "file";
      // png, jpg, jpeg
      avatarInput.accept = "image/png, image/jpg, image/jpeg";
      avatarInput.onchange = async () => {
        const file = avatarInput.files[0];
        if (file) {
          updateAvatar(file).then(async ({ data, status }) => {
            if (status === 200) {
              this.user.avatarURL = data.avatar;
              this.isValidImage = await isAllowedImage(data.avatar);
            }
          });
        }
      };
      avatarInput.click();
    },
    closeApp,
    minimizeApp,
    maximizeApp,
  },
};
</script>
