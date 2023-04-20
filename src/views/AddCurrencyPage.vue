<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click"
    ></v-btn>

    <datatable
      theadId="currency-dt"
      ref="currency_dt"
      pageURL="api/dashboard/currency/all"
      headersURL="api/dashboard/headers/currencies"
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
              variant="outlined"
              required
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
            <v-text-field
              label="Symbol"
              v-model="params.symbol"
              :error-messages="errors.symbol"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              label="Rate"
              type="number"
              v-model="params.rate"
              :error-messages="errors.rate"
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
          @click="addOrEditCurrency(params.id)"
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
  name: "AddCurrencyPage",
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
        symbol: "",
        rate: null,
        image: "",
        is_default: false,
      },
      errors: {
        name: {
          en: [],
          ar: [],
        },
        code: [],
        symbol: [],
        rate: [],
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
      this.form_title = "Add Currency";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Currency";
      this.params.id = id;
      const response = await repository.getSpecificCurrency(id);
      this.params = response.data.data.currency;
    },
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.image = img;
    },
    async addOrEditCurrency(id) {
      const response = id
        ? await repository.updateCurrency(this.params)
        : await repository.addCurrency(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.currency_dt.getData();
      }else {
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
        symbol: "",
        rate: null,
        image: "",
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
        symbol: [],
        rate: [],
        image: [],
        is_default: [],
      };
    },
  },
};
</script>
