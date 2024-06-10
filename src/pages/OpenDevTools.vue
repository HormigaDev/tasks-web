<template>
  <q-page
    class="q-pa-lg q-pt-xl"
    :class="{ 'dev-tools-dark': dark, 'dev-tools-light': !dark }"
  >
    <!-- GitHub Copilot, aqui quiero que me ayudes a colocar un formulario que quepa en una ventana pequeñita con un Input que solicite la contraseña de administrador -->
    <q-form @submit="openDevTools" :dark="dark">
      <q-input
        :dark="dark"
        :color="dark ? 'white' : 'dark'"
        v-model="password"
        :label="$t('pages.open_dev_tools.inputs.labels.admin_password')"
        type="password"
        dense
        outlined
        class="q-mb-md"
        :error="error.length > 0"
        :error-message="error"
      />
      <q-btn
        :dark="dark"
        :color="dark ? 'grey-8' : 'dark'"
        type="submit"
        :label="$t('pages.open_dev_tools.inputs.labels.open_dev_tools')"
        class="full-width"
      />
    </q-form>
  </q-page>
</template>
<script>
import { ref, defineComponent, onBeforeUnmount } from "vue";
import { openDevTools } from "src/functions/openDevTools";
import storage from "src/functions/virtualStorage";
import { Loop } from "src/functions/utils";

export default defineComponent({
  name: "OpenDevTools",
  data() {
    const dark = ref(storage.get("theme") === "dark");
    const loop = new Loop(() => {
      dark.value = storage.get("theme") === "dark";
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    return {
      dark,
      password: ref(""),
      error: ref(""),
    };
  },
  methods: {
    openDevTools() {
      openDevTools(this.password).then(({ status }) => {
        if (status === 401) {
          this.error = this.$t(
            "pages.open_dev_tools.messages.invalid_password"
          );
        } else {
          this.password = "";
          this.error = "";
        }
      });
    },
  },
});
</script>
<style lang="scss">
.dev-tools-dark {
  background-color: #333 !important;
  color: #fafafa;
}
.dev-tools-light {
  background-color: #cacaca !important;
  color: #333;
}
</style>
