<template>
  <!-- loader -->
  <v-container style="margin-top: 200px; margin-left: 300px" v-if="!isLoading">
    <v-col class="text-subtitle-1 text-center" cols="6"> Loading </v-col>
    <v-col cols="6">
      <v-progress-linear
        color="deep-purple accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
    </v-col>
  </v-container>

  <!-- main container -->
  <v-container
    :style="
      formVisibility
        ? 'position: relative; padding-right: 40%; min-width: 100%; overflow-x: auto; min-height: 300px;'
        : ''
    "
    v-if="isLoading"
  >
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
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="goTo('OrderPage')"
    ></v-btn>

    <datatable
      ref="order_dt"
      theadId="order-dt"
      pageURL="api/dashboard/order/all"
      headersURL="api/dashboard/headers/orders"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    />
  </v-container>

  <!-- delete Dialog -->
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="delete_modal"
    class="delete-dialog"
  >
    <v-card>
      <v-toolbar color="primary">Delete order</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete order?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteorder(order_params.id)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RightForm from "@/components/form/RightForm.vue";
import datatable from "@/components/datatable.vue";
import repository from "@/api/repository";
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";

export default {
  components: {
    RightForm,
    datatable,
  },
  setup() {
    const root = useRootStore();

    const { loader } = storeToRefs(root);

    return {
      loader,
    };
  },
  data() {
    return {
      form_title: "",
      delete_modal: false,
      isLoading: true,
      isSucceed: false,
      errorMessage: "",
      successMessage: "",
      isFaild: false,
      order_params: {
        id: null,
        name: {
          en: "",
          ar: "",
        },
        code: "",
      },
    };
  },
  props: {
    isSideBar: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goTo(route, id = null) {
      if (id) {
        this.$router.push({ name: route, params: { id: id } });
      } else {
        this.$router.push({ name: route });
      }
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.order_params.id = id;
    },
    handleEditElement(id) {
      this.goTo("EditOrderPage", id);
    },
    async deleteorder(id) {
      const response = await repository.deleteorder(id);
      if (response.data.code == 1) {
        //order deleted successfully
        this.successMessage = "order deleted successfully";
        this.isSucceed = true;
        setTimeout(() => (this.isSucceed = false), 3000);
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.order_dt.getData();
      } else {
        //order not deleted
        this.errorMessage = "order deleted Faild";
        this.isFaild = true;
        setTimeout(() => (this.isFaild = false), 3000);
      }
      this.delete_modal = false;
      this.order_params.id = null;
    },
  },
  mounted() {},
};
</script>
