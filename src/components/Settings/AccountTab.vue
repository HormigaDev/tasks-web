<template>
  <q-tab-panel :name="name" class="flex column t-settings-tab">
    <div class="flex column flex-center">
      <div class="text-h6 q-mb-md">Security</div>
      <div class="flex row justify-between">
        <q-input
          v-model="prevPassword"
          label="Previous Password"
          type="password"
          dense
          outlined
          class="q-mr-md t-account-input"
          dark
          color="white"
          label-color="grey-7"
        />
        <q-input
          v-model="newPassword"
          label="New Password"
          type="password"
          dense
          outlined
          class="q-ml-md t-account-input"
          dark
          color="white"
          label-color="grey-7"
        />
      </div>
      <q-btn
        :label="changePasswordButtonLabel"
        :color="changePasswordButtonColor"
        class="q-mt-md text-grey-2"
        style="width: 180px"
        size="sm"
        :icon="changePasswordButtonColor === 'positive' ? 'done' : 'save'"
        dark-percentage
        :loading="changePasswordLoading"
        :percentage="changePasswordPercentage"
        @click="changePassword"
      />
    </div>
    <q-separator dark width="80%" class="q-mt-lg q-mb-lg" color="grey-9" />
    <div class="flex column flex-center">
      <div class="text-h6 q-mb-md">Privacity</div>
      <div class="flex row">
        <q-toggle
          label="Show my email"
          color="grey-9"
          dark
          v-model="settings.showMyEmail"
          class="q-mr-xl"
        />
        <q-toggle
          label="Show my image profile"
          color="grey-9"
          dark
          v-model="settings.showImageProfile"
          class="q-mr-xl"
        />
        <q-toggle
          label="Show my profile"
          color="grey-9"
          dark
          v-model="settings.showMyProfile"
          class="q-mr-xl"
        />
        <q-toggle
          label="Show my stats"
          color="grey-9"
          dark
          v-model="settings.showMyStats"
          class="q-mr-xl"
        />
      </div>
    </div>
  </q-tab-panel>
</template>
<script>
import { ref } from "vue";

export default {
  name: "AccountTab",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      prevPassword: ref(""),
      newPassword: ref(""),
      settings: ref({
        showMyEmail: true,
        showImageProfile: false,
        showMyProfile: true,
        showMyStats: true,
      }),
      changePasswordLoading: ref(false),
      changePasswordPercentage: ref(0),
      changePasswordButtonColor: ref("dark"),
      changePasswordButtonLabel: ref("Change Password"),
    };
  },
  methods: {
    async changePassword() {
      this.changePasswordLoading = true;
      this.changePasswordPercentage = 0;
      for (let i = 0; i < 100; i++) {
        this.changePasswordPercentage = i;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      setTimeout(() => {
        this.changePasswordLoading = false;
        this.changePasswordPercentage = 0;
        this.changePasswordButtonColor = "positive";
        this.changePasswordButtonLabel = "Password changed!";
        setTimeout(() => {
          this.changePasswordButtonColor = "dark";
          this.changePasswordButtonLabel = "Change Password";
        }, 3500);
      }, 500);
    },
  },
};
</script>
