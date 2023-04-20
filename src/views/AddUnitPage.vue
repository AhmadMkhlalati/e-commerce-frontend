<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'"  class="unit-container" >
  
    <!-- Datatable -->
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="unit_dt"
      theadId="unit-dt"
      pageURL="api/dashboard/unit/all"
      headersURL="api/dashboard/headers/units"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    />
  </v-container>

  <RightForm
      :class="formVisibility ? 'right-form-visible' : 'right-form-not-visible'"
      @formVisiblity="receive" class="unit-right-form"
    >
      <v-card style="width: 100%">
        <v-card-title>
          <span class="text-h5">{{ form_title }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="12" sm="12">
              <v-text-field
                label="Unit Name English"
                label-color="primary"
                variant="outlined"
                v-model="params.name.en"
                :error-messages="errors['name.en']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="12" sm="12">
              <v-text-field
                label="Unit Name Arabic"
                label-color="primary"
                variant="outlined"
                v-model="params.name.ar"
                :error-messages="errors['name.ar']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="12" sm="12">
              <v-text-field
                label="Unit Code"
                label-color="primary"
                variant="outlined"
                v-model="params.code"
                :error-messages="errors.code"
              ></v-text-field>
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
            @click="addOrUpdateUnit(params.id)"
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
      <v-toolbar color="primary">Delete Unit</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete unit?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteUnit(params.id)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RightForm from "@/components/form/RightForm.vue";
import datatable from "@/components/datatable.vue";
import repository from "@/api/repository";

export default {
  components: {
    RightForm,
    datatable,
  },
  data() {
    return {
      form_title: "",
      delete_modal: false,
      formVisibility: false,
      dialog: false,
      sound: true,
      roles: [],
      params: {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        code: "",
      },
      errors: {
        name: {
          en: [],
          ar: [],
        },
        code: [],
      },
    };
  },
  methods: {
    clearDataParameters() {
      this.params = {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        code: "",
      };
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: {
          en: [],
          ar: [],
        },
        code: [],
      };
    },
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Unit";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Unit";
      this.params.id = id;
      const response = await repository.getSpecificUnit(id);
      this.params = response.data.data.unit;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteUnit(id) {
      const response = await repository.deleteUnit(id);
      if (response.data.code == 1) {
        //unit deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.unit_dt.getData();
      } else {
        //unit not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdateUnit(id) {
      const response = id
        ? await repository.updateUnit(this.params)
        : await repository.addUnit(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.unit_dt.getData();
      } else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
  },
};
</script>
<style>
.unit-container .v-navigation-drawer__content {
  width: 100% !important;
}
.unit-right-form .right-form-contain{
  width:100%;
}
</style>
