<template>
  <q-page class="t-login-bg flex flex-center">
    <div class="column flex-center flex text-white" style="min-width: 300px">
      <div
        class="flex flex-center justify-center row q-mb-md"
        style="
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 2px solid #9c8449;
        "
      >
        <q-img src="src/assets/icon.ico" style="width: 120px; height: 120px" />
      </div>
      <div class="text-h5 q-mb-md flex flex-center">
        Login to continue {{ locally ? "(Locally)" : "" }}
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
          label="Email or Username"
          type="email"
          class="full-width q-mb-md"
          dark
          color="white"
        />
        <q-input
          outlined
          v-model="password"
          label="Password"
          type="password"
          class="full-width q-mb-md"
          dark
          color="white"
        />
        <small>
          don't have an account?
          <router-link to="/auth/register">Register</router-link>
        </small>
        <q-btn
          style="background: #9c8449; color: white"
          label="Login"
          class="full-width q-mb-md q-mt-sm"
          @click="login"
          :loading="loading"
          :percentage="0"
        />

        <q-btn
          :label="'Sign in ' + (locally ? 'online' : 'locally')"
          icon="account_circle"
          class="full-width"
          @click="locally = !locally"
        />
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent } from "vue";
import login from "src/functions/login";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AuthLoginPage",
  setup() {
    const router = useRouter();
    if (Cookies.get("token")) router.push("/main/tasks");
    return {
      email_username: ref(""),
      password: ref(""),
      loading: ref(false),
      error: ref(""),
      locally: ref(false),
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
          console.log("Login success", res);
          this.loading = false;
          this.$router.push("/main/tasks");
        })
        .catch((err) => {
          console.log("Login error", err);
          this.loading = false;
          this.error = err.message;
        });
    },
  },
});
</script>
