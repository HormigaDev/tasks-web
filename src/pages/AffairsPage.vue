<template>
  <q-page>
    <AffairComponent
      :showProp="show"
      @update:show="show = $event"
      v-if="show"
      :affairProp="affair"
      @update:newtimeline="newTimeline"
    />
    <NewAffairTimelineComponent
      :show="showNewTimeline"
      @update:show="showNewTimeline = $event"
      v-if="showNewTimeline"
    />
    <NewAffairComponent
      :show="showNewAffair"
      @update:show="showNewAffair = $event"
      v-if="showNewAffair"
    />
    <div class="q-pa-md">
      <AffairsTableComponent
        @update:selectaffair="selectAffair"
        @update:newaffair="showNewAffair = true"
      />
    </div>
  </q-page>
</template>
<script>
import { ref, defineComponent } from "vue";

import AffairsTableComponent from "src/components/AffairsTableComponent.vue";
import AffairComponent from "src/components/AffairComponent.vue";
import NewAffairTimelineComponent from "src/components/NewAffairTimeline.vue";
import NewAffairComponent from "../components/NewAffairComponent.vue";

export default defineComponent({
  components: {
    AffairsTableComponent,
    AffairComponent,
    NewAffairTimelineComponent,
    NewAffairComponent,
  },
  setup() {
    return {
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
