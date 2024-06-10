<template>
  <q-dialog persistent v-model="showCategories" :dark="theme === 'dark'">
    <q-card
      :dark="theme === 'dark'"
      style="min-width: 80%; position: relative; height: 100%; max-height: 80vh"
      class="q-mt-xl"
      v-if="!newCategory"
    >
      <q-btn
        flat
        rounded
        dense
        icon="close"
        class="absolute-top-right q-mr-xs q-mt-xs"
        :color="theme === 'dark' ? 'white' : 'dark'"
        @click="
          () => {
            $emit('update:show', false);
            showCategories = false;
          }
        "
        style="z-index: 99"
      />
      <q-card-section class="flex">
        <div class="text-h6">
          {{ $t("pages.tasks.titles.categories") }}
          <q-btn
            class="q-ml-md q-pl-xs q-pr-xs q-pt-none q-pb-none"
            size="sm"
            color="grey-8"
            icon="add"
            @click="
              () => {
                newCategory = true;
                editing = false;
              }
            "
          />
        </div>
      </q-card-section>
      <q-card-section style="overflow: auto; max-height: 60vh">
        <q-list>
          <q-item
            v-for="category in categories"
            :key="category.name"
            :class="{
              'q-mb-sm': true,
              'category-item-hover': true,
              't-light': theme === 'light',
            }"
          >
            <q-item-section>
              <div class="row">
                <q-icon
                  :name="category.icon.toLowerCase() || 'folder'"
                  :style="'color: #' + category.color"
                  size="sm"
                />
                <q-item-label
                  class="q-ml-md text-h6"
                  :style="'color: #' + category.color"
                  >{{ category.name }}</q-item-label
                >
              </div>
            </q-item-section>
            <q-item-section side>
              <div>
                <q-btn flat dense icon="edit" @click="editCategory(category)" />
                <q-btn
                  flat
                  dense
                  color="red-5"
                  icon="delete"
                  @click="confirmDelete(category.id)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-card
      :dark="theme === 'dark'"
      style="min-width: 80%; position: relative; height: 100%; max-height: 80vh"
      class="q-mt-xl"
      v-else
    >
      <q-btn
        flat
        rounded
        dense
        icon="close"
        class="absolute-top-right q-mr-xs q-mt-xs"
        :color="theme === 'dark' ? 'white' : 'dark'"
        @click="
          () => {
            resetCategory();
            newCategory = false;
          }
        "
        style="z-index: 99"
      />
      <q-card-section class="flex">
        <div class="text-h6">
          {{
            !editing
              ? $t("pages.tasks.titles.new_category")
              : $t("pages.tasks.titles.edit_category")
          }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-banner
          inline-actions
          class="q-mb-md text-white bg-red-5"
          icon="info"
          dense
          rounded
          v-if="error"
        >
          {{ error }}
        </q-banner>
        <q-input
          v-for="input in inputs"
          :key="input.prop"
          v-model="category[input.prop]"
          :label="input.label"
          dense
          :dark="theme === 'dark'"
          :maxlength="input.limit"
          :color="theme === 'dark' ? 'white' : 'dark'"
          clearable
          class="q-mb-md"
          :error-message="input['error-message']"
          :error="!valids[input.rule]"
        />
        <q-btn
          :label="
            editing
              ? $t('pages.tasks.buttons.update')
              : $t('pages.tasks.buttons.save')
          "
          color="grey-8"
          @click="saveCategory(selectedId)"
          class="q-mt-md"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import {
  getCategories,
  newCategory as saveNewCategory,
  editCategory,
  deleteCategory,
} from "src/functions/categories";

const rules = {
  category_name: /^[a-zA-Z0-9 ]{1,50}$/,
  category_color: /^[0-9A-Fa-f]{6}$/,
  category_icon: /^[a-zA-Z0-9_]{1,20}$/,
};

export default {
  name: "CategoriesComponent",
  props: {
    show: Boolean,
    _theme: String,
  },
  emits: ["update:show"],
  data(props) {
    const theme = ref(props._theme);
    const editing = ref(false);
    const $q = useQuasar();
    const categories = ref([]);
    const showCategories = ref(props.show);
    const newCategory = ref(false);
    const error = ref("");
    const category = ref({
      name: "",
      color: "",
      icon: "",
    });
    const valids = ref({
      category_name: true,
      category_color: true,
      category_icon: true,
    });

    const inputs = [
      {
        label: this.$t("pages.tasks.inputs.labels.category_name"),
        prop: "name",
        type: "text",
        rule: "category_name",
        "error-message": this.$t("pages.tasks.messages.invalid_category_name"),
        limit: 50,
      },
      {
        label: this.$t("pages.tasks.inputs.labels.category_color"),
        prop: "color",
        type: "text",
        rule: "category_color",
        "error-message": this.$t("pages.tasks.messages.invalid_category_color"),
        limit: 6,
      },
      {
        label: this.$t("pages.tasks.inputs.labels.category_icon"),
        prop: "icon",
        type: "text",
        rule: "category_icon",
        "error-message": this.$t("pages.tasks.messages.invalid_category_icon"),
        limit: 20,
      },
    ];

    onMounted(() => {
      getCategories().then(({ data, status }) => {
        if (status === 200) {
          categories.value = data.categories;
        }
      });
    });

    watch(
      () => props.show,
      (val) => {
        showCategories.value = val;
      }
    );

    watch(
      () => props._theme,
      (val) => {
        theme.value = val;
      }
    );

    const saveCategory = (id) => {
      for (const key in category.value) {
        const rule = rules["category_" + key];
        if (rule && !rule.test(category.value[key])) {
          valids.value["category_" + key] = false;
          return;
        } else {
          valids.value["category_" + key] = true;
        }
      }
      error.value = "";
      if (!id) {
        saveNewCategory(
          category.value.name,
          category.value.color,
          category.value.icon
        )
          .then(({ status }) => {
            if (status === 201) {
              getCategories().then(({ data, status }) => {
                if (status === 200) {
                  categories.value = data.categories;
                  this.resetCategory();
                  this.$q.notify({
                    message: this.$t("pages.tasks.messages.category_saved"),
                    color: "green-5",
                    position: "bottom-right",
                    timeout: 2000,
                  });
                }
              });
              newCategory.value = false;
            } else {
              error.value = this.$t(
                "pages.tasks.messages.error_saving_category"
              );
            }
          })
          .catch((err) => {
            error.value = err.message || this.$t("pages.tasks.messages.error");
          });
      } else {
        editCategory(
          id,
          category.value.name,
          category.value.color,
          category.value.icon
        )
          .then(({ status }) => {
            if (status === 200) {
              getCategories().then(({ data, status }) => {
                if (status === 200) {
                  categories.value = data.categories;
                  this.resetCategory();
                  this.$q.notify({
                    message: this.$t("pages.tasks.messages.category_updated"),
                    color: "green-5",
                    position: "bottom-right",
                    timeout: 2000,
                  });
                }
              });
              newCategory.value = false;
            } else {
              console.log(status);
              error.value = this.$t(
                "pages.tasks.messages.error_saving_category"
              );
            }
          })
          .catch((err) => {
            error.value = err.message || this.$t("pages.tasks.messages.error");
          });
      }
      this.selectedId = null;
    };

    const deleteThisCategory = (id) => {
      deleteCategory(id)
        .then(({ status }) => {
          if (status === 200) {
            getCategories().then(({ data, status }) => {
              if (status === 200) {
                categories.value = data.categories;
                this.$q.notify({
                  message: this.$t("pages.tasks.messages.category_deleted"),
                  color: "green-5",
                  position: "bottom-right",
                  timeout: 2000,
                });
              }
            });
          } else {
            error.value = this.$t(
              "pages.tasks.messages.error_deleting_category"
            );
          }
        })
        .catch((err) => {
          error.value = err.message || this.$t("pages.tasks.messages.error");
        });
    };
    const confirmDelete = (id) => {
      $q.dialog({
        title: this.$t("pages.tasks.titles.confirm_delete_category"),
        message: this.$t("pages.tasks.messages.confirm_category_delete"),
        dark: true,
        ok: {
          label: this.$t("pages.tasks.buttons.yes"),
          color: "red-5",
        },
        cancel: {
          label: this.$t("pages.tasks.buttons.no"),
          color: "grey-8",
        },
      }).onOk(() => {
        deleteThisCategory(id);
      });
    };

    return {
      theme,
      selectedId: ref(0),
      categories,
      showCategories,
      inputs,
      valids,
      category,
      newCategory,
      error,
      saveCategory,
      saveType: ref("new"),
      deleteThisCategory,
      confirmDelete,
      editing,
    };
  },
  methods: {
    editCategory(category) {
      this.selectedId = category.id;
      this.category.name = category.name;
      this.category.color = category.color;
      this.category.icon = category.icon;
      this.editing = true;
      this.newCategory = true;
    },
    resetCategory() {
      this.category.name = "";
      this.category.color = "";
      this.category.icon = "";
    },
  },
};
</script>
<style lang="scss">
.category-item-hover {
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
}
.category-item-hover.t-light {
  &:hover {
    background-color: #ececec;
  }
}
</style>
