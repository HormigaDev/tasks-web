<template>
  <q-page :class="{ 't-settings': true, 't-light': theme !== 'dark' }">
    <q-splitter
      v-model="splitterModel"
      :limits="[16, 16]"
      style="height: calc(100vh - 50px)"
    >
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          inline-label
          :dark="theme === 'dark'"
          :class="theme === 'dark' ? 'text-grey-6' : 'text-grey-10'"
        >
          <q-tab
            icon="account_circle"
            name="account"
            :label="$t('pages.settings.titles.account')"
          />
          <q-tab
            icon="tune"
            name="preferences"
            :label="$t('pages.settings.titles.preferences')"
          />
          <q-tab
            icon="notifications"
            name="notifications"
            :label="$t('pages.settings.titles.notifications')"
          />
          <q-tab
            class="t-disabled"
            icon="sync"
            name="syncronization"
            :label="$t('pages.settings.titles.syncronization')"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-down"
          transition-next="jump-up"
          dark
          style="height: 100%"
          :class="{ 't-tab-panels': true, 't-light': theme !== 'dark' }"
        >
          <AccountTab
            name="account"
            :_theme="theme"
            :_configurations="configurations"
          />
          <PreferencesTab
            name="preferences"
            :_theme="theme"
            :_configurations="configurations"
          />
          <NotificationsTab
            name="notifications"
            :_theme="theme"
            :_configurations="configurations"
          />
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>
<script>
import { ref, defineComponent, onBeforeUnmount } from "vue";
import storage from "src/functions/virtualStorage";
import { Loop } from "src/functions/utils";

import AccountTab from "src/components/Settings/AccountTab.vue";
import PreferencesTab from "src/components/Settings/PreferencesTab.vue";
import NotificationsTab from "src/components/Settings/NotificationsTab.vue";

export default defineComponent({
  components: {
    AccountTab,
    PreferencesTab,
    NotificationsTab,
  },
  setup() {
    const theme = ref(storage.get("theme"));
    const configurations = ref(storage.get("configurations"));
    const loop = new Loop(() => {
      theme.value = storage.get("theme");
      configurations.value = storage.get("configurations");
    });
    loop.start();
    onBeforeUnmount(() => {
      loop.stop();
    });

    return {
      configurations,
      theme,
      splitterModel: ref(16),
      tab: ref("account"),
    };
  },
});
</script>
