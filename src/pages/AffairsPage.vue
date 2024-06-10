<template>
  <q-page>
    <AffairComponent
      :showProp="show"
      @update:show="show = $event"
      v-if="show"
      :affairProp="affair"
      @update:newtimeline="newTimeline"
      @update:editaffair="showNewAffair = true"
      :_theme="theme"
    />
    <NewAffairTimelineComponent
      :show="showNewTimeline"
      @update:show="showNewTimeline = $event"
      v-if="showNewTimeline"
      :_theme="theme"
    />
    <NewAffairComponent
      :show="showNewAffair"
      @update:show="showNewAffair = $event"
      v-if="showNewAffair"
      :_theme="theme"
    />
    <div>
      <AffairsTableComponent
        @update:selectaffair="selectAffair"
        @update:newaffair="showNewAffair = true"
        :_theme="theme"
      />
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent, onBeforeUnmount } from "vue";

import AffairsTableComponent from "src/components/AffairsTableComponent.vue";
import AffairComponent from "src/components/AffairComponent.vue";
import NewAffairTimelineComponent from "src/components/NewAffairTimeline.vue";
import NewAffairComponent from "../components/NewAffairComponent.vue";
import storage from "src/functions/virtualStorage";
import { Loop } from "src/functions/utils";

export default defineComponent({
  components: {
    AffairsTableComponent,
    AffairComponent,
    NewAffairTimelineComponent,
    NewAffairComponent,
  },
  data() {
    const theme = ref(storage.get("theme"));
    const loop = new Loop(() => {
      theme.value = storage.get("theme");
    });
    loop.start();

    onBeforeUnmount(() => {
      loop.stop();
    });

    return {
      theme,
      show: ref(false),
      affair: ref({}),
      showNewTimeline: ref(false),
      showNewAffair: ref(false),
    };
  },
  methods: {
    selectAffair(affair) {
      this.affair = affair;
      this.show = true;
    },
    newTimeline() {
      this.showNewTimeline = true;
    },
  },
});
</script>
