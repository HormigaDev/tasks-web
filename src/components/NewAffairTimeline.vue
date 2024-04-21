<template>
  <q-dialog persistent v-model="showForm" dark>
    <q-card style="min-width: 560px" dark>
      <q-card-section>
        <div class="text-h6">New Affair Timeline</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form>
          <q-input
            dark
            dense
            outlined
            v-model="newAffair.title"
            label="Affair title"
            type="text"
            class="q-mt-md"
            color="white"
            label-color="grey-7"
          />
          <q-input
            dark
            dense
            outlined
            v-model="newAffair.description"
            label="Affair description"
            type="textarea"
            class="q-mt-md"
            color="white"
            label-color="grey-7"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          color="grey-5"
          label="Cancel"
          @click="() => $emit('update:show', false)"
        />
        <q-btn
          flat
          label="Save"
          @click="
            () => {
              resetForm();
              $emit('update:show', false);
            }
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { ref, watch } from "vue";

export default {
  name: "NewAffairTimelineComponent",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props) {
    const showForm = ref(props.show);
    watch(
      () => props.show,
      (val) => {
        showForm.value = val;
      }
    );

    return {
      showForm,
      newAffair: ref({
        title: "",
        description: "",
      }),
    };
  },
  methods: {
    resetForm() {
      this.newAffair = {
        title: "",
        description: "",
      };
    },
  },
};
</script>
