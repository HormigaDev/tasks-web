<template>
  <q-dialog persistent v-model="showForm" :dark="theme === 'dark'">
    <q-card style="min-width: 560px" :dark="theme === 'dark'">
      <q-card-section>
        <div class="text-h6">
          {{
            editing
              ? $t("pages.affairs.titles.edit_affair_timeline")
              : $t("pages.affairs.titles.new_affair_timeline")
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
            :label="$t('pages.affairs.inputs.labels.affair_timeline_title')"
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
              $t('pages.affairs.inputs.labels.affair_timeline_description')
            "
            type="textarea"
            class="q-mt-md"
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
          @click="
            () => {
              resetForm();
              $emit('update:show', false);
            }
          "
        />
        <q-btn
          flat
          :label="
            editing
              ? $t('pages.affairs.buttons.update')
              : $t('pages.affairs.buttons.save')
          "
          @click="saveTimeline"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import EventBus from "src/functions/EventBus";
import { ref, watch } from "vue";
import { newAffairTimeline, editTimeline } from "src/functions/affairs";
import storage from "src/functions/virtualStorage";

export default {
  name: "NewAffairTimelineComponent",
  props: {
    show: Boolean,
    _theme: String,
  },
  emits: ["update:show"],
  data(props) {
    const theme = ref(props._theme);
    const showForm = ref(props.show);
    const editing = ref(false);
    const newAffair = ref({
      title: "",
      description: "",
      id: "",
    });
    const timeline = storage.get("editingTimeline");
    if (timeline) {
      editing.value = true;
      newAffair.value.title = timeline.title;
      newAffair.value.description = timeline.description;
      newAffair.value.id = timeline.id;
    }
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

    return {
      theme,
      showForm,
      newAffair,
      editing,
    };
  },
  methods: {
    resetForm() {
      this.newAffair = {
        title: "",
        description: "",
      };
      storage.remove("editingTimeline");
    },
    saveTimeline() {
      if (this.editing) {
        editTimeline({
          affair_id: storage.get("current_affair"),
          title: this.newAffair.title,
          description: this.newAffair.description,
          timeline_id: this.newAffair.id,
        })
          .then(({ status }) => {
            if (status === 200) {
              this.$q.notify({
                color: "green-5",
                position: "bottom-right",
                message: "Timeline updated",
              });
              this.resetForm();
              EventBus.emit("timeline-updated");
              this.$emit("update:show", false);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$q.notify({
              color: "red-5",
              position: "bottom-right",
              message: "Error updating timeline",
            });
          });
        return;
      }
      newAffairTimeline(
        storage.get("current_affair"),
        this.newAffair.title,
        this.newAffair.description
      )
        .then(({ status }) => {
          if (status === 201) {
            this.resetForm();
            EventBus.emit("timeline-created");
            this.$emit("update:show", false);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            color: "red-5",
            position: "bottom-right",
            message: "Error creating timeline",
          });
        });
    },
    editTimeline() {},
  },
};
</script>
