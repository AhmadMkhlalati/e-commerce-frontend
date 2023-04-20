<template>
  <v-row no-gutters>
    <v-col cols="2" class="d-flex align-center mb-3">
      <v-sheet v-if="Object.keys(data_items).length > 0">
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
            <!-- <v-card-title>Change column visibility</v-card-title>
                    <v-divider></v-divider> -->
            <v-card-text>
              <v-sheet style="display: flex; flex-wrap: wrap">
                <template v-for="(data, index) in data_items" :key="index">
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
      <v-text-field
        density="compact"
        variant="underlined"
        label="Search"
        hide-details="auto"
        v-debounce:500ms="getData" 
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
              word-wrap: break-word;
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
            <v-select
              v-if="data.search == 'select' "
              v-model="search.data[key]"
              :items="data.keys"
              item-title="name"
              item-value="value"
              :label="data.name"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
            <v-text-field
              v-else-if="data.search != ''"
              v-model="search.data[key]"
              style="min-width: 70px"
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
        v-if="data.length > 0 && Object.keys(data_items).length > 0 && !loading"
      >
        <template v-for="(row, index) in data" :key="index">
          <tr v-if="index < search.limit">
            <!-- <td>
              <v-checkbox
                v-model="product_selected"
                :value="row.id"
                hide-details="auto"
              ></v-checkbox>
            </td> -->
            <template v-for="(cell, i) in row" :key="i">
              <template v-if="data_items[i].is_show">
                <td
                  v-if="needsImage.includes(data_items[i].name)"
                  style="text-align: center"
                >
                  <img
                    style="height: 45px"
                    src="https://cdn-icons-png.flaticon.com/512/2748/2748638.png"
                    @error="imageNotFound"
                    class="rounded-circle d-block mx-auto"
                  />
                </td>
                <td
                  v-else-if="i == 'website_status'"
                  style="
                    text-align: center;
                    min-width: 5rem !important;
                    word-wrap: break-word;
                  "
                >
                  <template
                    style="
                      display: inherit !important;
                      min-width: 5rem !important;
                      width: 7rem !important;
                    "
                  >
                    <v-chip
                      :color="
                        cell == 'published'
                          ? 'green'
                          : cell == 'draft'
                          ? 'red'
                          : 'blue'
                      "
                      style="margin-right: '0.5rem;border-radius: 1.9rem;display: inline !important; padding-top:0 !important"
                      >{{ cell }}</v-chip
                    >
                  </template>
                </td>
                <td
                  v-else-if="i == 'categories'"
                  style="
                    text-align: center;
                    min-width: 5rem !important;
                    word-wrap: break-word;
                  "
                >
                  <template
                    style="
                      display: inherit !important;
                      min-width: 5rem !important;
                      width: 7rem !important;
                    "
                  >
                    <v-chip
                      style="margin-right: '0.5rem;border-radius: 1.9rem;display: inline !important; padding-top:0 !important"
                      >{{ cell }}</v-chip
                    >
                  </template>
                </td>
                <td
                  v-else-if="i == 'tags'"
                  style="
                    text-align: center;
                    min-width: 5rem !important;
                    word-wrap: break-word;
                  "
                >
                  <template
                    v-if="typeof cell != 'string'"
                    v-for="(tag, tagIndex) in cell"
                    :key="tagIndex"
                    style="display: inherit !important"
                  >
                    <v-chip
                      :label="tag.name"
                      class="tag-chip"
                      style="margin-right: '0.5rem;border-radius: 1.9rem; display: inline-block !important;"
                      >{{ tag.name }}</v-chip
                    >
                  </template>
                  <template v-else>
                    {{ cell }}
                  </template>
                </td>
                <td
                  v-else
                  style="
                    text-align: center;
                    max-width: 0.6rem !important;
                    word-wrap: break-word;
                  "
                >
                  {{ cell ? cell : "-" }}
                </td>
              </template>
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
            </td>
          </tr>
        </template>
      </template>
      <template v-else-if="loading">
        <tr>
          <th
            :colspan="header.length + 2"
            style="
              text-align: center;
              font-size: 21px;
              font-weight: initial;
              color: gray;
            "
          >
            <v-progress-linear indeterminate color="black"></v-progress-linear>
            Data Loading ....
          </th>
        </tr>
      </template>
      <tr v-else>
        <th
          :colspan="header.length + 2"
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
        <th :colspan="header.length + 2">
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
// import cloneDeep from 'lodash/cloneDeep';
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
      loading: false,
      actions: ["Delete", "Disable", "Enable"],
      action_type: "",
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
      page: 1,
      neededActions: ["delete", "update"],
      needsImage: ["Flag", "Image", "Icon"],
      search: {
        limit: 10,
        general_search: "",
        data: {},
      },
      product_selected: [],
    };
  },
  methods: {
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
      this.data = Array.from(decodedData);

      //Meta handeling
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;

      //headers handeling
      let keys = Object.keys(header.data.data.headers);
      Object.values(header.data.data.headers).forEach((val) =>
        this.header.push(val)
      );
      this.mergeHeaderInData(keys, this.header);

      this.pageLength = this.data.length / this.search.limit;
      this.loader = false;
    },

    async getData() {
      this.loading = true;
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const data = await repository.postDataTable(
        this.pageURL + "?page=" + this.page,
        this.search
      );

      //data handeling
      let decodedData = [...data.data.data];
      this.data = Array.from(decodedData);

      //Meta handeling
      this.page = data.data.meta.current_page;
      this.from_page = data.data.meta.from;
      this.last_page = data.data.meta.last_page;

      this.pageLength = this.data.length / this.search.limit;
      this.loading = false;
      this.loader = false;
    },

    mergeHeaderInData(keys, header) {
      let source = Array.from(header);
      let data_items = {};

      source.forEach((e, i) => {
        data_items[keys[i]] = {
          is_show: true,
          name: e.name,
          search: e.search,
          keys:e.keys,
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
      });
    },

    changeVisibility(data_is_show) {
      data_is_show = !data_is_show;
    },

    imageNotFound(e) {
      e.target.src = "https://cdn-icons-png.flaticon.com/512/2748/2748638.png";
    },
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
    search: {
      handler(newValue, oldValue) {
        this.getData();
      },
      deep: true,
    },
    page(val) {
      this.getData();
    },
  },
  computed: {},
});
</script>

<style>
.v-theme--light.v-table .v-table__wrapper > table > tbody > tr td,
.v-table .v-table__wrapper > table > tbody > tr th,
.v-table > .v-table__wrapper > table > thead > tr > td {
  border-bottom: none !important;
  padding: 3px 5px !important;
}

.v-chip.v-chip--variant-tonal {
  padding-top: 0.3rem !important;
}

.v-table {
  border-radius: 16px !important;
  border: 1px solid #e0e0e0 !important;
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
</style>
