<template>
  <q-dialog persistent v-model="showCategories" dark>
    <q-card
      dark
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
        color="white"
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
          Categories
          <q-btn
            class="q-ml-md q-pl-xs q-pr-xs q-pt-none q-pb-none"
            size="sm"
            color="grey-8"
            icon="add"
            @click="newCategory = true"
          />
        </div>
      </q-card-section>
      <q-card-section style="overflow: auto; max-height: 60vh">
        <q-list>
          <q-item
            v-for="category in categories"
            :key="category.name"
            class="q-mb-sm category-item-hover"
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
      dark
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
        color="white"
        @click="
          () => {
            resetCategory();
            newCategory = false;
          }
        "
        style="z-index: 99"
      />
      <q-card-section class="flex">
        <div class="text-h6">New Category</div>
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
          dark
          :maxlength="input.limit"
          color="white"
          clearable
          class="q-mb-md"
          :error-message="input['error-message']"
          :error="!valids[input.rule]"
        />
        <q-btn
          label="Save"
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
  },
  emits: ["update:show"],
  setup(props) {
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
        label: "Name",
        prop: "name",
        type: "text",
        rule: "category_name",
        "error-message": "The name must be between 1 and 50 characters long.",
        limit: 50,
      },
      {
        label: "Color",
        prop: "color",
        type: "text",
        rule: "category_color",
        "error-message":
          "The color must be a 6-digit hexadecimal value without the # symbol.",
        limit: 6,
      },
      {
        label: "Icon",
        prop: "icon",
        type: "text",
        rule: "category_icon",
        "error-message":
          "The icon must be between 1 and 20 characters long and alphanumeric.",
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
                }
              });
              newCategory.value = false;
            } else {
              error.value = "There was an error saving the category.";
            }
          })
          .catch((err) => {
            error.value = err.message || "An error occurred.";
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
                }
              });
              newCategory.value = false;
            } else {
              console.log(status);
              error.value = "There was an error saving the category.";
            }
          })
          .catch((err) => {
            error.value = err.message || "An error occurred.";
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
              }
            });
          } else {
            error.value = "There was an error deleting the category.";
          }
        })
        .catch((err) => {
          error.value = err.message || "An error occurred.";
        });
    };
    const confirmDelete = (id) => {
      $q.dialog({
        title: "Delete Category",
        message: "Are you sure you want to delete this category?",
        dark: true,
        ok: {
          label: "Yes",
          color: "red",
        },
        cancel: {
          label: "No",
          color: "grey-8",
        },
      }).onOk(() => {
        deleteThisCategory(id);
      });
    };

    return {
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
    };
  },
  methods: {
    editCategory(category) {
      this.selectedId = category.id;
      this.category.name = category.name;
      this.category.color = category.color;
      this.category.icon = category.icon;
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
</style>
