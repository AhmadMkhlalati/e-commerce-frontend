<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="class_price_dt"
      theadId="dat"
      pageURL="api/dashboard/price/all"
      headersURL="api/dashboard/headers/prices"
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
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                variant="outlined"
                label="Name English"
                v-model="params.name.en"
                :error-messages="errors['name.en']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                variant="outlined"
                label="Name Arabic"
                v-model="params.name.ar"
                :error-messages="errors['name.ar']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-select
                variant="outlined"
                :items="currencies"
                item-title="name"
                item-value="id"
                label="Currency"
                v-model="params.currency_id"
                :error-messages="errors.currency_id"
                required
              ></v-select>
            </v-col>
            <v-col>
              <v-switch
                v-model="params.is_virtual"
                label="is virtual"
                color="indigo"
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
          <v-row v-if="params.is_virtual">
            <v-col cols="12" sm="12" md="12">
              <v-select
                variant="outlined"
                :items="nonVertualClassesData"
                item-title="name"
                item-value="id"
                label="Parent Class"
                v-model="params.original_price_id"
                :error-messages="errors.original_price_id"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                variant="outlined"
                label="Percentage"
                prefix="%"
                v-model="params.percentage"
                :error-messages="errors.percentage"
                type="number"
                min="0"
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
            @click="addOrUpdateclassPrice(params.id)"
            class="save_close_btn"
          >
            {{ params.id != null ? "Update" : " Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </RightForm>
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
      formVisibility: false,
      dialog: false,
      errors: {
        name: [],
        currency_id: [],
        original_price_id: [],
        percentage: [],
      },
      currencies: [],
      nonVertualClassesData: [],
      params: {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        is_virtual: false,
        currency_id: null,
        original_price_id: null,
        percentage: null,
      },
    };
  },
  methods: {
    clearDataParameters() {
      (this.params = {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        is_virtual: false,
        currency_id: null,
        original_price_id: null,
        percentage: null,
      }),
        this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: {
          en: [],
          ar: [],
        },
        currency_id: [],
        original_price_id: [],
        percentage: [],
      };
    },
    add_click() {
      this.getCreateData(this.params.id);
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Class price";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit price";
      this.params.id = id;
      this.getCreateData(this.params.id);
      const response = await repository.getSpecificPriceClass(id);
      this.params = response.data.data.price;
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdateclassPrice(id) {
      const response = id
        ? await repository.updatePriceClass(this.params)
        : await repository.addClassPrice(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.clearDataParameters();
        this.$toast.success(response.data.message)
        this.$refs.class_price_dt.getData();
        this.getCreateData(id);
      } else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
    async getCurrencies() {
      const response = await repository.getCurrencies();
      this.currencies = response.data.data;
    },
    async getCreateData(id) {
      const response = await repository.getNonVirtualClasses(id);
      this.nonVertualClassesData = response.data.data.original_prices;
      console.log("response.data.original_prices", response.data);
    },
  },
  mounted() {
    this.getCurrencies();
  },
};
</script>
