<template>
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click"
    ></v-btn>

    <datatable
      theadId="country-dt"
      ref="country_dt"
      pageURL="api/dashboard/country/all"
      headersURL="api/dashboard/headers/countries"
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
              label="ISO Code 1"
              v-model="params.iso_code_1"
              :error-messages="errors.iso_code_1"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="ISO Code 2"
              v-model="params.iso_code_2"
              :error-messages="errors.iso_code_2"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Phone Code"
              v-model="params.phone_code"
              :error-messages="errors.phone_code"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-file-input
              accept="image/*"
              ref="inputUpload"
              label="File input"
              filled
              :error-messages="errors.flag"
              @update:modelValue="uploadImage"
              required
              id="img-input"
              prepend-icon="mdi-camera"
              v-model="clear_image"
              variant="outlined"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row justify="center">
           <v-col cols="6">
              <img
                :src="params.flag"  
                :lazy-src="params.flag"
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
          @click="createOrEditCountry(params.id)"
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
      <v-toolbar color="primary">Delete Country</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete country?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteCountry(params.id)">Yes</v-btn>
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
  name: "AddCountriesPage",
  data() {
    return {
      uploadImageBase64,
      imageNotFound,
      dialog: false,
      formVisibility: false,
      params: {
        id: null,
        name: {
          ar: "",
          en: "",
        },
        iso_code_1: "",
        iso_code_2: "",
        phone_code: "",
        flag: "",
      },
      errors: {
        name: [],
        iso_code_1: [],
        iso_code_2: [],
        phone_code: [],
        flag: [],
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
      this.form_title = "Add Country";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.form_title = "Edit Country";
      this.formVisibility = true;
      this.params.id = id;
      const response = await repository.getSpecificCountry(id);
      this.params = response.data.data.country;
      // this.params.flag = "";
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteCountry(id) {
      const response = await repository.deleteCountry(id);
      if (response.data.code == 1) {
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.country_dt.getData();
      } else {
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.flag = img;
    },
    async createOrEditCountry(id) {
      const response = id
        ? await repository.updateCountry(this.params)
        : await repository.createCountry(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.country_dt.getData();
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
          ar: "",
          en: "",
        },
        iso_code_1: "",
        iso_code_2: "",
        phone_code: "",
        flag: "",
      };
      document.getElementById("img-input").value = "";
      this.clear_image = "";
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: [],
        iso_code_1: [],
        iso_code_2: [],
        phone_code: [],
        flag: [],
      };
    },
  },
  mounted() {},
};
</script>
