<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="tax_dt"
      theadId="taxes-dt"
      pageURL="api/dashboard/tax/all"
      headersURL="api/dashboard/headers/taxes"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    />

  </v-container>
  <RightForm
    :class="formVisibility ? 'right-form-visible' : 'right-form-not-visible'"
    @formVisiblity="receive"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ form_title }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name English"
              v-model="params.name.en"
              :error-messages="errors['name.en']"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name Arabic"
              v-model="params.name.ar"
              :error-messages="errors['name.ar']"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-switch
              v-model="params.is_complex"
              hide-details
              inset
              color="indigo"
              label-color="red"
              :label="`Complex Tax`"
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              v-if="!params.is_complex"
              label="Percentage"
              v-model="params.percentage"
              :error-messages="errors.percentage"
              variant="outlined"
              max="100"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              v-if="params.is_complex"
              label="Complex Behavior"
              :items="complex_list"
              v-model="params.complex_behavior"
              item-title="value"
              item-value="id"
              :error-messages="errors.complex_behavior"
              required
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              v-if="params.is_complex"
              label="Components"
              :items="componentsTaxList"
              item-title="name"
              item-value="id"
              v-model="params.components"
              :error-messages="errors.components"
              multiple
              chips
              required
              variant="outlined"
            ></v-select>
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
        <v-btn text @click="addOrUpdateTax(params.id)" class="save_close_btn">
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
      <v-toolbar color="primary">Delete Tax</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete tax?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteTax(params.id)">Yes</v-btn>
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
      componentsTaxList: [],
      complex_list: [
        { value: "Combine", id: "combine" },
        { value: "After - Other", id: "after_other" },
      ],
      params: {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        is_complex: false,
        components: [],
        complex_behavior: "",
        percentage: null,
      },
      errors: {
        name: {
          en: [],
          ar: [],
        },
        components: [],
        complex_behavior: [],
        percentage: [],
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
        is_complex: false,
        components: [],
        complex_behavior: "",
        percentage: null,
      };
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: {
          en: [],
          ar: [],
        },
        components: [],
        complex_behavior: [],
        percentage: [],
      };
    },
    add_click() {
      this.getComponentsTax();
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add  tax";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit tax";
      this.params.id = id;
      const response = await repository.getSpecificTax(id);
      this.params = response.data.data.tax;
      this.componentsTaxList = response.data.data.components;
      this.params.components = response.data.data.tax.components.map((item) =>
        parseInt(item)
      );
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteTax(id) {
      const response = await repository.deleteTax(id);
      if (response.data.code == 1) {
        //tax deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.tax_dt.getData();
      } else {
        //tax not deleted
         this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdateTax(id) {
      const response = id
        ? await repository.updateTax(this.params)
        : await repository.addTax(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.tax_dt.getData();
      } else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
    async getComponentsTax() {
      const response = await repository.getComponentsTaxList();
      this.componentsTaxList = response.data.data.components;
    },
  },
  mounted() {
    this.getComponentsTax();
  },
};
</script>
