<template>
  <q-dialog persistent v-model="showForm" :dark="theme === 'dark'">
    <q-card style="min-width: 560px" :dark="theme === 'dark'">
      <q-card-section>
        <div class="text-h6">
          {{
            editing
              ? $t("pages.affairs.titles.edit_affair")
              : $t("pages.affairs.titles.new_affair")
          }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form>
          <q-input
            :dark="theme === 'dark'"
            dense
            outlined
            v-model="newAffair.title"
            :label="$t('pages.affairs.inputs.labels.affair_title')"
            type="text"
            class="q-mt-md"
            :color="theme === 'dark' ? 'white' : 'dark'"
            :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          />
          <q-input
            :dark="theme === 'dark'"
            dense
            outlined
            v-model="newAffair.personName"
            :label="$t('pages.affairs.inputs.labels.affair_person_name')"
            type="text"
            class="q-mt-md"
            :color="theme === 'dark' ? 'white' : 'dark'"
            :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          />
          <q-input
            :dark="theme === 'dark'"
            dense
            outlined
            v-model="newAffair.description"
            :label="
              $t(
                'pages.affairs.inputs.labels.affair_first_timeline_description'
              )
            "
            type="textarea"
            :class="{
              'q-mt-md': true,
              't-input-disabled': newAffair.description === null,
            }"
            :color="theme === 'dark' ? 'white' : 'dark'"
            :label-color="theme === 'dark' ? 'grey-7' : 'grey-9'"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          :color="theme === 'dark' ? 'grey-5' : 'grey-9'"
          :label="$t('pages.affairs.buttons.cancel')"
          @click="cancelAffairCreation"
        />
        <q-btn
          flat
          :label="
            editing
              ? $t('pages.affairs.buttons.update')
              : $t('pages.affairs.buttons.save')
          "
          @click="createAffair"
        />
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
    _theme: String,
  },
  emits: ["update:show"],
  data(props) {
    const theme = ref(props._theme);
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
    console.log(editing.value);

    watch(
      () => props.show,
      (val) => {
        showForm.value = val;
      }
    );
    watch(
      () => props._theme,
      (val) => {
        theme.value = val;
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
      theme,
      showForm,
      newAffair,
      resetForm,
      editing,
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
              message: this.$t("pages.affairs.messages.affair_updated"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
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
              message: this.$t("pages.affairs.messages.affair_created"),
              color: "green-5",
              position: "bottom-right",
              timeout: 2000,
            });
            EventBus.emit("affair-created");
            this.resetForm();
            this.$emit("update:show", false);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            message: this.$t("pages.affairs.messages.error_creating_affair"),
            color: "red-5",
            position: "bottom-right",
            timeout: 2000,
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
