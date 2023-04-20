<template>
  <v-container>
    <!-- success alert -->
    <v-alert
      v-if="isSucceed"
      density="comfortable"
      type="success"
      variant="tonal"
    >
      {{ successMessage }}
    </v-alert>

    <!-- error alert -->
    <v-alert v-if="isFaild" density="comfortable" type="error" variant="tonal">
      {{ errorMessage }}
    </v-alert>
    <!-- Datatable -->

    <v-btn
      @click="goTo('CreateProduct')"
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
    ></v-btn>

    <productDatatable
      ref="product_dt"
      theadId="dat"
      pageURL="api/dashboard/product/all"
      headersURL="api/dashboard/headers/products"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
      @actionAplly="actionAplly"
    />
  </v-container>

  <!-- global Dialog -->
  <v-dialog transition="dialog-bottom-transition" v-model="global_modal">
    <v-card>
      <v-toolbar color="primary">{{ action_type }} Products</v-toolbar>
      <v-card-text>
        <div class="pa-3">
          Are you sure you want to {{ action_type }} products?
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="global_modal = false">No</v-btn>
        <v-btn text>Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    transition="dialog-bottom-transition"
    v-model="delete_modal"
    class="delete-dialog"
  >
    <v-card>
      <v-toolbar color="primary">Delete product</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete product?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteProduct(product_id)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RightForm from "@/components/form/RightForm.vue";
import productDatatable from "@/components/productDatatable.vue";
import repository from "@/api/repository";

export default {
  components: {
    RightForm,
    productDatatable,
  },
  data() {
    return {
      form_title: "",
      global_modal: false,
      formVisibility: false,
      dialog: false,
      isSucceed: false,
      errorMessage: "",
      successMessage: "",
      isFaild: false,
      action_type: "",
      products: [],
      product_id: null,
      delete_modal: false,
    };
  },
  props: {
    isSideBar: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    actionAplly(products_id, type) {
      this.action_type = type;
      this.products = products_id;
      console.log(products_id, "products_id");
      this.global_modal = true;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.product_id = id;
    },
    handleEditElement(id) {
      this.goTo("EditProduct", id);
    },

    async deleteProduct(id) {
      const response = await repository.deleteProduct(id);
      if (response.data.code == 1) {
        //Product deleted successfully
        this.successMessage = "Product deleted successfully";
        this.isSucceed = true;
        setTimeout(() => (this.isSucceed = false), 3000);
        this.$refs.product_dt.getData();
      } else {
        //Product not deleted
        this.errorMessage = "Product deleted Faild";
        this.isFaild = true;
        setTimeout(() => (this.isFaild = false), 3000);
      }
      this.delete_modal = false;
      this.product_id = null;
    },
    goTo(route, id = null) {
      if (id) {
        this.$router.push({ name: route, params: { id: id } });
      } else {
        this.$router.push({ name: route });
      }
    },
  },
  mounted() {},
};
</script>
<style>
#test .v-overlay__content {
  border-radius: 0;
  margin: 0;
  padding: 0;
  width: 50%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  top: 63px;
  right: 0 !important;
  left: initial;
}
.v-container {
  max-width: inherit !important;
}
.v-messages__message {
  color: red;
}
.save_close_btn {
  color: white !important;
  background-color: rgb(33, 33, 33) !important;
  border-radius: 21px !important;
  margin-inline: 5px !important;
  padding-inline: 15px !important;
  font-size: 0.75rem !important;
}
</style>
