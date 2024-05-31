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
        <q-img src="src/assets/icon.ico" style="width: 64px; height: 64px" />
      </div>
      <div class="text-h5 q-mb-md flex flex-center">Register to continue</div>
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
          label="Phone Type"
          dark
          class="q-mb-md"
          color="white"
          style="display: inline-block; width: 60%"
        />
        <small style="width: 100%">
          already have an account?
          <router-link to="/auth/login">Login</router-link>
        </small>
        <q-btn
          style="
            background: #9c8449;
            color: white;
            width: 40%;
            margin-left: 30%;
          "
          label="Register"
          class="q-mb-md q-mt-sm"
          @click="register"
          :loading="loading"
          :percentage="0"
        />
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent } from "vue";
import register from "src/functions/register";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    if (Cookies.get("token")) router.push("/main/tasks");
    const errors = {
      invalidUsername: "Invalid username",
      invalidEmail: "Invalid email",
      invalidPassword:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be between 8 and 64 characters long",
      equalPasswords: "Passwords do not match",
      invalidDDD: "Invalid DDD",
      invalidPhone: "Invalid phone number",
      invalidURL: "Invalid URL",
    };
    const inputs = [
      {
        label: "Username",
        type: "text",
        model: "username",
        icon: "person",
        error: "username",
        "error-message": errors.invalidUsername,
        class: "49%",
      },
      {
        label: "Email",
        type: "email",
        model: "email",
        icon: "email",
        error: "email",
        "error-message": errors.invalidEmail,
        class: "49%",
        margin: "2%",
      },
      {
        label: "Password",
        type: "password",
        model: "password",
        icon: "lock",
        error: "password",
        "error-message": errors.invalidPassword,
        class: "49%",
      },
      {
        label: "Confirm Password",
        type: "password",
        model: "confirm_password",
        icon: "lock",
        error: "confirm_password",
        "error-message": errors.equalPasswords,
        class: "49%",
        margin: "2%",
      },
      {
        label: "DDD",
        type: "text",
        model: "phone_ddd",
        icon: "phone",
        error: "phone_ddd",
        "error-message": errors.invalidDDD,
        class: "10%",
      },
      {
        label: "Phone",
        type: "text",
        model: "phone_number",
        icon: "phone",
        error: "phone_number",
        "error-message": errors.invalidPhone,
        class: "49%",
        margin: "1%",
      },
      {
        label: "Avatar URL",
        type: "text",
        model: "avatar_url",
        icon: "image",
        error: "avatar_url",
        "error-message": errors.invalidURL,
        class: "38%",
        margin: "2%",
      },
    ];
    const user = ref({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_ddd: "",
      phone_number: "",
      avatar_url: "",
      phone_type: {
        label: "Cellphone",
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
        avatar_url: true,
      }),
      user,
      inputs,
      error: ref(""),
      loading: ref(false),
      phoneOptions: [
        { label: "Cellphone", value: "cellphone" },
        { label: "Home", value: "home" },
        { label: "Work", value: "work" },
      ],
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
        avatar_url:
          /^(https?|ftp):\/\/[^\s/$.?#-][^\s]*\.(png|jpg|jpeg|avif|webp)$/i,
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
        this.user.phone_type.value,
        this.user.avatar_url
      )
        .then(({ status, res }) => {
          if (status === 409) {
            this.error = "User already exists";
            this.loading = false;
            return;
          }
          if (!res) {
            this.error = "Invalid data";
            this.loading = false;
            return;
          }
          console.log("Register success", res);
          this.loading = false;
          this.$router.push("/auth/login");
        })
        .catch((err) => {
          console.log("Register error", err);
          this.loading = false;
          this.error = err.message;
        });
    },
  },
});
</script>
