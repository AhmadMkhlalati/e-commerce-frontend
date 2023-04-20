<template>
  <!-- main container -->
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <!-- Datatable -->
    <v-btn
      :icon="formVisibility ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="field_dt"
      theadId="dat"
      pageURL="api/dashboard/field/all"
      headersURL="api/dashboard/headers/fields"
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
              label="Title English"
              v-model="params.title.en"
              :error-messages="errors['title.en']"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Title Arabic"
              v-model="params.title.ar"
              :error-messages="errors['title.ar']"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
              :items="entities"
              label="Entity"
              v-model="params.entity"
              :error-messages="errors.entity"
              @update:modelValue="is_product_select"
              density="comfortable"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
              :items="typeValues"
              label="Type"
              v-model="params.type"
              :error-messages="errors.type"
              @update:modelValue="is_product_select"
              density="comfortable"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="params.is_required"
              :error-messages="errors.is_required"
              hide-details
              inset
              color="indigo"
              :label="`Required`"
            ></v-switch>
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="params.is_attribute"
              :error-messages="errors.is_attribute"
              hide-details
              inset
              :disabled="is_product_type_select"
              color="indigo"
              :label="`Attribute`"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <template v-if="params.type == 'select' || params.type == 'multi-select'">
            <v-col cols="2" class="mt-2 pb-3">
              <v-btn
                size="x-small"
                icon="mdi-plus"
                color="primary-darken-2"
                @click="addOption()"
              >
                +
              </v-btn>
            </v-col>
            <v-col
              style="
                position: relative;
                top: 50%;
                transform: translate(0, 15%);
                font-weight: 500;
              "
              cols="5"
              class="mt-2 pb-3"
            >
              <span>English Options</span>
            </v-col>
            <v-col
              style="
                position: relative;
                top: 50%;
                transform: translate(0, 15%);
                font-weight: 500;
              "
              cols="5"
              class="mt-2 pb-3"
            >
              <span>Arabic Options</span>
            </v-col>

            <template
              v-for="(option, index) in params.field_values"
              :key="index"
            >
              <v-col class="pt-5" cols="2" sm="2" md="2">
                <v-btn
                  variant="outlined"
                  size="x-small"
                  icon="mdi-close"
                  color="red-darken-2"
                  v-if="params.field_values.length > 1"
                  @click="deleteOptionField(index)"
                ></v-btn>
              </v-col>
              <v-col cols="5" sm="5" md="5" :id="index">
                <v-text-field
                  label="Value English"
                  v-model="option.value.en"
                  variant="outlined"
                  hide-details
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="5" sm="5" md="5">
                <v-text-field
                  label="Value Arabic"
                  v-model="option.value.ar"
                  variant="outlined"
                  hide-details
                  required
                >
                </v-text-field>
              </v-col>
            </template>
          </template>
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
          @click="addOrUpdateField(params.id)"
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
      <v-toolbar color="primary">Delete Field</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete field?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteField(params.id)">Yes</v-btn>
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
      is_attribute: false,
      is_product_type_select: true,
      roles: [],
      entities: ["product", "brand", "category"],
      typeValues: ["text", "date", "textarea", "select", "multi-select","checkbox"],
      params: {
        id: null,
        title: {
          en: "",
          ar: "",
        },
        type: "",
        entity: "",
        is_required: false,
        is_attribute: false,
        field_values: [
          {
            id: null,
            value: { en: "", ar: "" },
          },
        ],
      },
      errors: {
        title: {
          en: [],
          ar: [],
        },
        type: [],
        entity: [],
        is_required: [],
        field_values: [
          {
            en: [],
            ar: [],
          },
        ],
      },
    };
  },
  methods: {
    is_product_select() {
      if (this.params.type == "select" && this.params.entity == "product" || this.params.type == "multi-select" && this.params.entity == "product")  {
        this.is_product_type_select = false;
      } else {
        this.params.is_attribute = false;
        this.is_product_type_select = true;
      }
    },
    deleteOptionField: function (index) {
      this.params.field_values.splice(index, 1);
      console.log("params 111", this.params);
    },
    addOption() {
      this.params.field_values.push({
        id: null,
        value: { en: "", ar: "" },
      });
    },
    clearDataParameters() {
      this.params = {
        id: null,
        title: {
          en: "",
          ar: "",
        },
        type: "",
        entity: "",
        is_required: false,
        is_attribute: false,
        field_values: [
          {
            id: null,
            value: { en: "", ar: "" },
          },
        ],
      };
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        title: {
          en: [],
          ar: [],
        },
        type: [],
        entity: [],
        is_required: [],
        is_attribute: [],
        field_values: [
          {
            en: [],
            ar: [],
          },
        ],
      };
    },
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add Field";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.form_title = "Edit Field";
      this.formVisibility = true;
      this.params.id = id;
      const response = await repository.getSpecificField(id);
      let temp_fields = response.data.data.field;
      if (temp_fields.field_values != undefined) {
        if (temp_fields.field_values.length > 0) {
          temp_fields.field_values.forEach((element) => {
            if (element.value != undefined) {
              element.value = { en: element.value.en, ar: element.value.ar };
            }
          });
        }
      }
      this.params = temp_fields;
      this.is_product_select();
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteField(id) {
      const response = await repository.deleteField(id);
      if (response.data.code == 1) {
        //Field deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.field_dt.getData();
      } else {
        //Field not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdateField(id) {
      const response = id
        ? await repository.updateField(this.params)
        : await repository.addField(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.field_dt.getData();
      } else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
    async getRoles() {
      const response = await repository.getRoles();
      this.roles = response.data.data;
    },
  },
  mounted() {
    this.getRoles();
  },
};
</script>
