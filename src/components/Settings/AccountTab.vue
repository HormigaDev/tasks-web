<template>
  <q-tab-panel
    :name="name"
    :class="{
      flex: true,
      column: true,
      't-settings-tab': true,
      't-light': theme !== 'dark',
    }"
  >
    <div class="flex column flex-center">
      <div class="text-h6 q-mb-md">
        {{ $t("pages.settings.titles.security") }}
      </div>
      <div class="flex row justify-between">
        <q-input
          v-model="prevPassword"
          :label="$t('pages.settings.inputs.labels.previous_password')"
          type="password"
          dense
          outlined
          class="q-mr-md t-account-input"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
        />
        <q-input
          v-model="newPassword"
          :label="$t('pages.settings.inputs.labels.new_password')"
          type="password"
          dense
          outlined
          class="q-ml-md t-account-input"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
        />
      </div>
      <q-banner
        class="q-mt-sm q-mb-sm bg-red-5 text-white"
        rounded
        dense
        v-if="error"
      >
        {{ error }}</q-banner
      >
      <q-btn
        :label="changePasswordButtonLabel"
        :color="changePasswordButtonColor"
        class="q-mt-md text-grey-2"
        style="width: 180px"
        size="sm"
        :icon="changePasswordButtonColor === 'positive' ? 'done' : 'save'"
        :dark-percentage="theme === 'dark'"
        :loading="changePasswordLoading"
        :percentage="changePasswordPercentage"
        @click="
          () => {
            (changePasswordButtonColor === 'dark' && theme === 'dark') ||
            (changePasswordButtonColor === 'grey-7' && theme !== 'dark')
              ? changePassword()
              : (() => {})();
          }
        "
      />
    </div>
    <q-separator
      :dark="theme === 'dark'"
      width="80%"
      class="q-mt-lg q-mb-lg"
      color="grey-9"
    />
    <div class="flex column flex-center">
      <div class="flex row justify-between">
        <q-input
          v-model="settings.username"
          :label="$t('pages.settings.inputs.labels.username')"
          dense
          outlined
          class="q-mr-md t-account-input"
          :dark="theme === 'dark'"
          :color="theme === 'dark' ? 'white' : 'dark'"
          :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          :error="usernameError.length > 0"
          :error-message="usernameError"
          :maxlength="50"
          @update:model-value="changeUsername"
        />
      </div>
    </div>
  </q-tab-panel>
</template>
<script>
import { ref, watch } from "vue";
import {
  changePassword,
  getUsername,
  updateUsername,
} from "src/functions/auth";

