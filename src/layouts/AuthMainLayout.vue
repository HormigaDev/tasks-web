<template>
  <q-layout>
    <div
      style="height: 24px"
      :class="{
        'flex justify-between': true,
        't-app-bar-light': theme !== 'dark',
        't-app-bar-dark': theme === 'dark',
      }"
    >
      <div class="row justify-center">
        <q-img
          :src="logo"
          style="height: 20px; width: 20px; margin-top: 2px"
          class="q-ml-xs"
        />
        <div
          :class="{
            'text-dark': theme !== 'dark',
            'text-light': theme === 'dark',
          }"
          style="margin-top: 2px; margin-left: 14px"
        >
          BBEL Tasks
        </div>
      </div>
      <div class="t-app-dragregion"></div>
      <div>
        <q-btn
          :dark="theme === 'dark'"
          dense
          square
          flat
          size="sm"
          icon="minimize"
          @click="minimizeApp"
        />
        <q-btn
          :dark="theme === 'dark'"
          dense
          square
          flat
          size="sm"
          icon="check_box_outline_blank"
          @click="maximizeApp"
        />
        <q-btn
          :dark="theme === 'dark'"
          dense
          square
          flat
          size="sm"
          icon="close"
          color="red"
          @click="closeApp"
        />
      </div>
    </div>
    <q-page-container
      style="height: calc(100vh - 24px); overflow-y: auto; overflow-x: hidden"
      :class="{ 'bg-grey-2': theme !== 'dark' }"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, defineComponent, onBeforeUnmount } from "vue";
import { closeApp, maximizeApp, minimizeApp, Loop } from "src/functions/utils";
import storage from "src/functions/virtualStorage";
import logo from "src/assets/bbel_logo.png";

export default defineComponent({
  name: "AuthMainLayout",
  data() {
    const theme = ref(storage.get("theme") ?? "dark");
    const loop = new Loop(() => {
      theme.value = storage.get("theme") ?? "dark";
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    return { theme, logo };
  },
  methods: {
    closeApp,
    maximizeApp,
    minimizeApp,
  },
});
</script>
