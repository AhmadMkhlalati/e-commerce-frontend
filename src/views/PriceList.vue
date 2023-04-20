<template>
  <!-- main container -->
  <v-container >
    <!-- Datatable -->
    <v-select
      class="w-25"
      v-model="advanced_search.prices_class"
      @update:modelValue="refreshData"
      :items="class_prices_list"
      item-title="title_price_currency"
      item-value="id"
      label="Price List"
      variant="outlined"
      density="compact"
      required
      multiple
      chips
    ></v-select>

    <PriceListDatatable
      ref="price_list_dt"
      theadId="dat"
      pageURL="api/dashboard/price_list/show"
      headersURL="api/dashboard/headers/prices_list"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
      :advancedSearch="advanced_search"
    />

    <v-btn
      rounded="pill"
      color="primary"
      size="large"
      @click="updatePrices"
      class="mt-3"
      style="float: right"
    >
      Save
    </v-btn>
  </v-container>
</template>

<script>
import PriceListDatatable from "@/components/PriceListDatatable.vue";
import repository from "@/api/repository";
export default {
  components: {
    PriceListDatatable,
  },
  data() {
    return {
      formVisibility: false,
      form_title: "",
      delete_modal: false,
      dialog: false,
      roles: [],
      class_prices_list: [],
      advanced_search: {
        prices_class: [],
      },
      params: {
        key: null,
        value: "",
        type: "",
      },
    };
  },
  methods: {
    refreshData(value){
      if(value.length>0) {
        this.$refs.price_list_dt.refreshDataTable(this.advanced_search)
      }
    },
    clearDataParameters() {
      this.params = {
        key: null,
        value: "",
        type: "",
      };
    },
    async handleEditElement(id, value, type) {
      this.params.key = id;
      this.params.value = value;
      this.params.type = type;
      const response = await repository.updateSettings(this.params);
      this.$refs.price_list_dt.loadSuccess(id);
      if (response.data.code == 1) {
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
      } else {
        this.$toast.error(response.data.message)
      }
    },
    async getClassPricesList() {
      const response = await repository.getClassPricesList();
      this.class_prices_list = response.data.data;
    },
    async updatePrices() {
      var response = await this.$refs.price_list_dt.updatePrices();
      if (response.data.code == 1) {
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        await this.$refs.price_list_dt.getDataWithHeaders();
      } else {
        this.$toast.error(response.data.message)
      }
    },
  },
  mounted() {
    this.getClassPricesList();
  },
};
</script>
