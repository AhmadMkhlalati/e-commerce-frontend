<template>
  <v-row no-gutters class="mb-3">
    <v-col cols="3" md="4" sm="6" class="d-flex align-center">
      <v-sheet class="mr-3" v-if="Object.keys(data_items).length > 0">
        <!-- Coloumns Display Modal -->
        <v-dialog v-model="dialog" scrollable>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              :icon="dialog ? 'mdi-eye-off' : 'mdi-eye'"
              style="font-size: 1rem"
            >
            </v-btn>
          </template>
          <v-card class="pa-0">
            <v-card-text class="pt-2 pb-1 ps-2 pe-5">
              <v-sheet>
                <v-sheet
                  v-for="(data, index) in data_items"
                  :key="index"
                >
                  <v-checkbox
                    class="bold-text"
                    :label="data.name"
                    v-model="data.is_show"
                    hide-details="auto"
                    @click="changeVisibility(data.is_show)"
                  ></v-checkbox>
                </v-sheet>
              </v-sheet>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="grey-darken-1" text @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>

      <v-sheet class="d-flex align-center justify-center" style="width: 50px">
        <v-select
          class="page-limit-select text-center"
          :items="dataPerPage"
          density="compact"
          v-model="search.limit"
          hide-details="auto"
          variant="outlined"
          @update:modelValue="limitData"
        ></v-select>
      </v-sheet>
    </v-col>
    <v-col cols="3" class="ml-auto search-field">
      <v-text-field
        density="compact"
        variant="underlined"
        label="Search"
        hide-details="auto"
        v-debounce:500ms="searchData" 
        debounce-events="update"
        v-model="search.general_search"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-table class="resizeMe">
    <thead
      :id="theadId"
      v-if="data_items && Object.keys(data_items).length > 0"
    >
      <tr>
        <template v-for="(data, key) in data_items" :key="key">
          <th
            class="text-center"
            v-if="data.is_show"
            style="
              position: relative;
              font-size: 1rem;
              font-family: 'Poppins-Bold', Roboto, sans-serif !important;
            "
          >
            {{ data.name }}
          </th>
        </template>
        <th
          class="text-center"
          style="
            position: relative;
            font-size: 1rem;
            font-family: 'Poppins-Bold', Roboto, sans-serif !important;
          "
        >
          Actions
        </th>
      </tr>
      <tr>
        <template v-for="(data, key) in data_items" :key="key">
          <td class="text-left" v-if="data.is_show">
            <v-text-field
              v-if="data.search != ''"
              v-model="search.data[key]"
              style="min-width: 95px"
              density="compact"
              placeholder="Search"
              variant="outlined"
              :rounded="true"
              :loading="searchLoding"
              v-debounce:500ms="searchData" 
              debounce-events="update"
              hide-details="auto"
              class="search_column"
            ></v-text-field>
          </td>
        </template>
        <td></td>
      </tr>
    </thead>

    <tbody class="datatable_tbody">
      <template v-if="data.length > 0 && Object.keys(data_items).length > 0">
        <template v-for="(row, index) in data" :key="index">
          <tr v-if="index < search.limit">
            <template v-for="(cell, i) in row" :key="i">
              <td v-if="data_items[i].is_show" class="text-center">
                <template v-if="needsImage.includes(data_items[i].name)">
                  <img
                    style="height: 45px"
                    :src="cell"
                    @error="imageNotFound"
                    class="rounded-circle d-block mx-auto"
                  />
                </template>
                <template v-else>
                  {{ cell ? cell : "-" }}
                </template>
              </td>
            </template>

            <td class="text-center">
              <v-btn
                @click="$emit('editElement', row['id'])"
                class="mx-1"
                variant="outlined"
                size="x-small"
                icon
                color="orange-darken-2"
              >
                <v-icon size="x-small">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                @click="$emit('deleteElement', row['id'])"
                class="mx-1"
                variant="outlined"
                size="x-small"
                icon
                color="red-darken-2"
              >
                <v-icon size="x-small">mdi-delete</v-icon>
              </v-btn>
              <!-- <v-btn
                v-if="activeElementShow"
                @click="$emit('activateElement', row['id'])"
                class="mx-1"
                variant="outlined"
                size="x-small"
                icon
                color="primary"
              >
                <v-icon size="x-small">mdi-list-status</v-icon>
              </v-btn> -->
            </td>
          </tr>
        </template>
      </template>
      <tr v-else>
        <th
          :colspan="header.length + 1"
          style="
            text-align: center;
            font-size: 21px;
            font-weight: initial;
            color: gray;
          "
        >
          No Data Found
        </th>
      </tr>
    </tbody>
    
    <tfoot v-if="header.length > 1">
      <tr>
        <th :colspan="header.length + 1">
          <div class="d-flex">
            <v-pagination
            class="mx-auto"
              v-model="page"
              :length="last_page"
              :total-visible="5"
              rounded="circle"
              @update:modelValue="paginateData"
            >
            </v-pagination>
            <div style="width: 70px; margin-top: 9px">
              <v-text-field
                density="compact"
                v-model="page"
                variant="outlined"
                hide-details="auto"
                type="number"
                step="any"
                min="1"
                :max="last_page"
                v-model.number="page"
                @update:modelValue="paginateData"
              ></v-text-field>
            </div>
          </div>
        </th>
      </tr>
    </tfoot>
  </v-table>
