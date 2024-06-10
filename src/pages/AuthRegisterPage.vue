<template>
  <q-page
    class="t-login-bg"
    style="
      overflow-y: auto;
      max-height: 100vh;
      background: #1e1e1e;
      overflow-x: hidden;
    "
  >
    <div class="column text-white" style="min-width: 600px">
      <div
        class="flex flex-center justify-center row"
        style="width: 100vw; height: 180px; border-radius: 50%"
      >
        <q-img
          src="src/assets/bbel_full_logo.png"
          style="width: 260px; height: 200px"
          :ratio="16 / 9"
        />
      </div>
      <div class="text-h5 q-mb-md flex flex-center">
        {{ $t("pages.register.titles.register_to_continue") }}
      </div>
      <q-form
        @submit="register"
        style="width: 70%; margin-left: 15%"
        class="flex q-pl-xl q-pr-xl"
      >
        <q-input
          v-for="input in inputs"
          :key="input.model"
          v-model="user[input.model]"
          :label="input.label"
          :type="input.type"
          :error="!valids[input.error]"
          :error-message="input['error-message']"
          dark
          color="white"
          :icon="input.icon"
          :style="`display: inline-block; width: ${input.class}; ${
            input.margin ? 'margin-left: ' + input.margin : ''
          }`"
        />
        <q-select
          v-model="user.phone_type"
          :options="phoneOptions"
          :label="$t('pages.register.inputs.labels.phone_type')"
          dark
          style="width: 39%; margin-left: 1%"
          color="white"
        />
        <small style="width: 100%">
          {{ $t("pages.register.messages.already_an_account") }}
          <router-link to="/auth/login">{{
            $t("pages.register.titles.login")
          }}</router-link>
        </small>
        <q-btn
          color="accent"
          style="color: white; width: 40%; margin-left: 30%"
          :label="$t('pages.register.buttons.register')"
          class="q-mb-md q-mt-sm"
          @click="register"
          :loading="loading"
          :percentage="0"
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
import register from "src/functions/register";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { getConfig } from "src/functions/configs";

export default defineComponent({
  data() {
    this.$i18n.locale = localStorage.getItem("lang") || "en-US";
    const router = useRouter();
    if (Cookies.get("token")) router.push("/main/tasks");
    const errors = {
      invalidUsername: this.$t("pages.register.messages.invalid_username"),
      invalidEmail: this.$t("pages.register.messages.invalid_email"),
      invalidPassword: this.$t("pages.register.messages.invalid_password"),
      equalPasswords: this.$t("pages.register.messages.equal_passwords"),
      invalidDDD: this.$t("pages.register.messages.invalid_ddd"),
      invalidPhone: this.$t("pages.register.messages.invalid_phone"),
    };
    const inputs = [
      {
        label: this.$t("pages.register.inputs.labels.username"),
        type: "text",
        model: "username",
        icon: "person",
        error: "username",
        "error-message": errors.invalidUsername,
        class: "49%",
      },
      {
        label: this.$t("pages.register.inputs.labels.email"),
        type: "email",
        model: "email",
        icon: "email",
        error: "email",
        "error-message": errors.invalidEmail,
        class: "49%",
        margin: "2%",
      },
      {
        label: this.$t("pages.register.inputs.labels.password"),
        type: "password",
        model: "password",
        icon: "lock",
        error: "password",
        "error-message": errors.invalidPassword,
        class: "49%",
      },
      {
        label: this.$t("pages.register.inputs.labels.confirm_password"),
        type: "password",
        model: "confirm_password",
        icon: "lock",
        error: "confirm_password",
        "error-message": errors.equalPasswords,
        class: "49%",
        margin: "2%",
      },
      {
        label: this.$t("pages.register.inputs.labels.phone_ddd"),
        type: "text",
        model: "phone_ddd",
        icon: "phone",
        error: "phone_ddd",
        "error-message": errors.invalidDDD,
        class: "10%",
      },
      {
        label: this.$t("pages.register.inputs.labels.phone_number"),
        type: "text",
        model: "phone_number",
        icon: "phone",
        error: "phone_number",
        "error-message": errors.invalidPhone,
        class: "49%",
        margin: "1%",
      },
    ];
    const user = ref({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_ddd: "",
      phone_number: "",
      phone_type: {
        label: this.$t("pages.register.inputs.options.phone_types.cellphone"),
        value: "cellphone",
      },
    });
    return {
      valids: ref({
        username: true,
        email: true,
        password: true,
        confirm_password: true,
        phone_ddd: true,
        phone_number: true,
      }),
      user,
      inputs,
      error: ref(""),
      loading: ref(false),
      phoneOptions: [
        {
          label: this.$t("pages.register.inputs.options.phone_types.cellphone"),
          value: "cellphone",
        },
        {
          label: this.$t("pages.register.inputs.options.phone_types.home"),
          value: "home",
        },
        {
          label: this.$t("pages.register.inputs.options.phone_types.work"),
          value: "work",
        },
      ],
      lang: ref(localStorage.getItem("lang") || "en-US"),
      langOptions: ["en-US", "es-ES", "pt-BR"],
    };
  },
  methods: {
    register() {
      this.error = "";
      this.loading = true;
      const expressions = {
        username: /^[a-zA-Z0-9]{3,}$/,
        email: /.+@.+\..+/,
        password:
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/,
        phone_ddd: /^[0-9]{2}$/,
        phone_number: /^[0-9]{8,9}$/,
      };
      for (const key in expressions) {
        if (!expressions[key].test(this.user[key])) {
          this.valids[key] = false;
          this.loading = false;
          return;
        }
        this.valids[key] = true;
      }
      if (this.user.password !== this.user.confirm_password) {
        this.valids.confirm_password = false;
        this.loading = false;
        return;
      }
      register(
        this.user.username,
        this.user.email,
        this.user.password,
        this.user.phone_ddd,
        this.user.phone_number,
        this.user.phone_type.value
      )
        .then(({ status, res }) => {
          if (status === 409) {
            this.error = this.$t("pages.register.messages.user_already_exists");
            this.loading = false;
            return;
          }
          if (!res) {
            this.error = this.$t("pages.register.messages.invalid_data");
            this.loading = false;
            return;
          }
          console.log("Register success", res);
          this.loading = false;
          getConfig("language").then((lang) => {
            this.$i18n.locale = lang;
            this.$router.push("/main/tasks");
          });
        })
        .catch((err) => {
          console.log("Register error", err);
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
