<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      theadId="language-dt"
      ref="language_dt"
      pageURL="api/dashboard/language/all"
      headersURL="api/dashboard/headers/languages"
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
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="Name Arabic"
              v-model="params.name.ar"
              :error-messages="errors['name.ar']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="Name English"
              v-model="params.name.en"
              :error-messages="errors['name.en']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="Code"
              v-model="params.code"
              :error-messages="errors.code"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="6" sm="6" md="6">
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
          <v-col cols="6">
            <v-switch
              v-model="params.is_default"
              label="is Default"
              color="indigo"
              hide-details
            ></v-switch>
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
          @click="addOrEditLanguage(params.id)"
          class="save_close_btn"
        >
          {{ params.id != null ? "Update" : " Save" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </RightForm>
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
  name: "AddLanguagePage",
  data() {
    return {
      uploadImageBase64,
      imageNotFound,
      dialog: false,
      formVisibility: false,
      params: {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        code: "",
        image: null,
        is_default: false,
      },
      errors: {
        name: {
          en: [],
          ar: [],
        },
        code: [],
        image: [],
        is_default: [],
      },
      value: 10,
      bufferValue: 20,
      interval: 0,
      delete_modal: false,
      is_Faild: false,
      items: ["product", "brand", "category"],
      clear_image: "",
    };
  },
  methods: {
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Language";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Language";
      this.params.id = id;
      const response = await repository.getSpecificLanguage(id);
      this.params = response.data.data.language;
    },
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.image = img;
    },
    async addOrEditLanguage(id) {
      const response = id
        ? await repository.updateLanguage(this.params)
        : await repository.addLanguage(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.language_dt.getData();
      } else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }

    },
    clearDataParameters() {
      this.params = {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        code: "",
        image: null,
        is_default: false,
      };

      document.getElementById("img-input").value = "";
      (this.clear_image = ""), this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: {
          en: [],
          ar: [],
        },
        code: [],
        image: [],
        is_default: [],
      };
    },
  },
};
</script>
