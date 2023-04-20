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
      v-if="1"
      ref="user_dt"
      theadId="dat"
      pageURL="api/dashboard/user/all"
      headersURL="api/dashboard/headers/users"
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
                variant="outlined"
                label="username"
                v-model="params.username"
                :error-messages="errors.username"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                variant="outlined"
                label="First name*"
                required
                v-model="params.first_name"
                :error-messages="errors.first_name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                variant="outlined"
                label="Last name*"
                v-model="params.last_name"
                :error-messages="errors.last_name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                variant="outlined"
                label="Email*"
                v-model="params.email"
                :error-messages="errors.email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" v-if="params.id == null">
              <v-text-field
                variant="outlined"
                label="Password"
                v-model="params.password"
                type="password"
                hint="At least 8 characters"
                :error-messages="errors.password"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" v-if="params.id == null">
              <v-text-field
                variant="outlined"
                label="Confirm Password"
                v-model="params.password_confirmation"
                :error-messages="errors.password_confirmation"
                hint="At least 8 characters"
                type="password"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                variant="outlined"
                :items="roles"
                item-title="name"
                item-value="id"
                label="Role"
                v-model="params.role_id"
                :error-messages="errors.role_id"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-switch
                v-model="params.is_active"
                color="indigo"
                hide-details
                :label="params.is_active ? 'Active' : 'In active'"
              ></v-switch>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-file-input
                accept="image/*"
                ref="inputUpload"
                label="File input"
                filled
                :error-messages="errors.image"
                @update:modelValue="uploadImage"  
                required
                id="img-input"
                prepend-icon="mdi-camera"
                variant="outlined"
                v-model="clear_image"
              ></v-file-input>
            </v-col>
          </v-row>
         <v-row justify="center">
           <v-col cols="6">
              <img
                :src="params.image"  
                :lazy-src="params.image"
                style="max-width:400px;max-height:200px"
                @error="imageNotFound"
              />
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
          <v-btn @click="addOrUpdateUser(params.id)" class="save_close_btn">
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
      <v-toolbar color="primary">Delete User</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete user?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteUser(params.id)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RightForm from "@/components/form/RightForm.vue";
import datatable from "@/components/datatable.vue";
import repository from "@/api/repository";
import { uploadImageBase64,imageNotFound } from "../util/helper";

export default {
  components: {
    RightForm,
    datatable,
  },

  data() {
    return {
      clear_image: "",
      uploadImageBase64,
      imageNotFound,
      form_title: "",
      delete_modal: false,
      formVisibility: false,
      dialog: false,
      roles: [],
      params: {
        id: null,
        first_name: "",
        username: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmed: "",
        role_id: "",
        is_active: true,
        image:null,
      },
      errors: {
        username: [],
        first_name: [],
        last_name: [],
        email: [],
        password: [],
        password_confirmation: [],
        role_id: [],
        image:[],
      },
    };
  },

  methods: {
    async uploadImage(value) {
      var img = await this.uploadImageBase64(value);
      this.params.image = img;
    },
    clearDataParameters() {
      this.params = {
        id: null,
        first_name: "",
        username: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmed: "",
        role_id: "",
        is_active: true,
        image:null,
      };
      (document.getElementById("img-input").value = "");
      this.clear_image = "";
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        username: [],
        first_name: [],
        last_name: [],
        email: [],
        password: [],
        password_confirmation: [],
        role_id: [],
        image:[],
      };
    },
    add_click() {
      this.formVisibility = !this.formVisibility;
      this.form_title = "Add User";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.formVisibility = true;
      this.form_title = "Edit User";
      this.params.id = id;
      const response = await repository.getSpecificUser(id);
      this.params = response.data.data.user;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async deleteUser(id) {
      const response = await repository.deleteUser(id);
      if (response.data.code == 1) {
        //user deleted successfully
        this.$toast.success(response.data.message)
        this.formVisibility = false;
        this.clearDataParameters;
        this.$refs.user_dt.getData();
      } else {
        //user not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    receive(childData) {
      this.formVisibility = childData;
    },
    async addOrUpdateUser(id) {
      const response = id
        ? await repository.updateUser(this.params)
        : await repository.addUser(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        this.clearDataParameters();
        this.$refs.user_dt.getData();
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
