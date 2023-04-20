<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <!-- Datatable -->
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click"
    ></v-btn>

    <datatable
      theadId="label-dt"
      ref="label_dt"
      pageURL="api/dashboard/label/all"
      headersURL="api/dashboard/headers/labels"
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
              label="Title Arabic"
              v-model="params.title.ar"
              :error-messages="errors['title.ar']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Title English"
              v-model="params.title.en"
              :error-messages="errors['title.en']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
              :items="items"
              label="Entity"
              v-model="params.entity"
              :error-messages="errors.entity"
              required
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Color"
              v-model="params.color"
              :error-messages="errors.color"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Key"
              v-model="params.key"
              :error-messages="errors.key"
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
              :error-messages="errors.image"
              @update:modelValue="uploadImage"
              required
              id="img-input"
              prepend-icon="mdi-camera"
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
          @click="createOrEditLabel(params.id)"
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
      <v-toolbar color="primary">Delete Label</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete label?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteLabel(params.id)">Yes</v-btn>
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
  name: "AddLabelPage",
  data() {
    return {
      uploadImageBase64,
      imageNotFound,
      dialog: false,
      formVisibility: false,
      params: {
        id: null,
        title: {
          en: "",
          ar: "",
        },
        entity: "",
        color: "",
        key: "",
        image: "",
      },
      errors: {
        title: [],
        entity: [],
        color: [],
        key: [],
        image: [],
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
      this.form_title = "Add Label";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Label";
      this.params.id = id;
      const response = await repository.getSpecificLabel(id);
      this.params = response.data.data.label;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteLabel(id) {
      const response = await repository.deleteLabel(id);
      if (response.data.code == 1) {
        //label deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.label_dt.getData();
      } else {
        //label not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.image = img;
    },
    async createOrEditLabel(id) {
      const response = id
        ? await repository.updateLabel(this.params)
        : await repository.createLabel(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.label_dt.getData();
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
        title: {
          en: "",
          ar: "",
        },
        entity: "",
        color: "",
        key: "",
        image: "",
      };
      document.getElementById("img-input").value = "";
      this.clear_image = "";

      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        title: [],
        entity: [],
        color: [],
        key: [],
        image: [],
      };
    },
  },
};
</script>
