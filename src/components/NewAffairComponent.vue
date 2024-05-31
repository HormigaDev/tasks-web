<template>
  <q-dialog persistent v-model="showForm" dark>
    <q-card style="min-width: 560px" dark>
      <q-card-section>
        <div class="text-h6">New Affair</div>
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
            v-model="newAffair.personName"
            label="Affair person name"
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
            label="Affair firs timeline description"
            type="textarea"
            :class="{
              'q-mt-md': true,
              't-input-disabled': newAffair.description === null,
            }"
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
          @click="cancelAffairCreation"
        />
        <q-btn flat label="Save" @click="createAffair" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from "vue";
import EventBus from "src/functions/EventBus";
import { newAffair, editAffair } from "src/functions/affairs";
import storage from "src/functions/virtualStorage";

export default {
  name: "NewAffairComponent",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props) {
    const showForm = ref(props.show);
    const newAffair = ref({
      id: null,
      title: "",
      personName: "",
      description: "",
    });
    const editing = ref(false);
    const affair = storage.get("editingAffair");

    if (affair) {
      editing.value = true;
      newAffair.value.title = affair.title;
      newAffair.value.personName = affair.personName;
      newAffair.value.description = null;
      newAffair.value.id = affair.id;
    }

    watch(
      () => props.show,
      (val) => {
        showForm.value = val;
      }
    );

    const resetForm = () => {
      newAffair.value = {
        id: null,
        title: "",
        personName: "",
        description: "",
      };
      editing.value = false;
      storage.remove("editingAffair");
    };

    return {
      showForm,
      newAffair,
      resetForm,
    };
  },
  methods: {
    createAffair() {
      if (this.editing) {
        editAffair({
          affair_id: this.newAffair.id,
          title: this.newAffair.title,
          personName: this.newAffair.personName,
        }).then(({ status }) => {
          if (status === 200) {
            this.$q.notify({
              message: "Affair updated",
              color: "green-5",
              position: "bottom-right",
            });
            EventBus.emit("affair-updated");
            this.resetForm();
            this.$emit("update:show", false);
          }
        });
        return;
      }
      newAffair(
        this.newAffair.title,
        this.newAffair.personName,
        this.newAffair.description
      )
        .then(({ status }) => {
          if (status === 201) {
            this.$q.notify({
              message: "Affair created",
              color: "green-5",
              position: "bottom-right",
            });
            EventBus.emit("affair-created");
            this.resetForm();
            this.$emit("update:show", false);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            message: "Error creating affair",
            color: "red-5",
            position: "bottom-right",
          });
        });
    },
    cancelAffairCreation() {
      this.resetForm();
      this.$emit("update:show", false);
    },
  },
};
</script>
