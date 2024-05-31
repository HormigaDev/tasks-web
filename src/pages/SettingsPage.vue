<template>
  <q-page class="t-settings">
    <q-splitter
      v-model="splitterModel"
      :limits="[16, 16]"
      style="height: calc(100vh - 50px)"
    >
      <template v-slot:before>
        <q-tabs v-model="tab" vertical inline-label dark class="text-grey-6">
          <q-tab icon="account_circle" name="account" label="Account" />
          <q-tab icon="tune" name="preferences" label="Preferences" />
          <q-tab
            icon="notifications"
            name="notifications"
            label="Notifications"
          />
          <q-tab icon="sync" name="syncronization" label="Syncronization" />
          <div class="flex row justify-center absolute-bottom">
            <q-btn
              label="Save changes"
              color="dark"
              class="q-mb-md text-grey-2"
              style="width: 140px"
              size="sm"
              icon="save"
            />
          </div>
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
          class="t-tab-panels"
        >
          <AccountTab name="account" />
          <PreferencesTab name="preferences" />
          <NotificationsTab name="notifications" />
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>
<script>
import { ref, defineComponent } from "vue";

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
    return {
      splitterModel: ref(16),
      tab: ref("account"),
    };
  },
});
</script>
