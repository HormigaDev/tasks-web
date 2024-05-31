<template>
  <q-layout view="hHh lpR lFr" style="height: 100vh">
    <q-header
      dense
      class="t-bg-banner no-padding-header"
      style="z-index: 99999"
    >
      <q-toolbar style="position: relative" class="flex justify-between">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <div class="flex q-absolute-top-right" side>
          <div class="text-h6 q-mr-md">Welcome {{ user.name }}</div>
          <q-avatar size="md">
            <img src="src/assets/fyodor.jpg" />
            <q-menu dark>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <q-toggle
                    color="grey-8"
                    v-model="mobileData"
                    label="Use Mobile Data"
                  />
                  <q-toggle
                    color="grey-8"
                    v-model="bluetooth"
                    label="Bluetooth"
                  />
                </div>

                <q-separator dark vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="src/assets/fyodor.jpg" />
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ user.name }}
                  </div>

                  <q-btn
                    @click="logout"
                    color="white"
                    outline
                    label="Logout"
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
      dark
      :width="leftDrawerOpen ? 200 : 56"
      class="t-bg-drawer flex column justify-space-between"
    >
      <q-list>
        <q-item
          to="/main/tasks"
          active-class="t-item-selected"
          @click="showLoading"
        >
          <q-item-section>
            <div class="t-drawer-item text-white">
              <q-icon name="description" class="t-icon" />
              <span class="t-item-text" v-if="leftDrawerOpen && isTotalityOpen"
                >Tasks</span
              >
            </div>
          </q-item-section>
        </q-item>
        <q-item
          to="/main/calendar"
          active-class="t-item-selected"
          @click="showLoading"
        >
          <q-item-section>
            <div class="t-drawer-item text-white">
              <q-icon name="calendar_month" class="t-icon" />
              <span class="t-item-text" v-if="leftDrawerOpen && isTotalityOpen"
                >Calendar</span
              >
            </div>
          </q-item-section>
        </q-item>
        <q-item
          to="/main/affairs"
          active-class="t-item-selected"
          @click="showLoading"
        >
          <q-item-section>
            <div class="t-drawer-item">
              <q-icon name="speaker_notes" class="t-icon" />
              <span class="t-item-text" v-if="leftDrawerOpen && isTotalityOpen"
                >Affairs</span
              >
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list class="absolute-bottom flex column justify-center">
        <q-item
          to="/main/settings"
          active-class="t-item-selected"
          @click="showLoading"
        >
          <q-item-section>
            <div class="t-drawer-item">
              <q-icon name="settings" class="t-icon" />
              <span class="t-item-text" v-if="leftDrawerOpen && isTotalityOpen"
                >Settings</span
              >
            </div>
          </q-item-section>
        </q-item>
        <small style="width: 100%; text-align: center">v1.2.0</small>
      </q-list>
    </q-drawer>

    <q-page-container class="t-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import Cookies from "js-cookie";

export default {
  setup(props) {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    return {
      leftDrawerOpenY: ref(true),
      leftDrawerOpen,
      isTotalityOpen: ref(false),

      user: {
        name: "Jot4 Cê",
      },
      mobileData: ref(false),
      bluetooth: ref(false),
      showLoading(route) {
        if (!this.validade(route)) {
          props.loading.show({
            delay: 400,
          });
        }
      },
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
  },
};
</script>
