<template>
  <v-row no-gutters>
    <v-col cols="3" md="4" sm="6" class="d-flex align-center">
      <v-sheet class="my-3" v-if="Object.keys(setting_headers).length > 0">
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
                <template v-for="(data, index) in setting_headers" :key="index">
                  <v-sheet
                    v-if="column_data.includes(index)"
                    class="ma-2 pa-2"
                    style="flex: 0 31%; flex-basis: 31% max-width:8rem"
                  >
                    <v-checkbox
                      class="bold-text"
                      :label="data.name"
                      v-model="data.isShow"
                      hide-details="auto"
                      @click="changeVisibility(data.isShow)"
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
      <v-text-field
        density="compact"
        variant="underlined"
        label="Search"
        hide-details="auto"
        v-model="search.general_search"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-table class="resizeMe">
    <thead
      :id="theadId"
      v-if="setting_headers && Object.keys(setting_headers).length > 0"
    >
      <tr>
        <template v-for="(data, key) in setting_headers" :key="key">
          <th
            class="text-center"
            v-if="data.isShow && column_data.includes(key)"
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
        <template v-for="(data, key) in setting_headers" :key="key">
          <td class="text-left" v-if="data.isShow && column_data.includes(key)">
            <v-text-field
              v-if="data.search != '' && key == 'title'"
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
          data_settings.length > 0 && Object.keys(setting_headers).length > 0
        "
      >
        <template v-for="(row, index) in data_settings" :key="index">
          <tr v-if="index < search.limit">
            <template v-for="(cell, i) in row" :key="i">
              <td
                v-if="
                  setting_headers[i].isShow &&
                  column_data.includes(setting_headers[i].key)
                "
                style="text-align: center"
              >
                <template v-if="setting_headers[i].name == 'Value'">
                  <template v-if="row.type == 'text' || row.type == 'number'">
                    <v-text-field
                      v-model="data_settings[index].value"
                      :type="row.type"
                      style="min-width: 95px"
                      density="compact"
                      variant="outlined"
                      :rounded="true"
                      hide-details="auto"
                    ></v-text-field>
                  </template>
                  <template v-else-if="row.type == 'checkbox'">
                    <v-switch
                      v-model="data_settings[index].value"
                      :label="cell"
                      color="indigo"
                      hide-details
                    ></v-switch>
                  </template>
                  <template
                    v-else-if="
                      row.type == 'select' || row.type == 'multi-select'
                    "
                  >
                    <v-select
                      :items="data_settings[index].options"
                      item-title="name"
                      item-value="id"
                      label="Select"
                      :multiple="row.type == 'multi-select'"
                      v-model="data_settings[index].value"
                      required
                      density="comfortable"
                      variant="outlined"
                      chips
                    ></v-select>
                  </template>
                  <template v-else> UnKnown Type {{ row.type }} </template>
                </template>
                <template v-else>
                  {{ cell }}
                </template>
              </td>
            </template>

            <td :style="hasImage ? 'height: 5rem !important;' : ''">
              <v-btn
                @click="
                  {
                    $emit('editElement', row['key'], row['value'], row['type']);
                    load(row['key']);
                  }
                "
                class="mx-1"
                variant="outlined"
                size="x-small"
                icon
                color="orange-darken-2"
                :loading="loading[row['key']]"
                :disabled="loading[row['key']]"
              >
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
                <v-icon size="x-small">mdi-pencil</v-icon>
              </v-btn>
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
      },
      min_limit: 1,
      max_limit: 10,
      loading: [],
      column_data: [],
      data_settings: [],
      setting_headers: {},
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
        repository.getDataTable(this.headersURL),
        repository.postDataTable(
          this.pageURL + "?page=" + this.page,
          this.search
        ),
      ]);

      //data handeling
      let decodedData = [...data.data.data];
      this.data_settings = Array.from(decodedData);

      //Meta handeling
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;

      //headers handeling
      this.setting_headers = header.data.data.headers;
      this.column_data = header.data.data.column_data;
      this.pageLength = this.data.length / this.search.limit;
      this.loader = false;
    },
    async getData() {
      const data = await repository.postDataTable(
        this.pageURL + "?page=" + this.page,
        this.search
      );

      //data handeling
      let decodedData = [...data.data.data];
      this.data_settings = Array.from(decodedData);

      //Meta handeling
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;
      this.pageLength = this.data_settings.length / this.search.limit;
    },

    mergeHeaderInData(keys, header) {
      let source = Array.from(header);
      let data_items = {};
      source.forEach((e, i) => {
        data_items[keys[i]] = {
          isShow: true,
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
    changeVisibility(data_isShow) {
      data_isShow = !data_isShow;
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
  created() {
    this.getDataWithHeaders();
  },
  mounted() {
    this.reizeTableAtMounted();
    this.last_page = Math.ceil(this.data_settings.length / this.search.limit);
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