</template>

<script>
import { defineComponent } from "vue";
import repository from "@/api/repository";
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "datatableView",
  props: {
    pageURL: { type: String },
    headersURL: { type: String },
    theadId: {
      type: String,
      default: "",
    },

    activeElementShow:{
      type:Boolean,
      default:true
    }
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
      page: 1,
      from_page: null,
      last_page: null,
      dataPerPage: [5, 10, 15, 50],
      dialog: false,
      data_items: {},
      data: [],
      header: [],
      headers: [],
      pageLength: 1,
      page: 1,
      neededActions: ["delete", "update"],
      needsImage: ["Flag", "Image", "Icon"],
      searchLoding : false,
      search: {
        limit: 5,
        general_search: "",
        data: {},
      },
    };
  },

  methods: {
    async getDataWithHeaders() {
      const [header, data] = await Promise.all([
        repository.getDataTable(this.headersURL),
        repository.postDataTable(this.pageURL + "?page=" + this.page,this.search)
      ]);
  
      let decodedData = [...data.data.data];
      this.data = Array.from(decodedData);
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;
      this.pageLength = this.data.length / this.search.limit;
      let keys = Object.keys(header.data.data.headers);
      Object.values(header.data.data.headers).forEach((val) =>
        this.header.push(val)
      );
      this.mergeHeaderInData(keys, this.header);
      this.loader = false;
    },

    async getData() {
      const data = await repository.postDataTable(this.pageURL + "?page=" + this.page,this.search);
      let decodedData = [...data.data.data];
      this.data = Array.from(decodedData);
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;
      this.pageLength = this.data.length / this.search.limit;
    },

    getHeadersFromObject(data) {
      let headers = [];
      Object.keys(data).forEach((e) => {
        headers.push(e);
      });

      return headers;
    },

    mergeHeaderInData(keys, header) {
      let source = Array.from(header);
      let data_items = {};

      source.forEach((e, i) => {
        data_items[keys[i]] = {
          is_show: true,
          name: e.name,
          search: e.search,
          sort: e.sort,
        };
        if (e.search != "") {
          this.search.data[keys[i]] = "";
        }
      });

      this.data_items = data_items;
    },

    reizeTable() {
      const createResizableTable = function (table, table_height) {
        const cols = table.querySelectorAll("th");
        [].forEach.call(cols, function (col) {
          // Add a resizer element to the column
          const resizer = document.createElement("div");
          resizer.classList.add("resizer");
          // Set the height
          resizer.style.height = `${table_height.offsetHeight}px`;
          col.appendChild(resizer);
          createResizableColumn(col, resizer);
        });
      };

      const createResizableColumn = function (col, resizer) {
        let x = 0;
        let w = 0;

        const mouseDownHandler = function (e) {
          x = e.clientX;

          const styles = window.getComputedStyle(col);
          w = parseInt(styles.width, 10);

          document.addEventListener("mousemove", mouseMoveHandler);
          document.addEventListener("mouseup", mouseUpHandler);

          resizer.classList.add("resizing");
        };

        const mouseMoveHandler = function (e) {
          const dx = e.clientX - x;
          col.style.width = `${w + dx}px`;
        };

        const mouseUpHandler = function () {
          resizer.classList.remove("resizing");
          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
        };

        resizer.addEventListener("mousedown", mouseDownHandler);
      };
      var element = document.getElementById(this.theadId);

      createResizableTable(element, element.parentElement);
    },

    reizeTableAtMounted() {
      document.addEventListener("DOMContentLoaded", () => {
        const createResizableTable = function (table, table_height) {
          const cols = table.querySelectorAll("th");
          [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement("div");
            resizer.classList.add("resizer");

            // Set the height
            resizer.style.height = `${table_height.offsetHeight}px`;
            col.appendChild(resizer);
            createResizableColumn(col, resizer);
          });
        };

        const createResizableColumn = function (col, resizer) {
          let x = 0;
          let w = 0;

          const mouseDownHandler = function (e) {
            x = e.clientX;

            const styles = window.getComputedStyle(col);
            w = parseInt(styles.width, 10);

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);

            resizer.classList.add("resizing");
          };

          const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            col.style.width = `${w + dx}px`;
          };

          const mouseUpHandler = function () {
            resizer.classList.remove("resizing");
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
          };

          resizer.addEventListener("mousedown", mouseDownHandler);
        };

        var element = document.getElementById(this.theadId);
        createResizableTable(element, element.parentElement);
      });
    },

    changeVisibility(data_is_show) {
      data_is_show = !data_is_show;
    },

    imageNotFound(e) {
      e.target.src = "https://via.placeholder.com/1200/eb5454/ffffff/?text=image";
    },

    async searchData() {
      this.searchLoding = true
      await this.getData()
      this.searchLoding = false
    },

    async paginateData(value) {
      this.loader = true
      this.page = value
      await this.getData()
      this.loader = false
    },

    async limitData(value) {
      this.page =1
      this.loader = true
      this.search.limit = value
      await this.getData()
      this.loader = false
    }
  },

  created() {
    this.getDataWithHeaders();
  },

  mounted() {
    this.reizeTableAtMounted();
  },

  watch: {
    dialog(val) {
      this.reizeTable();
    },
  },
});
</script>

