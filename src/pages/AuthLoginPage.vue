<template>
  <q-page class="t-login-bg flex flex-center">
    <div class="column flex-center flex text-white" style="min-width: 300px">
      <div class="flex flex-center justify-center row q-mb-md">
        <q-img
          src="src/assets/bbel_full_logo.png"
          style="width: 260px; height: 200px"
          :ratio="16 / 9"
        />
      </div>
      <div class="text-h5 q-mb-md flex flex-center">
        {{ $t("pages.login.titles.login") }}
        {{ locally ? `(${$t("pages.login.titles.locally")})` : "" }}
      </div>
      <q-form class="t-login-form col-md-4">
        <q-banner
          rounded
          v-if="error"
          inline-actions
          class="text-white bg-red q-mb-sm"
          dense
        >
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ error }}
        </q-banner>
        <q-input
          outlined
          v-model="email_username"
          :label="$t('pages.login.inputs.labels.email_username')"
          type="email"
          class="full-width q-mb-md"
          dark
          color="white"
        />
        <q-input
          outlined
          v-model="password"
          :label="$t('pages.login.inputs.labels.password')"
          type="password"
          class="full-width q-mb-md"
          dark
          color="white"
        />
        <small>
          {{ $t("pages.login.messages.dont_have_account") }}
          <router-link to="/auth/register">{{
            $t("pages.login.titles.register")
          }}</router-link>
        </small>
        <q-btn
          style="background: #9c8449; color: white"
          :label="$t('pages.login.buttons.login')"
          class="full-width q-mb-md q-mt-sm"
          @click="login"
          :loading="loading"
          :percentage="0"
          color="accent"
        />

        <q-btn
          :label="
            locally
              ? $t('pages.login.buttons.login_online')
              : $t('pages.login.buttons.login_locally')
          "
          icon="account_circle"
          class="full-width"
          @click="locally = !locally"
        />
      </q-form>
    </div>
    <div class="absolute-bottom-right">
      <q-select
        :label="$t('pages.login.inputs.labels.language')"
        outlined
        dense
        v-model="lang"
        :options="langOptions"
        color="white"
        dark
        class="q-mb-sm q-mr-sm"
        style="min-width: 140px"
        @update:model-value="changeLang($event)"
      />
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent } from "vue";
import login from "src/functions/login";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { getConfig } from "src/functions/configs";

export default defineComponent({
  name: "AuthLoginPage",
  data() {
    this.$i18n.locale = localStorage.getItem("lang") ?? "en-US";
    const router = useRouter();
    if (Cookies.get("token")) router.push("/main/tasks");
    return {
      email_username: ref(""),
      password: ref(""),
      loading: ref(false),
      error: ref(""),
      locally: ref(false),
      lang: ref(localStorage.getItem("lang") ?? "en-US"),
      langOptions: ["en-US", "es-ES", "pt-BR"],
    };
  },
  methods: {
    login() {
      this.loading = true;
      if (!this.email_username) {
        this.error = "Email or Username is required";
        this.loading = false;
        return;
      }
      if (!this.password) {
        this.error = "Password is required";
        this.loading = false;
        return;
      }
      login(this.email_username, this.password)
        .then(({ status, res }) => {
          if (status === 404) {
            this.error = "User not found";
            this.loading = false;
            return;
          }
          if (!res) {
            this.error = "Invalid credentials";
            this.loading = false;
            return;
          }
          getConfig("mainView")
            .then((config) => {
              getConfig("language")
                .then((locale) => {
                  this.$i18n.locale = locale ?? "en-US";
                  if (config) {
                    this.$router.push("/main/" + config);
                  } else {
                    this.$router.push("/main/tasks");
                  }
                })
                .catch((err) => {
                  console.log("Error getting locale", err);
                  this.$router.push("/main/tasks");
                });
            })
            .catch((err) => {
              console.log("Error getting config", err);
              this.$router.push("/main/tasks");
            });
        })
        .catch((err) => {
          console.log("Login error", err);
          this.loading = false;
          this.error = err.message;
        });
    },
    changeLang(lang) {
      localStorage.setItem("lang", lang);
      this.$i18n.locale = lang;
    },
  },
});
</script>
