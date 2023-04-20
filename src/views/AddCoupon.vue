<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="coupon_dt"
      theadId="dat"
      pageURL="api/dashboard/coupon/all"
      headersURL="api/dashboard/headers/coupons"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    />
  </v-container>

  <RightForm
    :class="formVisibility ? 'right-form-visible' : 'right-form-not-visible'"
    @formVisiblity="receive"
    class="add-couppon"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ form_title }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              label="Code"
              v-model="params.code"
              :error-messages="errors.code"
              :hide-details="
                errors.code ? (errors.code.length != 0 ? false : true) : true
              "
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              label="Title"
              required
              v-model="params.title"
              :error-messages="errors.title"
              :hide-details="
                errors.title
                  ? errors.title.length != 0
                    ? false
                    : true
                  : true
              "
              density="compact"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
              variant="outlined"
              label="Start Date"
              v-model="params.start_date"
              :error-messages="errors.start_date"
              :hide-details="
                errors.start_date
                  ? errors.start_date.length != 0
                    ? false
                    : true
                  : true
              "
              type="date"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              label="Expiry Date"
              v-model="params.expiry_date"
              :error-messages="errors.expiry_date"
              :hide-details="
                errors.expiry_date
                  ? errors.expiry_date.length != 0
                    ? false
                    : true
                  : true
              "
              type="date"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              variant="outlined"
              :items="coupon_types"
              item-title="title"
              item-value="id"
              label="Type"
              v-model="params.type"
              :error-messages="errors.type"
              :hide-details="
                errors.type ? (errors.type.length != 0 ? false : true) : true
              "
              required
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              label="Value"
              v-model="params.value"
              :error-messages="errors.value"
              :hide-details="
                errors.value
                  ? errors.value.length != 0
                    ? false
                    : true
                  : true
              "
              type="number"
              required
              density="compact"
              :prefix="
                params.type == 'amount'
                  ? data_currency? data_currency.symbol : ''
                  : params.type == 'percentage'
                  ? '%'
                  : ''
              "
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              variant="outlined"
              label="Min amount"
              v-model="params.min_amount"
              :error-messages="errors.min_amount"
              type="number"
              :rules="[
                params.type == 'amount' && params.value >= params.min_amount
                  ? 'must be greater then or equal value'
                  : '',
              ]"
              :hide-details="
                errors.min_amount
                  ? errors.min_amount.length != 0 ||
                    (params.type == 'amount' && params.value)
                    ? false
                    : true
                  : true
              "
              :prefix="data_currency ?data_currency.symbol : '' "
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="params.is_one_time"
              color="indigo"
              hide-details
              label="Is One Time ?"
            ></v-switch>
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
        <v-btn @click="addOrUpdatecoupon(params.id)" class="save_close_btn">
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
      <v-toolbar color="primary">Delete coupon</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete coupon?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deletecoupon(params.id)">Yes</v-btn>
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
      roles: [],
      params: {
        id: null,
        code: null,
        title: null,
        start_date: null,
        expiry_date: null,
        value: null,
        min_amount: null,
        is_one_time: null,
        is_used: null,
        type: null,
      },
      errors: {
        code: [],
        title: [],
        start_date: [],
        expiry_date: [],
        value: [],
        min_amount: [],
        is_one_time: [],
        is_used: [],
        type: [],
      },
      coupon_types: [
        {
          id: "percentage",
          title: "Percentage",
        },
        {
          id: "amount",
          title: "Amount",
        },
      ],
      data_currency: {},
    };
  },
  methods: {
    clearDataParameters() {
      this.params = {
        id: null,
        code: null,
        title: null,
        start_date: null,
        expiry_date: null,
        value: null,
        min_amount: null,
        is_one_time: null,
        is_used: null,
        type: null,
      };
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        code: [],
        title: [],
        start_date: [],
        expiry_date: [],
        value: [],
        min_amount: [],
        is_one_time: [],
        is_used: [],
        type: [],
      };
    },
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add coupon";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit coupon";
      this.params.id = id;
      const response = await repository.getSpecificCoupon(id);
      this.params = response.data.data.coupon;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    handleActivateElement(id) {
      this.params.id = id;
    },
    async deletecoupon(id) {
      const response = await repository.deleteCoupon(id);
      if (response.data.code == 1) {
        //coupon deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.coupon_dt.getData();
      } else {
         this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    async getDefaultCurrency() {
      const response = await repository.getDefaultCurrency();
      if (response.data.code == 1) {
        this.data_currency = response.data.data.default_currency;
      } else {
        alert("no currency found");
      }
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdatecoupon(id) {
      const response = id
        ? await repository.updateCoupon(this.params)
        : await repository.addCoupon(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.coupon_dt.getData();
      }else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
  },
  mounted() {
    this.getDefaultCurrency();
  },
};
</script>
<style>
.add-couppon .v-text-field__prefix {
  position: relative;
  top: 10px;
}
</style>
