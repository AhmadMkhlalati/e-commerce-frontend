<template>
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click"
    ></v-btn>

    <datatable
      theadId="category-dt"
      ref="category_dt"
      pageURL="api/dashboard/category/all"
      headersURL="api/dashboard/headers/categories"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    ></datatable>
  </v-container>
  <RightForm
    :class="formVisibility ? 'right-form-visible' : 'right-form-not-visible'"
    class="category-form"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ form_title }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="English Name"
              v-model="params.name.en"
              :error-messages="errors['name.en']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Arabic Name"
              v-model="params.name.ar"
              :error-messages="errors['name.ar']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Slug"
              v-model="params.slug"
              :error-messages="errors.slug"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
              label="Select Parent Category"
              v-model="params.parent_id"
              :items="category_requirements.parents"
              chips
              item-title="name"
              item-value="id"
              clearable
              variant="outlined"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Meta Title English"
              v-model="params.meta_title.en"
              :error-messages="errors.meta_title"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Meta Title Arabic"
              v-model="params.meta_title.ar"
              :error-messages="errors.meta_title"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Meta Description English"
              v-model="params.meta_description.en"
              :error-messages="errors.meta_description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Meta Description Arabic"
              v-model="params.meta_description.ar"
              :error-messages="errors.meta_description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Meta Keyword English"
              v-model="params.meta_keyword.en"
              :error-messages="errors.meta_keyword"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Meta Keyword Arabic"
              v-model="params.meta_keyword.ar"
              :error-messages="errors.meta_keyword"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Description English"
              v-model="params.description.en"
              :error-messages="errors.description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Description Arabic"
              v-model="params.description.ar"
              :error-messages="errors.description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-select
              v-model="params.labels"
              :items="category_requirements.labels"
              chips
              label="Labels"
              item-title="title"
              item-value="id"
              multiple
              variant="outlined"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-select
              v-model="category.fields"
              :items="category_requirements.fields"
              chips
              item-title="title"
              item-value="id"
              label="Fields"
              multiple
              variant="outlined"
            ></v-select>
          </v-col>

          <template v-if="true">
            <template v-for="field in category.fields" :key="field">
              <template
                v-if="category_requirements.fields_obj[field].type == 'text'"
              >
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    :label="
                      category_requirements.fields_obj[field].title + ' Arabic'
                    "
                    v-model="category_requirements.fields_obj[field].value.ar"
                    required
                    variant="outlined"
                  ></v-text-field>
                  <!--  
                                  small
                                  density="compact" 
                                -->
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    :label="
                      category_requirements.fields_obj[field].title + ' English'
                    "
                    v-model="category_requirements.fields_obj[field].value.en"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </template>
              <template
                v-else-if="
                  category_requirements.fields_obj[field].type == 'textarea'
                "
              >
                <v-col cols="6" sm="6" md="6">
                  <v-textarea
                    filled
                    auto-grow
                    :label="
                      category_requirements.fields_obj[field].title + ' Arabic'
                    "
                    v-model="category_requirements.fields_obj[field].value.ar"
                    rows="2"
                    row-height="20"
                    required
                    variant="outlined"
                  ></v-textarea>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-textarea
                    filled
                    auto-grow
                    :label="
                      category_requirements.fields_obj[field].title + ' English'
                    "
                    v-model="category_requirements.fields_obj[field].value.en"
                    rows="2"
                    row-height="20"
                    required
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </template>
              <template
                v-else-if="
                  category_requirements.fields_obj[field].type == 'select' || category_requirements.fields_obj[field].type == 'multi-select'
                "
              >
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="category_requirements.fields_obj[field].value"
                    :items="
                      category_requirements.fields_obj[field].select_options
                    "
                    chips
                    :label="category_requirements.fields_obj[field].title"
                    item-title="value"
                    item-value="id"
                    :multiple="category_requirements.fields_obj[field].type == 'multi-select' ? true :false"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </template>
              <template
                v-else-if="
                  category_requirements.fields_obj[field].type == 'checkbox'
                "
              >
                <v-col cols="12" sm="12" md="12">
                  <v-checkbox
                    v-model="category_requirements.fields_obj[field].value"
                    :label="category_requirements.fields_obj[field].title"
                    
                    required
                  ></v-checkbox>
                </v-col>
              </template>
              <template
                v-else-if="
                  category_requirements.fields_obj[field].type == 'date'
                "
              >
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    type="date"
                    :label="category_requirements.fields_obj[field].title"
                    v-model="category_requirements.fields_obj[field].value"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </template>
            </template>
          </template>

          <v-col cols="12" sm="6" md="6">
            <v-file-input
              accept="image/*"
              ref="inputUpload"
              label="Image input"
              @update:modelValue="uploadImage"
              filled
              :error-messages="errors.image"
              required
              id="img-input"
              prepend-icon="mdi-camera"
              variant="outlined"
              v-model="clear_image"
            ></v-file-input>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-file-input
              accept="image/*"
              ref="inputUploadIcon"
              label="Icon input"
              filled
              :error-messages="errors.icon"
              @update:modelValue="uploadIcon"
              required
              id="img-icon-input"
              prepend-icon="mdi-camera"
              variant="outlined"
              v-model="clear_icon"
            ></v-file-input>
          </v-col>
        </v-row>
         <v-row justify="center">
           <v-col cols="6">
              <img
                :src="params.image"  
                :lazy-src="params.image"
                style="max-width:400px;max-height:200px"
                @error="imageNotFound"
              />
         </v-col>
         <v-col cols="6">
              <img
                :src="params.icon"  
                :lazy-src="params.icon"
                style="max-width:400px;max-height:200px"
                @error="imageNotFound"
              />
         </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="
            {
              formVisibility = false;
              clearDataParameters();
            }
          "
          class="save_close_btn"
        >
          Close
        </v-btn>
        <v-btn
          text
          @click="createOrEditCategory(params.id)"
          class="save_close_btn"
        >
          {{ params.id != null ? "Update" : " Save" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </RightForm>

  <!-- delete Dialog -->
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="delete_modal"
    class="delete-dialog"
  >
    <v-card>
      <v-toolbar color="primary">Delete Category</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete category?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteCategory(params.id)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import datatable from "../components/datatable.vue";
import repository from "@/api/repository";
import RightForm from "../components/form/RightForm.vue";
import { uploadImageBase64,imageNotFound } from "../util/helper";
export default {
  components: {
    datatable,
    RightForm,
  },
  name: "AddCategoryPage",
  data() {
    return {
      uploadImageBase64,
      imageNotFound,
      dialog: false,
      formVisibility: false,
      params: {
        id: null,
        image: "",
        icon: "",
        parent_id: null,
        slug: "",
        code: "",
        name: {
          en: "",
          ar: "",
        },
        meta_title: {
          ar: "",
          en: "",
        },
        meta_description: {
          ar: "",
          en: "",
        },
        meta_keyword: {
          ar: "",
          en: "",
        },
        description: {
          ar: "",
          en: "",
        },
        fields: [],
        labels: [],
      },
      errors: {
        name: [],
        icon: [],
        parent_id: [],
        slug: [],
        code: [],
        meta_title: [],
        meta_description: [],
        meta_keyword: [],
        description: [],
        fields: [],
        labels: [],
        image: [],
      },
      category_requirements: {
        fields: [],
        labels: [],
        parents: [],
        fields_obj: {},
      },
      category: {
        fields: [],
        parents: [],
        labels: [],
      },
      clear_icon: "",
      clear_image: "",
      value: 10,
      bufferValue: 20,
      interval: 0,
      delete_modal: false,
      is_Faild: false,
      items: ["product", "brand", "category"],
    };
  },
  methods: {
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Category";
      this.clearDataParameters();
      this.getFieldsAndLabelsAndParents();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Category";
      this.clearDataParameters();
      this.getFieldsAndLabelsAndParents();
      this.params.id = id;
      const response = await repository.getSpecificCategory(id);
      this.params = response.data.data.category;
      this.params.parent_id =
        typeof this.params.parent_id == "string"
          ? parseInt(this.params.parent_id)
          : typeof this.params.parent_id == "number"
          ? this.params.parent_id
          : null;
      this.category.labels = this.params.labels;

      if (this.params.fields.length > 0) {
        // let temp_fields = [];
        this.params.fields.forEach((field) => {
          // temp_fields.push(field.field_id);
          this.category.fields.push(parseInt(field.field_id));
           this.category_requirements.fields_obj[field.field_id].update_id = field.id
          if (field.type == `select` || field.type == `multi-select`) {
            this.category_requirements.fields_obj[field.field_id].value =
              parseInt(field.value);
          } else if (field.type == `text` || field.type == `textarea`) {
            this.category_requirements.fields_obj[field.field_id].value =
              JSON.parse(field.value);
          } else {
            this.category_requirements.fields_obj[field.field_id].value =
              field.value;
          }
        });
      }
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteCategory(id) {
      const response = await repository.deleteCategory(id);
      if (response.data.code == 1) {
        //category deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters();
        this.$refs.category_dt.getData();
      } else {
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    handleActivateElement(id) {
      alert("a" + id);
    },
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.image = img;
    },
    async uploadIcon(value) {
      var icon = await this.uploadImageBase64(value);
      this.params.icon = icon;
    },
    async createOrEditCategory(id) {
      this.params.fields = [];
      if (this.category.fields.length > 0) {
        this.category.fields.forEach((element) => {
          let result = {
            field_id: element,
            value: this.category_requirements.fields_obj[element].value,
            type: this.category_requirements.fields_obj[element].type,
            id:this.category_requirements.fields_obj[element].update_id ? this.category_requirements.fields_obj[element].update_id : null
          };
          this.params.fields.push(result);
        });
      }
      const response = id
        ? await repository.updateCategory(this.params)
        : await repository.createCategory(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.category_dt.getData();
      }else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
    clearDataParameters() {
      (this.category_requirements = {
        fields: [],
        labels: [],
        parents: [],
        fields_obj: {},
      }),
        (this.category = {
          fields: [],
          parents: [],
          labels: [],
        }),
        (this.params = {
          id: null,
          image: "",
          icon: "",
          parent_id: null,
          slug: "",
          code: "",
          name: {
            en: "",
            ar: "",
          },
          meta_title: {
            ar: "",
            en: "",
          },
          meta_description: {
            ar: "",
            en: "",
          },
          meta_keyword: {
            ar: "",
            en: "",
          },
          description: {
            ar: "",
            en: "",
          },
          fields: [],
          labels: [],
        }),
        (document.getElementById("img-input").value = "");
      this.clear_image = "";
      document.getElementById("img-icon-input").value = "";
      this.clear_icon = "";
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: [],
        icon: [],
        parent_id: [],
        slug: [],
        code: [],
        meta_title: [],
        meta_description: [],
        meta_keyword: [],
        description: [],
        labels: [],
        fields: [],
        image: [],
      };
    },
    async getFieldsAndLabelsAndParents() {
      const response = await repository.getFieldsAndLabelsAndParents();

      if (response.data.code == 1) {
        let arr = {};
        response.data.data.fields.forEach((element) => {
          arr[element.id] = element;
          if (element.type == "text" || element.type == "textarea") {
            arr[element.id].value = {
              ar: "",
              en: "",
            };
          } else if(element.type == "checkbox"){
            arr[element.id].value = false;
          }else{
            arr[element.id].value = null;
          }
        });
        this.category_requirements.fields_obj = arr;

        this.category_requirements.fields = response.data.data.fields;
        this.category_requirements.labels = response.data.data.labels;
        this.category_requirements.parents = response.data.data.categories;
      } else {
      }
    },
    nameToSlug(name) {
      return name
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    },
  },
  mounted() {
    this.getFieldsAndLabelsAndParents();
  },
  watch: {
    "params.name.en": {
      handler(newValue, oldValue) {
        this.params.slug = this.nameToSlug(newValue);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.category-form {
  .v-field__clearable {
    padding-top: 1rem !important;
  }
}
</style>
