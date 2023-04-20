<template>
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click"
    ></v-btn>

    <datatable
      theadId="brand-dt"
      ref="brand_dt"
      pageURL="api/dashboard/brand/all"
      headersURL="api/dashboard/headers/brands"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    ></datatable>
  </v-container>
  <RightForm
    :class="formVisibility ? 'right-form-visible' : 'right-form-not-visible'"
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
              label="English Meta Title"
              v-model="params.meta_title.en"
              :error-messages="errors.meta_title"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Arabic Meta Title "
              v-model="params.meta_title.ar"
              :error-messages="errors.meta_title"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="English Meta Description"
              v-model="params.meta_description.en"
              :error-messages="errors.meta_description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Arabic Meta Description"
              v-model="params.meta_description.ar"
              :error-messages="errors.meta_description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="English Meta Keyword"
              v-model="params.meta_keyword.en"
              :error-messages="errors.meta_keyword"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Arabic Meta Keyword"
              v-model="params.meta_keyword.ar"
              :error-messages="errors.meta_keyword"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="English Description"
              v-model="params.description.en"
              :error-messages="errors.description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Arabic Description"
              v-model="params.description.ar"
              :error-messages="errors.description"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-select
              v-model="params.labels"
              :items="brand_requirements.labels"
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
              v-model="brand.fields"
              :items="brand_requirements.fields"
              chips
              item-title="title"
              item-value="id"
              label="Fields"
              multiple
              variant="outlined"
            ></v-select>
          </v-col>

          <template v-if="true">
            <template v-for="field in brand.fields" :key="field">
              <template
                v-if="brand_requirements.fields_obj[field].type == 'text'"
              >
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    :label="
                      brand_requirements.fields_obj[field].title + ' Arabic'
                    "
                    v-model="brand_requirements.fields_obj[field].value.ar"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    :label="
                      brand_requirements.fields_obj[field].title + ' English'
                    "
                    v-model="brand_requirements.fields_obj[field].value.en"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </template>
              <template
                v-else-if="
                  brand_requirements.fields_obj[field].type == 'textarea'
                "
              >
                <v-col cols="6" sm="6" md="6">
                  <v-textarea
                    filled
                    auto-grow
                    :label="
                      brand_requirements.fields_obj[field].title + ' Arabic'
                    "
                    v-model="brand_requirements.fields_obj[field].value.ar"
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
                      brand_requirements.fields_obj[field].title + ' English'
                    "
                    v-model="brand_requirements.fields_obj[field].value.en"
                    rows="2"
                    row-height="20"
                    required
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </template>
              <template
                v-else-if="
                  brand_requirements.fields_obj[field].type == 'select' || brand_requirements.fields_obj[field].type == 'multi-select'
                "
              >
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="brand_requirements.fields_obj[field].value"
                    :items="brand_requirements.fields_obj[field].select_options"
                    chips
                    :label="brand_requirements.fields_obj[field].title"
                    item-title="value"
                    item-value="id"
                    variant="outlined"
                    :multiple="brand_requirements.fields_obj[field].type == 'multi-select'? true : false"
                  ></v-select>
                </v-col>
              </template>
              <template
                v-else-if="
                  brand_requirements.fields_obj[field].type == 'checkbox'
                "
              >
                <v-col cols="12" sm="12" md="12">
                  <v-checkbox
                    v-model="brand_requirements.fields_obj[field].value"
                    :label="brand_requirements.fields_obj[field].title"
                    required
                  ></v-checkbox>
                </v-col>
              </template>
              <template
                v-else-if="brand_requirements.fields_obj[field].type == 'date'"
              >
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    type="date"
                    :label="brand_requirements.fields_obj[field].title"
                    v-model="brand_requirements.fields_obj[field].value"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </template>
            </template>
          </template>

          <v-col cols="12" sm="12" md="12">
            <v-file-input
              accept="image/*"
              ref="inputUpload"
              label="File input"
              filled
              :error-messages="errors.image"
              @update:modelValue="uploadImage"
              required
              id="img-input"
              prepend-icon="mdi-camera"
              variant="outlined"
              v-model="clear_image"
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
          @click="createOrEditBrand(params.id)"
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
      <v-toolbar color="primary">Delete Brand</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete brand?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteBrand(params.id)">Yes</v-btn>
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
  name: "AddBrandPage",
  data() {
    return {
      uploadImageBase64,
      imageNotFound,
      dialog: false,
      formVisibility: false,
      params: {
        id: null,
        image: "",
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
        "name.en": [],
        "name.ar": [],
        meta_title: [],
        meta_description: [],
        meta_keyword: [],
        description: [],
        fields: [],
        labels: [],
        image: [],
      },
      brand_requirements: {
        fields: [],
        labels: [],
        fields_obj: {},
      },
      brand: {
        fields: [],
        labels: [],
      },
      value: 10,
      bufferValue: 20,
      interval: 0,
      delete_modal: false,
      items: ["product", "brand", "category"],
      clear_image: "",
    };
  },
  methods: {
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Brand";
      this.clearDataParameters();
      this.getFieldsAndLabels();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Brand";
      this.clearDataParameters();
      this.getFieldsAndLabels();
      this.params.id = id;
      const response = await repository.getSpecificBrand(id);
      this.params = response.data.data.brands;
      if (this.params.fields.length > 0) {
        this.params.fields.forEach((field) => {
          this.brand.fields.push(parseInt(field.field_id));
           this.brand_requirements.fields_obj[field.field_id].update_id = field.id
          if (field.type == `select` || field.type == `multi-select`) {
            this.brand_requirements.fields_obj[field.field_id].value = parseInt(
              field.value
            );
          } else if (field.type == `text` || field.type == `textarea`) {
            this.brand_requirements.fields_obj[field.field_id].value =
              JSON.parse(field.value);
          } else {
            this.brand_requirements.fields_obj[field.field_id].value =
              field.value;
          }
        });
      }
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteBrand(id) {
      const response = await repository.deleteBrand(id);
      if (response.data.code == 1) {
        //brand deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.brand_dt.getData();
      } else {
        //brand not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.image = img;
    },
    async createOrEditBrand(id) {
      this.params.fields = [];
      if (this.brand.fields.length > 0) {
        this.brand.fields.forEach((element) => {
          let result = {
            field_id: element,
            value: this.brand_requirements.fields_obj[element].value,
            type: this.brand_requirements.fields_obj[element].type,
            id:this.brand_requirements.fields_obj[element].update_id ? this.brand_requirements.fields_obj[element].update_id : null
          };
          this.params.fields.push(result);
        });
      }
      const response = id
        ? await repository.updateBrand(this.params)
        : await repository.createBrand(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.brand_dt.getData();
      }else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
    clearDataParameters() {
      (this.brand_requirements = {
        fields: [],
        labels: [],
        fields_obj: {},
      }),
        (this.brand = {
          fields: [],
          labels: [],
        }),
        (this.params = {
          id: null,
          image: "",
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
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        "name.en": [],
        "name.ar": [],
        meta_title: [],
        meta_description: [],
        meta_keyword: [],
        description: [],
        labels: [],
        fields: [],
        image: [],
      };
    },
    async getFieldsAndLabels() {
      const response = await repository.getFieldsAndLabels();
      this.clearErrors();
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
        this.brand_requirements.fields_obj = arr;

        this.brand_requirements.fields = response.data.data.fields;
        this.brand_requirements.labels = response.data.data.labels;
      }
    },
  },
  mounted() {
    this.getFieldsAndLabels();
  },
};
</script>
