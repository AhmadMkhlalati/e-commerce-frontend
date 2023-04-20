<template>
  <!-- main container -->
  <v-container  :class="formVisibility ? 'form-visible' : 'form-not-visible'" class="tag-container">
    <!-- Datatable -->
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="tag_dt"
      theadId="dat"
      pageURL="api/dashboard/tag/all"
      headersURL="api/dashboard/headers/tags"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    />

  </v-container>
    <RightForm
      :class="formVisibility ? 'right-form-visible' : 'right-form-not-visible'"
      @formVisiblity="receive" class="tag-right-form"
    >
      <v-card style="width: 100% !important">
        <v-card-title>
          <span class="text-h5">{{ form_title }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="12" sm="12">
              <v-text-field
                label="Tag Name English"
                label-color="primary"
                variant="outlined"
                v-model="params.name.en"
                :error-messages="errors['name.en']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="12" sm="12">
              <v-text-field
                label="Tag Name Arabic"
                label-color="primary"
                variant="outlined"
                v-model="params.name.ar"
                :error-messages="errors['name.ar']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="12" sm="12"> </v-col>
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
          <v-btn text @click="addOrUpdateTag(params.id)" class="save_close_btn">
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
      <v-toolbar color="primary">Delete Tag</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete tag?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteTag(params.id)">Yes</v-btn>
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
        name: {
          en: "",
          ar: "",
        },
      },
      errors: {
        name: {
          en: [],
          ar: [],
        },
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
      };
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: {
          en: [],
          ar: [],
        },
      };
    },
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Tag";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit Tag";
      this.params.id = id;
      const response = await repository.getSpecificTag(id);
      this.params = response.data.data.tag;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteTag(id) {
      const response = await repository.deleteTag(id);
      if (response.data.code == 1) {
        //Tag deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.tag_dt.getData();
      } else {
        //Tag not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdateTag(id) {
      const response = id
        ? await repository.updateTag(this.params)
        : await repository.addTag(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.tag_dt.getData();
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
.plus-button {
  color: #212121;
  font-size: 1.5em;
  color: #fff;
  border-radius: 100% !important;
  width: 50px;
  height: 50px !important;
  margin-bottom: 2rem;
}
.tag-container .v-navigation-drawer__content {
  width: 100% !important;
}
.tag-right-form .right-form-contain{
  width:100%;
}
</style>
