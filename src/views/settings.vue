<template>
  <!-- main container -->
  <v-container
    :style="
      formVisibility
        ? 'position: relative; padding-right: 40%; min-width: 100%; overflow-x: auto; min-height: 300px;'
        : ''
    ">
  
    <datatable
      ref="setting_dt"
      theadId="dat"
      pageURL="api/dashboard/setting/all"
      headersURL="api/dashboard/headers/settings"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    />
  </v-container>
</template>

<script>
import RightForm from "@/components/form/RightForm.vue";
import datatable from "@/components/SettingsDatatable.vue";
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
      dialog: false,
      roles: [],
      params: {
        key: null,
        value: "",
        type: "",
      },
    };
  },
  methods: {
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
      this.$refs.setting_dt.loadSuccess(id);
      if (response.data.code == 1) {
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
      } else {
        this.$toast.error(response.data.message)
      }
    },
  },
};
</script>
<style></style>
