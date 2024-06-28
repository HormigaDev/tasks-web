<template>
  <q-page
    :class="{
      't-login-bg flex flex-center q-pt-none': true,
      't-light': !dark,
    }"
  >
    <div
      :class="{
        'column flex-center flex': true,
        'text-white': dark,
        'text-dark': !dark,
      }"
      style="min-width: 300px"
    >
      <div>
        <q-img
          :src="logo"
          style="width: 195px; height: 150px"
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
          :dark="dark"
          :color="dark ? 'white' : 'dark'"
        />
        <q-input
          outlined
          v-model="password"
          :label="$t('pages.login.inputs.labels.password')"
          type="password"
          class="full-width q-mb-md"
          :dark="dark"
          :color="dark ? 'white' : 'dark'"
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
          :dark="dark"
          :color="dark ? 'grey-8' : 'dark'"
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
        :color="dark ? 'white' : 'dark'"
        :dark="dark"
        class="q-mb-sm q-mr-sm"
        style="min-width: 140px"
        @update:model-value="changeLang($event)"
      />
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent, onBeforeUnmount } from "vue";
import login from "src/functions/login";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { getConfig } from "src/functions/configs";
import logo from "src/assets/bbel_full_logo.png";
import { Loop } from "src/functions/utils";
import storage from "src/functions/virtualStorage";

export default defineComponent({
  name: "AuthLoginPage",
  data() {
    const dark = ref(storage.get("theme") === "dark");

    const loop = new Loop(() => {
      dark.value = storage.get("theme") === "dark";
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    this.$i18n.locale = localStorage.getItem("lang") ?? "en-US";
    const router = useRouter();
    if (Cookies.get("token")) router.push("/main/tasks");
    return {
      dark,
      email_username: ref(""),
      password: ref(""),
      loading: ref(false),
      error: ref(""),
      locally: ref(false),
      lang: ref(localStorage.getItem("lang") ?? "en-US"),
      langOptions: ["en-US", "es-ES", "pt-BR"],
      logo,
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
