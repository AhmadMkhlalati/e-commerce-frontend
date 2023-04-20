<template>
  <v-container style="margin-top: 200px; margin-left: 300px" v-if="isLoading">
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
  <v-row no-gutters v-if="!isLoading">
    <v-col cols="3" md="4" sm="6" class="d-flex align-center">
      <v-sheet class="my-3" v-if="Object.keys(product_headers).length > 0">
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
                <template v-for="(data, index) in product_headers" :key="index">
                  <v-sheet
                    v-if="column_data.includes(index)"
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

  <v-table class="resizeMe" v-if="!isLoading">
    <thead
      :id="theadId"
      v-if="product_headers && Object.keys(product_headers).length > 0"
    >
      <tr>
        <template v-for="(data, key) in product_headers" :key="key">
          <th
            class="text-center"
            v-if="data.is_show && column_data.includes(key)"
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
        <template v-for="(data, key) in product_headers" :key="key">
          <td
            class="text-left"
            v-if="data.is_show && column_data.includes(key)"
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
        <td></td>
      </tr>
    </thead>

    <tbody class="datatable_tbody">
      <template
        v-if="
          data_products.length > 0 && Object.keys(product_headers).length > 0
        "
      >
        <template v-for="(row, index) in data_products" :key="index">
          <tr v-if="index < search.limit" style="height: 50px">
            <template v-for="(cell, i) in row" :key="i">
              <td
                v-if="
                  product_headers[i].is_show &&
                  column_data.includes(product_headers[i].key)
                "
                :style="
                  product_headers[i].key == 'quantity_in_stock' && cell == 0
                    ? 'color:red'
                    : product_headers[i].key == 'quantity_in_stock' && cell != 0
                    ? 'color:green'
                    : ''
                "
                style="text-align: center"
              >
                <template v-if="needsImage.includes(product_headers[i].name)">
                  <img
                    style="max-height: 4rem; height: 4rem"
                    :src="cell"
                    @error="imageNotFound"
                  />
                </template>
                <template v-else>
                  {{
                    product_headers[i].key == "unit_price" && cell > 0
                      ? row.currency_symbol
                      : ""
                  }}
                  {{ cell || cell == 0 ? cell : "-" }}
                </template>
              </td>
            </template>

            <td
              :style="hasImage ? 'height: 5rem !important;' : ''"
              class="align-center"
            >
              <v-btn
                v-if="!SelectedProductsIDs.includes(row.id)"
                class="mr-4"
                size="x-small"
                icon="mdi-plus"
                :disabled="
                  !row.pre_order && row.quantity_in_stock == 0 ? true : false
                "
                :style="
                  !row.pre_order && row.quantity_in_stock == 0
                    ? 'opacity: 0.4'
                    : ''
                "
                @click="
                  [
                    addProductToSelectedProducts(row.id),
                    $emit('editElement', {
                      SelectedProductsIDs,
                      SelectedProducts,
                    }),
                  ]
                "
                color="#b8b8b8"
              ></v-btn>
            </td>
          </tr>
        </template>
      </template>
      <tr v-else>
        <th
          :colspan="column_data.length + 1"
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
    <tfoot v-if="column_data.length > 1">
      <tr>
        <th :colspan="column_data.length + 1">
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
    headersURL: { type: String },
    currency_rate: { type: Number },
    currency_id: { type: Number },
    selectedProducts: { type: Object },
    selectedProductsIDs: { type: Array },
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
        currency_rate: null,
        currency_id: null,
      },
      min_limit: 1,
      max_limit: 10,
      loading: [],
      column_data: [],
      data_products: [],
      product_headers: {},
      SelectedProductsIDs: [],
      SelectedProducts: {},
      isLoading: true,
    };
  },
  methods: {
    async addProductToSelectedProducts(id) {
      if (!this.SelectedProductsIDs.includes(id)) {
        this.SelectedProductsIDs.push(id);
        this.data_products.forEach((element) => {
          if (element.id == id) {
            this.SelectedProducts[String(id)] = element;
          }
        });
      }
    },
    load(i) {
      this.loading[i] = true;
    },
    loadSuccess(i) {
      this.loading[i] = false;
    },
    async getDataWithHeaders() {
      const [header, data] = await Promise.all([
        repository.getDataTable(this.headersURL),
        repository.postDataTable(
          this.pageURL + "?page=" + this.page,
          this.search
        ),
      ]);

      if (!data.data.code) {
        //data handeling
        let decodedData = [...data.data.data];
        this.data_products = Array.from(decodedData);
        this.data_products = Array.from(decodedData);

        //Meta handeling
        this.page = data.data.meta.current_page;
        this.from_page = data.data.meta.from;
        this.last_page = data.data.meta.last_page;

        //headers handeling

        this.product_headers = header.data.data.headers;

        Object.values(this.product_headers).forEach((element) => {
          if (element.is_visible) {
            this.column_data.push(element.key);
          }
        });
        this.pageLength = this.data.length / this.search.limit;

        if (this.data_products.length > 0) {
          this.isLoading = false;
        }
      } else {
        alert(data.data.message);
      }

      this.loader = false;
    },
    async getData() {
      const data = await repository.postDataTable(
        this.pageURL + "?page=" + this.page,
        this.search
      );
      if (!data.data.code) {
        //data handeling
        let decodedData = [...data.data.data];
        this.data_products = Array.from(decodedData);

        //Meta handeling
        this.page = data.data.meta.current_page;
        this.from_page = data.data.meta.from;
        this.last_page = data.data.meta.last_page;

        this.pageLength = this.data_products.length / this.search.limit;
      } else {
        alert(data.data.message);
      }
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
        if (this.needsImage.includes(e.name)) {
          this.hasImage = true;
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
      e.target.src = "https://cdn-icons-png.flaticon.com/512/2748/2748638.png";
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
  },
  async created() {
    this.search.currency_rate = this.currency_rate;
    this.search.currency_id = this.currency_id;
    await this.getDataWithHeaders();
  },
  mounted() {
    this.reizeTableAtMounted();
    this.last_page = Math.ceil(this.data_products.length / this.search.limit);
    this.SelectedProductsIDs = this.selectedProductsIDs;
    this.SelectedProducts = this.selectedProducts;
  },
  watch: {
    dialog(val) {
      this.reizeTable();
    },
    search: {
      handler(newValue, oldValue) {
        this.getData();
      },
      deep: true,
    },
    page(val) {
      this.filterPageRow(this.search.limit);
      this.getData();
    },
  },
  computed: {},
});
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
