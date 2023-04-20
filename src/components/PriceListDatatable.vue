<template>
  <template v-if="!isLoading">
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </template>
  <template v-else>
    <v-row no-gutters class="mb-3">
      <v-col cols="3" md="4" sm="6" class="d-flex align-center">
        <v-sheet class="mr-3" v-if="Object.keys(price_list_headers).length > 0">
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
            <v-card>
              <v-card-text>
                <v-sheet style="display: flex; flex-wrap: wrap">
                  <template
                    v-for="(data, index) in price_list_headers"
                    :key="index"
                  >
                    <v-sheet
                      class="ma-2 pa-2"
                      style="flex: 0 31%; flex-basis: 31% max-width:8rem"
                    >
                      <v-checkbox
                        class="bold-text"
                        :label="data.name"
                        v-model="data.is_show"
                        hide-details="auto"
                        @click="changeVisibility(data.is_show)"
                      ></v-checkbox>
                    </v-sheet>
                  </template>
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
        <v-sheet class="d-flex align-center" style="width: 60px">
          <v-select
            class="page-limit-select"
            :items="dataPerPage"
            density="compact"
            v-model="search.limit"
            hide-details="auto"
            variant="outlined"
          ></v-select>
        </v-sheet>
      </v-col>
      <v-col cols="3" class="ml-auto search-field">
        <!-- <v-sheet class="my-3"> -->
        <v-text-field
          density="compact"
          variant="underlined"
          label="Search"
          hide-details="auto"
          v-model="search.general_search"
        ></v-text-field>
        <!-- </v-sheet> -->
      </v-col>
    </v-row>
    <!-- loader -->

    <v-table class="resizeMe">
      <thead
        :id="theadId"
        v-if="price_list_headers && Object.keys(price_list_headers).length > 0"
      >
        <tr>
          <template v-for="(data, key) in price_list_headers" :key="key">
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
        </tr>
        <tr>
          <template v-for="(data, key) in price_list_headers" :key="key">
            <td
              class="text-left"
              v-if="data.is_show && Object.keys(data_price_list).length > 0"
            >
              <v-text-field
                v-if="data.search != ''"
                v-model="search.data[key]"
                style="min-width: 95px"
                density="compact"
                placeholder="Search"
                variant="outlined"
                :rounded="true"
                hide-details="auto"
                class="search_column"
              ></v-text-field>
            </td>
          </template>
        </tr>
      </thead>

      <tbody class="datatable_tbody">
        <template
          v-if="
            data_price_list.length > 0 &&
            Object.keys(price_list_headers).length > 0
          "
        >
          <template v-for="(row, index) in data_price_list" :key="index">
            <tr v-if="index < search.limit">
              <template v-for="(cell, i) in row" :key="i">
                <td
                  v-if="price_list_headers[i].is_show"
                  style="text-align: center"
                >
                  <template v-if="cell.price != undefined">
                    <v-text-field
                      v-model="cell.price"
                      type="number"
                      style="min-width: 95px"
                      density="compact"
                      variant="outlined"
                      :rounded="true"
                      hide-details="auto"
                      :disabled="cell.is_virtual"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    {{ cell }}
                  </template>
                </td>
              </template>
            </tr>
          </template>
        </template>
        <tr v-else>
          <th
            :colspan="Object.keys(price_list_headers).length"
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
      <tfoot v-if="data_price_list.length > 1">
        <tr>
          <th :colspan="Object.keys(price_list_headers).length">
            <div style="display: flex; float: right; margin-right: 5px">
              <v-pagination
                class="text-right"
                v-model="page"
                :length="last_page"
                rounded="circle"
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
                ></v-text-field>
              </div>
            </div>
          </th>
        </tr>
      </tfoot>
    </v-table>
  </template>
</template>

<script>
import { defineComponent } from "vue";
import draggable from "vuedraggable";
import repository from "@/api/repository";
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "datatableView",
  props: {
    pageURL: { type: String },
    advancedSearch: { type: Object },
    headersURL: { type: String },
    theadId: {
      type: String,
      default: "",
    },
  },
  components: {
    draggable,
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
      isLoading: false,
      page: 1,
      from_page: null,
      last_page: null,
      perPage: [5, 10, 25, 50],
      number: 1,
      dataPage: null,
      dataPerPage: [5, 10, 20, 50],
      dialogm1: "",
      dialog: false,
      data_items: {},
      data: [],
      header: [],
      headers: [],
      pageLength: 1,
      dataPageLength: 10,
      neededActions: ["delete", "update"],
      needsImage: ["Flag", "Image"],
      hasImage: false,
      search: {
        limit: 10,
        general_search: "",
        data: {},
        advanced_search: {},
      },
      min_limit: 1,
      max_limit: 10,
      loading: [],

      data_price_list: [],
      price_list_headers: {},
    };
  },
  methods: {
    load(i) {
      this.loading[i] = true;
    },
    loadSuccess(i) {
      this.loading[i] = false;
    },
    async getDataWithHeaders() {
      const [header, data] = await Promise.all([
        repository.postHeaderDataTable(
          this.headersURL,
          this.search.advanced_search
        ),
        repository.postDataTable(
          this.pageURL + "?page=" + this.page,
          this.search
        ),
      ]);
      if (data.data.data.length > 0) {
        //data handeling
        let decodedData = [...data.data.data];
        this.data_price_list = Array.from(decodedData);

        //Meta handeling
        this.page = data.data.meta.current_page;
        this.from_page = data.data.meta.from;
        this.last_page = data.data.meta.last_page;
      }

      this.price_list_headers = header.data.data.headers;
      this.pageLength = this.data.length / this.search.limit;
      this.loader = false;
      this.isLoading = true;
    },
    async getData() {
      const data = await repository.postDataTable(
        this.pageURL + "?page=" + this.page,
        this.search
      );

      //Meta handeling
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;
      this.pageLength = this.data_price_list.length / this.search.limit;
    },

    reizeTable() {
      const createResizableTable = function (table, table_height) {
        const cols = table.querySelectorAll("th");
        [].forEach.call(cols, function (col) {
          const resizer = document.createElement("div");
          resizer.classList.add("resizer");
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

    filterPageRow(val) {
      if (this.page > 1) {
        this.min_limit = val * (this.page - 1) + 1;
        this.max_limit = this.page * val;
      } else {
        this.max_limit = val;
        this.min_limit = 1;
      }
    },

    async updatePrices() {
      var params = {
        data: this.data_price_list,
      };
      var response = await repository.updatePriceList(params);
      return response;
    },

    refreshDataTable(value){
      this.data_price_list = {};
      this.search.advanced_search = value;
      this.isLoading = false;
    },
  },
  created() {
    this.loader = false;
    this.isLoading = true;
  },
  mounted() {
    this.reizeTableAtMounted();
    this.last_page = Math.ceil(this.data_price_list.length / this.search.limit);
  },
  watch: {
    dialog(val) {
      this.reizeTable();
    },
    search: {
      async handler(newValue, oldValue) {
        await this.getDataWithHeaders();
      },
      deep: true,
    },

    page(val) {
      this.filterPageRow(this.search.limit);
      this.getDataWithHeaders();
    },
  },
});
</script>