export default {
  name: "AccountTab",
  props: {
    name: {
      type: String,
      required: true,
    },
    _theme: String,
  },
  data(props) {
    const theme = ref(props._theme);
    const settings = ref({
      username: "",
    });
    getUsername().then(({ data, status }) => {
      if (status === 200) {
        settings.value.username = data.username;
      }
    });

    watch(
      () => props._theme,
      (value) => {
        theme.value = value;
      }
    );
    return {
      theme,
      prevPassword: ref(""),
      newPassword: ref(""),
      settings,
      changePasswordLoading: ref(false),
      changePasswordPercentage: ref(0),
      changePasswordButtonColor: ref(
        theme.value === "dark" ? "dark" : "grey-7"
      ),
      changePasswordButtonLabel: ref(
        this.$t("pages.settings.buttons.change_password")
      ),
      error: ref(""),
      usernameError: ref(""),
    };
  },
  methods: {
    async changePassword() {
      if (this.prevPassword === "" || this.newPassword === "") {
        this.changePasswordButtonColor = "red-5";
        this.error = this.$t("pages.settings.messages.fill_all_fields");
        this.changePasswordButtonLabel = this.$t(
          "pages.settings.buttons.error"
        );
        setTimeout(() => {
          this.changePasswordButtonColor =
            this.theme === "dark" ? "dark" : "grey-7";
          this.error = "";
          this.changePasswordButtonLabel = this.$t(
            "pages.settings.buttons.change_password"
          );
        }, 3500);
        return;
      }
      if (this.prevPassword === this.newPassword) {
        this.changePasswordButtonColor = "red-5";
        this.error = this.$t(
          "pages.settings.messages.must_be_different_password"
        );
        this.changePasswordButtonLabel = this.$t(
          "pages.settings.buttons.error"
        );
        setTimeout(() => {
          this.changePasswordButtonColor =
            this.theme === "dark" ? "dark" : "grey-7";
          this.error = "";
          this.changePasswordButtonLabel = this.$t(
            "pages.settings.buttons.change_password"
          );
        }, 3500);
        return;
      }
      const reg =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;
      if (!reg.test(this.newPassword)) {
        this.changePasswordButtonColor = "red-5";
        this.error = this.$t("pages.settings.messages.invalid_password");
        this.changePasswordButtonLabel = this.$t(
          "pages.settings.buttons.error"
        );
        setTimeout(() => {
          this.changePasswordButtonColor =
            this.theme === "dark" ? "dark" : "grey-7";
          this.error = "";
          this.changePasswordButtonLabel = this.$t(
            "pages.settings.buttons.change_password"
          );
        }, 7000);
        return;
      }
      this.changePasswordLoading = true;
      this.changePasswordPercentage = 0;
      for (let i = 0; i < 100; i++) {
        this.changePasswordPercentage = i;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      changePassword(this.prevPassword, this.newPassword).then(({ status }) => {
        this.changePasswordLoading = false;
        this.changePasswordPercentage = 0;
        if (status === 200) {
          this.changePasswordButtonColor = "green-5";
          this.changePasswordButtonLabel = this.$t(
            "pages.settings.buttons.password_changed"
          );
          this.prevPassword = "";
          this.newPassword = "";
          setTimeout(() => {
            this.changePasswordButtonColor =
              this.theme === "dark" ? "dark" : "grey-7";
            this.changePasswordButtonLabel = this.$t(
              "pages.settings.buttons.change_password"
            );
          }, 3500);
        } else if (status === 401) {
          this.changePasswordButtonColor = "red-5";
          this.error = this.$t("pages.settings.messages.wrong_password");
          this.changePasswordButtonLabel = this.$t(
            "pages.settings.buttons.error"
          );
          setTimeout(() => {
            this.changePasswordButtonColor =
              this.theme === "dark" ? "dark" : "grey-7";
            this.error = "";
            this.changePasswordButtonLabel = this.$t(
              "pages.settings.buttons.change_password"
            );
          }, 3500);
        } else {
          this.changePasswordButtonColor = "red-5";
          this.error = this.$t(
            "pages.settings.messages.error_changing_password"
          );
          this.changePasswordButtonLabel = this.$t(
            "pages.settings.buttons.error"
          );
          setTimeout(() => {
            this.changePasswordButtonColor =
              this.theme === "dark" ? "dark" : "grey-7";
            this.error = "";
            this.changePasswordButtonLabel = this.$t(
              "pages.settings.buttons.change_password"
            );
          }, 3500);
        }
      });
    },
    changeUsername() {
      if (this.settings.username === "") {
        this.usernameError = this.$t("pages.settings.messages.fill_all_fields");
        return;
      }
      const reg = /^[a-zA-Z0-9_-]{4,}$/;
      if (!reg.test(this.settings.username)) {
        this.usernameError = this.$t(
          "pages.settings.messages.invalid_username"
        );
        return;
      }
      this.usernameError = "";
      updateUsername(this.settings.username).then(({ status }) => {
        if (status === 200) {
          return console.log("Username updated");
        }
        if (status === 409) {
          return (this.usernameError = this.$t(
            "pages.settings.messages.username_already_taken"
          ));
        }
        if (status === 422) {
          return;
        }
      });
    },
  },
};
</script>