<style lang="scss">
.search-field {
  .v-label.v-field-label {
    transform: translateY(-10px) !important;
  }
}
.search_column {
  .v-field__input {
    height: 2rem !important;
  }
  input {
    font-size: 0.8rem !important;
    height: 2rem !important;
    max-height: 2rem !important;
    line-height: 1rem;
    text-align: center;
    padding: 0 !important;
  }
  input:focus::placeholder {
    color: transparent;
  }
}

.bold-text {
  .v-selection-control--inline .v-label {
    font-weight: bolder;
    color: #101010 !important;
  }
}

.page-limit-select {
  .v-field__append-inner {
    transform: translateX(10px);
  }
  .v-field__outline {
    height: 2rem !important;
    max-height: 2rem !important;
    transform: translateY(5px);
  }
}

.v-table {
  border-radius: 16px !important;
}

.v-theme--light tr:nth-child(even) {
  background: #fff !important;
}

.v-theme--light tr:nth-child(odd) {
  background: #f9f9f9 !important;
}

.v-select .v-field .v-field__input > input {
  display: none;
}

.v-checkbox .v-selection-control {
  height: 50px !important;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  cursor: col-resize;
  user-select: none;
  color: red;
}

.v-dialog--scrollable .v-overlay__content > .v-card{
  width: max-content;
}
</style>