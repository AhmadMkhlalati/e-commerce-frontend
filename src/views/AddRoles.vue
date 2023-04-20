<template>
  <v-container :class="formVisibility ? 'form-visible' : 'form-not-visible'">
    <v-btn
      :icon="dialog ? 'mdi-close' : 'mdi-plus'"
      class="btn_add"
      @click="add_click()"
    ></v-btn>

    <datatable
      ref="role_dt"
      theadId="roles-dt"
      pageURL="api/dashboard/role/all"
      headersURL="api/dashboard/headers/roles"
      :activeElementShow="false"
      @editElement="handleEditElement"
      @deleteElement="handleDeleteElement"
      @activateElement="handleActivateElement"
    ></datatable>
  </v-container>

  <v-dialog v-model="dialog" persistent id="params">
    <v-card>
      <v-card-title class="text-h5">
        {{ form_title }}
      </v-card-title>

      <v-container v-if="!tree_loading">
        <v-row>
          <v-col cols="4" sm="4" md="4">
            <v-text-field
              variant="outlined"
              label="name"
              v-model="params.name"
              :error-messages="errors.name"
            ></v-text-field>
          </v-col>

          <v-col cols="4" sm="4" md="4">
            <v-select
              :items="parent_roles"
              item-title="name"
              item-value="id"
              label="Parent Role"
              variant="outlined"
              @update:modelValue="getParentPermissions"
              v-model="params.parent_role"
              :error-messages="errors.parent_role"
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-card v-if="roles_tabs.length > 0">
          <v-tabs v-model="tab" center-active>
            <template v-for="(data, index) in roles_tabs" :key="index">
              <v-tab :value="data.id">{{ data.name }}</v-tab>
            </template>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <template v-for="(data, index) in roles_tabs" :key="index">
                <v-window-item :value="data.id">
                  <v-row class="pa-2 ma-2">
                    <v-col cols="6">
                      <Tree
                        :nodes="data.tree"
                        :use-checkbox="true"
                        :use-icon="false"
                        show-child-count
                        v-model:nodes="data.tree"
                        :id="data.id"
                      />
                      <!-- use-row-delete -->
                    </v-col>
                  </v-row>
                </v-window-item>
              </template>
            </v-window>
          </v-card-text>
        </v-card>
      </v-container>

      <v-container v-if="tree_loading">
        <div class="text-center">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-container>
      <v-card-actions v-if="!tree_loading">
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="clearDataParameters(), (dialog = false)"
          class="save_close_btn"
        >
          Cancel
        </v-btn>
        <v-btn text @click="addOrUpdateRole(params.id)" class="save_close_btn">
          {{ params.id != null ? "Update" : " Save" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    transition="dialog-bottom-transition"
    v-model="delete_modal"
    class="delete-dialog"
  >
    <v-card>
      <v-toolbar color="primary">Delete role</v-toolbar>
      <v-card-text>
        <div class="pa-3">Are you sure you want to delete role?</div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="delete_modal = false">No</v-btn>
        <v-btn text @click="deleteRole(params.id)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RightForm from "@/components/form/RightForm.vue";
import datatable from "@/components/datatable.vue";
import TreeView from "@/views/TreeView.vue";
import repository from "@/api/repository";
import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";

export default {
  components: {
    RightForm,
    datatable,
    TreeView,
    Tree,
  },
  data() {
    return {
      roles_tabs: [],
      form_title: "Add Role",
      delete_modal: false,
      formVisibility: false,
      dialog: false,
      tab: null,
      parent_roles: [],
      tree_loading: false,
      params: {
        id: null,
        name: "",
        parent_role: null,
        permissions: [],
      },
      errors: {
        name: [],
        parent_role: [],
        permissions: [],
      },
      permissison_req: {
        parent_role: null,
        role: null,
      },
    };
  },
  methods: {
    add_click() {
      this.getCreateData(this.params.id)
      this.dialog = !this.dialog;
      this.form_title = "Add Role";
      this.clearDataParameters();
    },
    async handleEditElement(id) {
      this.params.id = id;
      this.form_title = "Edit role";
      this.dialog = true;
      this.getCreateData(id)
      this.tree_loading = true;
      const response = await repository.getSpecificRole(id);
      this.params = response.data.data.role;
      this.roles_tabs = response.data.data.role.permissions;
      this.tree_loading = false;
    },
    handleDeleteElement(id) {
      this.delete_modal = true;
      this.params.id = id;
    },
    async getCreateData(id) {
      const response = await repository.getRolesList(id);
      this.parent_roles = response.data.data.roles;
    },
    async getParentPermissions(value) {
      // this.params.parent_role=value
      this.tree_loading = true;
      this.permissison_req = {
        parent_role: value,
        role: this.params.id,
      };
      const response = await repository.getParentPermissions(
        this.permissison_req
      );
      if (response.status == 200) {
        this.roles_tabs = response.data.data;
      }
      this.tree_loading = false;
    },
    async addOrUpdateRole(id) {
      this.params.permissions = this.roles_tabs;
      const response = id
        ? await repository.updateRole(this.params)
        : await repository.addRole(this.params);
      this.clearErrors();
      if (response.data.code == 1) {
        this.dialog = false;
        this.formVisibility = false;
        this.$toast.success(response.data.message)
        if (!id) {
          this.getCreateData(id);
        }
        this.clearDataParameters();
        this.$refs.role_dt.getData();
      }else {
        if (response.data.errors) {
          this.errors = response.data.errors;
        }
        this.$toast.error(response.data.message)
      }
    },
    async deleteRole(id) {
      const response = await repository.deleteRole(id);

      if (response.data.code == 1) {
        //role deleted successfully
        this.$toast.success(response.data.message)
        this.$refs.role_dt.getData();
      } else {
        //role not deleted
        this.$toast.error(response.data.message)
      }
      this.delete_modal = false;
      this.params.id = null;
    },
    clearDataParameters() {
      this.roles_tabs = [];
      this.params = {
        id: null,
        name: "",
        parent_role: null,
        permissions: [],
      };
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        name: [],
        parent_role: [],
        permissions: [],
      };
    },
  },

};
</script>
<style>
#params .v-overlay__content {
  width: 95%;
}
</style>
