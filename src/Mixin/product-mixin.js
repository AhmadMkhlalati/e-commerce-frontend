import { uploadImageBase64 } from "../util/helper";
import { QuillEditor } from "@vueup/vue-quill";
import UploadImages from "vue-upload-drop-images";
import repository from "@/api/repository";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";
export default {
  components: {
    UploadImages,
    QuillEditor,
    Tree,
  },

  data() {
    return {
      uploadImageBase64,
      is_default_child:{
        status:false,
        index:''
      },
      add_product: false,
      create_product_errors: [],
      titleTab: "en",
      product_type: "",
      descriptionTab: "en",
      varDescriptionTab: "en",
      select_all_variants: [],
      errors: {
        "name.en": "",
        "name.ar": "",
        sku: "",
        summary: "",
        specification: "",
        barcode: "",
        length: "",
        height: "",
        width: "",
        weight: "",
        brand_id: "",
        tax_id: "",
        description: "",

        code: "",
        type: "",
        category_id: "",
        unit_id: "",
        products_statuses_id: "",
        slug: "",
        required_fields: [],
      },
      product: {
        name: {
          en: "",
          ar: "",
        },
        summary: {},
        description: {
          en: "",
          ar: "",
        },
        specification: {
          en: "",
          ar: "",
        },
        meta_title: {
          en: "",
          ar: "",
        },
        meta_description: {
          en: "",
          ar: "",
        },
        meta_keyword: {
          en: "",
          ar: "",
        },
        images: [],
        slug: "https://cms.com/product/",
        code: null,
        type: "normal",
        quantity: null,
        minimum_quantity: null,
        reserved_quantity: null,
        barcode: null,
        website_status: "draft",
        category_id: null,
        unit_id: null,
        tax_id: null,
        labels: [],
        tags: [],
        prices: [],
        products_statuses_id: null,
        is_default_child: false,
        pre_order: false,
        is_show_related_product: 0,
        bundle_price_status: "default",
        attributes_fields: [],
        related_products: [],
        images_deleted: [],
      },
      product_initial: {
        name: {
          en: "",
          ar: "",
        },
        summary: {},
        description: {
          en: "",
          ar: "",
        },
        specification: {
          en: "",
          ar: "",
        },
        meta_title: {
          en: "",
          ar: "",
        },
        meta_description: {
          en: "",
          ar: "",
        },
        meta_keyword: {
          en: "",
          ar: "",
        },
        images: [],
        slug: "https://cms.com/product/",
        code: null,
        type: "normal",
        quantity: 0,
        minimum_quantity: 0,
        reserved_quantity: 0,
        barcode: null,
        website_status: "draft",
        category_id: null,
        unit_id: null,
        tax_id: null,
        labels: [],
        tags: [],
        prices: [],
        products_statuses_id: null,
        is_default_child: false,
        pre_order: false,
        is_show_related_product: 0,
        bundle_price_status: "default",
        attributes_fields: [],
        related_products: [],
        images_deleted: [],
      },
      storedProducts: [],
      storedProductsSearch: {
        limit: 10,
        category: "",
        product_name: "",
      },
      bundleProductsIDs: [],
      bundleProducts: {},
      pricing_list: {},
      bundles_pricing_list_ids: [],
      bundlePricingStatus: "default",
      varientProducts: [],
      categories: [],
      categories_list: [],
      statuses: [
        {
          value: "draft",
          name: "Draft",
        },
        {
          value: "pending_review",
          name: "Pending Review",
        },
        {
          value: "published",
          name: "Published",
        },
      ],
      types: ["normal", "variable", "bundle", "service"],
      units: [],
      taxes: [],
      brands: [],
      labels: [],
      tags: [],
      prices: [],
      prices_original: [],
      required_fields: [],
      unrequired_fields: [],
      fields: [],
      object_fields: {},
      product_status: [],
      options: {
        debug: "info",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
          ],
        },
        placeholder: "Write...",
        theme: "snow",
      },
      isDataTable: false,
      dialog: false,
      newTag: null,
      date: null,
      trip: {
        name: "",
        location: null,
        start: null,
        end: null,
      },
      status_name: "",
      label_name: "",
      product_title: "",
      tab: "general",
      price: null,
      discounted_price: null,
      cost_per_item: null,
      permalink: "https://cms.com/product/",
      edit_permalink: false,
      missing_data: {
        prices: {
          path: "ClassPrice",
          name: "pricing",
          title: "Pricing",
        },
        fields: {
          path: "Fields",
          name: "ields",
          title: "Fields",
        },
        attributes_fields: {
          path: "Fields",
          name: "attributes",
          title: "Attributes",
        },
        labels: {
          path: "Labels",
          name: "labels",
          title: "Labels",
        },
        tags: {
          path: "Tags",
          name: "tags",
          title: "Tags",
        },
        units: {
          path: "Units",
          name: "units",
          title: "Units",
        },
        taxes: {
          path: "Taxes",
          name: "taxes",
          title: "Taxes",
        },
        categories: {
          path: "Categories",
          name: "categories",
          title: "Categories",
        },
        statuses: {
          path: null,
          name: "product statuses",
          title: "Statuses",
        },
        nested_categories: {
          path: "Categories",
          name: "categories",
          title: "Categories",
        },
        default_pricing_class: {
          path: "Settings",
          name: "default pricing class",
          title: "Default Price",
        },
      },
      panel: {
        missing: [0],
        title: [0],
        setup: [0],
        media: [0],
        description: [0],
        category: [0],
        label: [0],
        status: [0],
        pricing: [0],
        tag: [0],
      },
      imgs_files: [],
      img_file: null,
      specification_editor: "",
      open: true,
      attributes_original: [],
      attributes: [],
      attributes_obj: {},
      attributes_selected_ids: [null],
      attributes_unselected_ids: [],
      products: [],
      product_variations: [],
      max_variables: 0,
      selected_unit: "Piece",
      errorsTab:{
        general:false,
        shipping:false,
        inventory:false,
        attributes:false,
        variants:false,
        bundle_management:false,
        bundle_pricing:false,

      }
    };
  },
  methods: {
    async addProductToVariations() {
      const code = await repository.getUniqueCode();
      if (this.product_variations.length < this.max_variables) {
        let o = {
          code: code.data,
          image: "",
          description: { en: "", ar: "" },
          specification: { en: "", ar: "" },
          labels: [],
          fields: [],
          attributes_fields: [],
          prices: JSON.parse(JSON.stringify(this.prices_original)),
          potential_fields: {},
          quantity: 0,
          reserved_quantity: 0,
          minimum_quantity: 0,
          height: 0,
          length: 0,
          width: 0,
          images_deleted: [],
        };
        this.attributes_selected_ids.forEach((id) => {
          o.potential_fields[id] = {
            field_id: id,
            is_attribute: true,
            type: "select",
            value: null,
          };
        });
        this.product_variations.push(o);
      }
    },
    deleteProductFromVariations(index) {
      if (this.product_variations.length > 1) {
        this.product_variations.splice(index, 1);
      }
    },
    openAddProductModal() {
      this.add_product = true;
    },
    addAttribute(index) {
      this.attributes_selected_ids.splice(index + 1, 0, null);
    },
    deleteOptionAttribute: function (index, id) {
      this.removeItemOnceFromSelectedAttributes(id);
      this.attributes_unselected_ids.push(id);
    },
    async getProducts() {
      const response = await repository.getProducts(this.storedProductsSearch);
      if (response.data.data.products.length > 0) {
        this.storedProducts = response.data.data.products;
      } else {
        alert("no product stored");
      }
    },
    
    async addProductToBundule(id) {
      if (!this.bundleProductsIDs.includes(id)) {
        this.bundleProductsIDs.push(id);
        this.storedProducts.forEach((element) => {
          if (element.id == id) {
            this.bundleProducts[id] = element;
          }
        });
      }
    },
    async getProductData() {
      var is_update = this.$router.currentRoute._value.name == "EditProduct";

      const [response, product] = await Promise.all([
        repository.getProductData(),
        is_update ? repository.getSpecificProduct(this.$route.params.id) : [],
      ]);
      if(!is_update){
      const code = await repository.getUniqueCode();
        this.product.code = code.data;}

      if (response.data.code == 1) {
        this.categories_list = response.data.data.categories;
        this.product.categories = response.data.data.nested_categories;
        this.units = response.data.data.units;
        this.labels = response.data.data.labels;
        this.brands = response.data.data.brands;
        this.taxes = response.data.data.taxes;
        this.tags = response.data.data.tags;
        this.attributes_fields = response.data.data.attributes_fields;
        this.product_status = response.data.data.statuses;
       
        
        Object.keys(response.data.data).forEach((item) => {
          if (
            response.data.data[item] == null ||
            response.data.data[item] == "-" ||
            response.data.data[item].length == 0
          ) {
            console.log(item);
            this.create_product_errors.push({
              message:
                item == "statuses"
                  ? "you should call support to create " +
                    this.missing_data[item].name +
                    " befor create Product"
                  : "you should create " +
                    this.missing_data[item].name +
                    " befor create Product",
              title: this.missing_data[item].title,
              link: this.missing_data[item].path,
            });
          }
        });
        if (response.data.data.prices.length > 0) {
          response.data.data.prices.forEach((element) => {
            this.pricing_list[element.id] = element;

            this.prices.push({
              id:null,
              price_id: element.id,
              name: element.name,
              currency: element.currency,
              price: null,
              discounted_price: null,
            });
            this.prices_original = this.prices;
          });
        }
        if (response.data.data.fields.length > 0) {
          let arr = {};
          response.data.data.fields.forEach((element) => {
            arr[element.id] = element;
            if (element.type == "text" || element.type == "textarea") {
              arr[element.id].value = {
                ar: "",
                en: "",
              };
            } else {
              arr[element.id].value = null;
            }
            let field_ob = {
              id: element.id,
              title: element.title,
              type: element.type,
            };

            if (element.is_required == 1) {
              this.required_fields.push(field_ob);
              this.errors.required_fields[field_ob.id] = "";
            } else {
              this.unrequired_fields.push(field_ob);
            }
          });

          this.object_fields = arr;
        }

        if (
          response.data.data.attributes_fields.length > 0 &&
          response.data.data.attributes_fields != "-"
        ) {
          let temp_obj = {};
          response.data.data.attributes_fields.forEach((element) => {
            this.attributes_unselected_ids.push(element.id);
            temp_obj[element.id] = element;
            temp_obj[element.id].used_for_variations = false;
          });
          this.attributes_obj = temp_obj;
        }
      }
      if (is_update) {
        if (product.data.code == 1) {
          this.product_data = product.data.data.product;
        }
      } else {
        this.product.quantity = 0;
        this.product.minimum_quantity = 0;
        this.product.reserved_quantity = 0;
      }
    },
    removeItemOnceFromUnselectedAttributes(value) {
      var index = this.attributes_unselected_ids.indexOf(value);
      if (index > -1) {
        this.attributes_unselected_ids.splice(index, 1);
      }
    },
    async handleVariableMainImage(files, id) {
      if (this.product_variations[id] != undefined) {
        if (files.length > 0) {
          this.product_variations[id]["image"] = await this.uploadImageBase64(
            files
          );
        }
      }
    },
    async handleVariableGalleryImages(files, id) {
      if (this.product_variations[id] != undefined) {
        if (files.length > 0) {
          var base_64_files = await this.uploadImageBase64(
            files,
            files.length > 1
          );
          this.product_variations[id]["images"] = [];
          files.forEach((file, i) => {
            let file_data = {
              id: null,
              image: base_64_files[i],
              title: {
                en: file.name,
                ar: file.name,
              },
              sort: i,
            };
            this.product_variations[id]["images"].push(file_data);
          });
        }
      }
    },
    async handleMainImage(files) {
      this.img_file = await this.uploadImageBase64(files);
    },
    async handleGalleryImages(files) {
      this.imgs_files = await this.uploadImageBase64(files, files.length > 1);
      // this.product.images = [];
      if (files.length > 0) {
        files.forEach((file, i) => {
          let file_data = {
            id: null,
            image: this.imgs_files[i],
            title: {
              en: file.name,
              ar: file.name,
            },
            sort: i,
          };
          this.product.images.push(file_data);
        });
      }
    },
    async create_update_Product(create_one_or_multi = 0) {
      var is_update = this.$router.currentRoute._value.name == "EditProduct";
      is_update ? (this.product._method = "PUT") : "";
      if (this.product.type == "bundle") {
        if (this.bundles_pricing_list_ids.length > 0) {
          this.bundles_pricing_list_ids.forEach((id) => {
            this.product.prices.push({
              id:null,
              price_id: id,
              price: this.pricing_list[id].price,
              discounted_price: this.pricing_list[id].discounted_price,
            });
          });
        }
        if (this.bundleProductsIDs.length > 0) {
          this.bundleProductsIDs.forEach((id) => {
            let b_product = {
              child_product_id: id,
              child_quantity: this.bundleProducts[id].quantity,
              prices: [],
            };
            if (this.bundleProducts[id].nameStatus != undefined) {
              b_product.child_name_status = this.bundleProducts[id].nameStatus;
              if (this.bundleProducts[id].nameStatus == "hide") {
                b_product.name = {
                  en: "",
                  ar: "",
                };
              } else if (this.bundleProducts[id].nameStatus == "default") {
                b_product.name = {
                  en: this.bundleProducts[id].name.en,
                  ar: this.bundleProducts[id].name.ar,
                };
              } else if (this.bundleProducts[id].nameStatus == "custom") {
                if (
                  this.bundleProducts[id].custom_name_en != undefined &&
                  this.bundleProducts[id].custom_name_ar != undefined
                ) {
                  b_product.name = {
                    en: this.bundleProducts[id].custom_name_en,
                    ar: this.bundleProducts[id].custom_name_ar,
                  };
                } else {
                  b_product.name = {
                    en: "",
                    ar: "",
                  };
                }
              } else {
                b_product.name = {
                  en: "",
                  ar: "",
                };
              }
            } else {
            }
            this.bundles_pricing_list_ids.forEach((price) => {
              if (this.bundleProducts[id].prices != undefined) {
                if (
                  this.bundleProducts[id].prices[price] != undefined &&
                  this.bundleProducts[id].prices[price] != null
                ) {
                  b_product["prices"].push({
                    price_id: price,
                    value: parseInt(
                      this.bundleProducts[id].prices[price].price
                    ),
                  });
                } else {
                  b_product["prices"].push({ price_id: price, value: 0 });
                }
              } else {
                b_product["prices"].push({ price_id: price, value: 0 });
              }
            });

            this.product.related_products.push(b_product);
          });

          this.product.bundle_price_status = this.bundlePricingStatus;
        }
      } else if (this.product.type == "variable") {
        let unique_attributes_values = [];
        let unique_attributes_for_element = [];

        this.product_variations.forEach((element, index) => {
          element.is_same_price_as_parent =
            element.is_same_price_as_parent || false;
          element.is_same_dimensions_as_parent =
            element.is_same_dimensions_as_parent || false;
          element.is_default_child = element.is_default_child || false;
          element.attributes_fields = [];

          this.attributes_selected_ids.forEach((id) => {
            if (
              element.potential_fields[id] == undefined ||
              element.potential_fields[id] == null
            ) {
              alert("please select all attributes");
            } else {
              if (element.potential_fields[id].value == null) {
                alert("please select all attributes");
              } else {
                let unique_attribute_for_element =
                  index.toString() +
                  element.potential_fields[id].field_id.toString() +
                  element.potential_fields[id].value.toString();
                if (
                  !unique_attributes_for_element.includes(
                    unique_attribute_for_element
                  )
                ) {
                  unique_attributes_for_element.push(
                    unique_attribute_for_element
                  );
                  element.attributes_fields.push(element.potential_fields[id]);
                }
                let unique_attribute_value =
                  element.potential_fields[id].field_id.toString() +
                  element.potential_fields[id].value.toString();
                if (
                  !unique_attributes_values.includes(unique_attribute_value)
                ) {
                  unique_attributes_values.push(unique_attribute_value);
                  this.product.attributes_fields.push(
                    element.potential_fields[id]
                  );
                }
              }
            }
          });
          if (element.images_deleted.length == 0) {
            element.images_deleted = "";
          }
        });

        this.product.product_variations = this.product_variations;
        this.product.quantity = 0;
        this.product.minimum_quantity = 0;

        if (this.prices.length > 0) {
          let arr = [];
          this.prices.forEach((element) => {
            if (element.price != null && element.price != 0) {
              arr.push(element);
            }
          });
          this.product.prices = arr;
        }
      } else {
        if (this.prices.length > 0) {
          let arr = [];
          this.prices.forEach((element) => {
            if (element.price != null && element.price != 0) {
              arr.push(element);
            }
          });
          this.product.prices = arr;
        }
      }
      if (this.unrequired_fields.length > 0) {
        this.product.fields = [];
        this.unrequired_fields.forEach((element) => {
          if (this.fields.includes(element.id)) {
            let result = {
              field_id: element.id,
              type: this.object_fields[element.id].type,
            };

            if (
              this.object_fields[element.id].type == "text" ||
              this.object_fields[element.id].type == "textarea"
            ) {
              result.value = JSON.stringify(
                this.object_fields[element.id].value
              );
            } else if (
              this.object_fields[element.id].type == "checkbox" &&
              this.object_fields[element.id].value == null
            ) {
              result.value = false;
            } else {
              result.value = this.object_fields[element.id].value;
            }

            this.product["fields"].push(result);
          }
        });
      }

      if (this.required_fields.length > 0) {
        if (this.product.fields == null || this.product.fields == undefined) {
          this.product.fields = [];
        }
        this.required_fields.forEach((element) => {
          let result = {
            field_id: element.id,
            type: element.type,
          };

          if (
            this.object_fields[element.id].type == "text" ||
            this.object_fields[element.id].type == "textarea"
          ) {
            this.errors.required_fields[element.id] = {
              ar: null,
              en: null,
            };
            if (!this.object_fields[element.id].value.ar) {
              this.errors.required_fields[element.id].ar =
                "this field is required";
            } else {
              this.errors.required_fields[element.id].ar = "";
            }
            if (!this.object_fields[element.id].value.en) {
              this.errors.required_fields[element.id].en =
                "this field is required";
            } else {
              this.errors.required_fields[element.id].en = "";
            }
            if (
              this.object_fields[element.id].value.en &&
              this.object_fields[element.id].value.ar
            ) {
              this.errors.required_fields[element.id] = "";
              result.value = JSON.stringify(
                this.object_fields[element.id].value
              );
            }
          } else if (this.object_fields[element.id].type == "select") {
            if (this.object_fields[element.id].value == null) {
              this.errors.required_fields[element.id] =
                "this field is required";
            } else {
              this.errors.required_fields[element.id] = "";
              result.value = this.object_fields[element.id].value;
            }
          } else if (
            this.object_fields[element.id].type == "checkbox" &&
            this.object_fields[element.id].value == null
          ) {
            result.value = false;
          } else if (this.object_fields[element.id].value == null) {
            this.errors.required_fields[element.id] = "this field is required";
          } else {
            this.errors.required_fields[element.id] = "";
            result.value = this.object_fields[element.id].value;
          }
          this.product["fields"].push(result);
        });
      }

      if (this.product.pre_order) this.product.pre_order = 1;
      else this.product.pre_order = 0;

      let data = this.product;

      if (this.product.images_deleted.length == 0) {
        data.images_deleted = "";
      }
      if (
        this.product.images == "undefined" ||
        this.product.images == undefined ||
        this.product.images == null
      ) {
        data.images = "";
      } else {
        if (this.product.images.length > 0) {
          data.images = this.product.images;
        }
      }

      if (
        this.img_file == "undefined" ||
        this.img_file == undefined ||
        this.img_file == null
      ) {
        data.image = "";
      } else {
        data.image = this.img_file;
      }

      try {
        const response = is_update
          ? await repository.updateProduct(this.product_data.id, data)
          : await repository.createProduct(data);

        this.product.related_products = [];
        this.product.fields = [];
        this.product.prices = [];
        this.product.attributes_fields = [];

        if (this.product.type == "variable") {
          this.product.product_variations = [];
          this.product_variations.forEach((p) => {
            p.attributes_fields = [];
          });
        }
        if (response.data.code == 1) {
          this.$toast.success(response.data.message)
          if (create_one_or_multi == 1) {
            window.location.reload();
          } else {
            this.$router.push({ name: "ProductsPage" });
          }
        } else {
          this.$toast.error(response.data.message)
          if (response.data.errors) {
            this.errorsTab.general =false;
            this.errorsTab.inventory =false;
            this.errorsTab.shipping =false;
            this.errorsTab.attributes =false;
            this.errorsTab.variants =false;
            this.errorsTab.bundle_management =false;
           Object.keys(response.data.errors).some(element => {
              if (element.includes('category_id')||element.includes('unit_id')||element.includes('brand_id')||element.includes('tax_id')||element.includes('products_statuses_id')) {
               
                this.errorsTab.general= true;
                
              }
              else if(element.includes('barcode')||element.includes('sku') ||element.includes('quantity')||element.includes('minimum_quantity') ){
              this.errorsTab.inventory = true;}
              else if(element.includes('height')||element.includes('width')||element.includes('length')||element.includes('weight')){
              this.errorsTab.shipping = true;
            }
            else if(element.includes('product_variations')){
              this.errorsTab.attributes = true;
            }
            else if(element.includes('product_variations.')){
              this.errorsTab.variants = true;
            }
            else if(element.includes('related_products')||element.includes('related_products.')){
              this.errorsTab.bundle_management = true;
            }
            
            }
            
            
            );
            for (var i = 0; i <= response.data.errors.length; i++) {
              this.errors["product_variations." + i + ".code"] = "";
              this.errors["product_variations." + i + ".sku"] = "";
              this.errors["product_variations." + i + ".summary"] = "";
              this.errors["product_variations." + i + ".barcode"] = "";
              this.errors["product_variations." + i + ".height"] = "";
              this.errors["product_variations." + i + ".width"] = "";
              this.errors["product_variations." + i + ".length"] = "";
              this.errors["product_variations." + i + ".weight"] = "";
              this.prices.forEach((element, i_price) => {
                this.errors[
                  "product_variations." + i + ".prices." + i_price + ".price	"
                ] = "";
              });
              this.errors[
                "product_variations." + i + ".products_statuses_id"
              ] = "";
              this.errors["related_products." + i + ".child_quantity"] = "";
              this.errors["related_products." + i + ".child_name_status"] =
                "";
            }
            var errors_required = this.errors.required_fields;
            this.errors = response.data.errors;
            this.errors["required_fields"] = errors_required;
          }
        }
      } catch (error) {
        console.error("API Creation error", error); // from creation or business logic
      }
    },
    async search() {},
    nameToSlug(name) {
      return name
        .toLowerCase()
        .replace(/[^\w,\-\_ ]+/g, "")
        .replace(/ +/g, "-");
    },
    removeItemOnceFromSelectedAttributes(value) {
      var index = this.attributes_selected_ids.indexOf(value);
      if (index > -1) {
        this.attributes_selected_ids.splice(index, 1);
      }
    },
    removeProductFromBundle(id) {
      this.bundleProductsIDs.splice(this.bundleProductsIDs.indexOf(id), 1);
      delete this.bundleProducts[id];
    },
    calculateBundlePricesFromProducts() {
      this.bundles_pricing_list_ids.forEach((price) => {
        this.pricing_list[price]["price"] = 0;
      });
      this.bundleProductsIDs.forEach((product) => {
        this.bundles_pricing_list_ids.forEach((price) => {
          if (this.bundleProducts[product].prices != undefined) {
            if (
              this.bundleProducts[product].prices[price] != undefined &&
              this.bundleProducts[product].prices[price] != null
            ) {
              this.pricing_list[price]["price"] +=
                parseInt(this.bundleProducts[product].prices[price].price) *
                (this.bundleProducts[product].quantity
                  ? this.bundleProducts[product].quantity
                  : 0);
            } else {
              this.pricing_list[price]["price"] += 0;
            }
          }
        });
      });
    },
    getSelectedValues(id) {
      return this.attributes_obj[id].select_options.filter((x) =>
        this.attributes_obj[id].selected_values.includes(x.id)
      );
    },
    goTo(route) {
      this.$router.push({ name: route });
    },
    searchProduct(val) {
      this.getProducts();
    },
    checkGetProductData(data) {},
    selectAllAttributeValue(val, attribute_id) {
      if (val) {
        var all_options = [];
        this.attributes_obj[attribute_id].select_options.forEach((element) => {
          all_options.push(element.id);
        });
        this.attributes_obj[attribute_id].selected_values = all_options;
      } else {
        this.attributes_obj[attribute_id].selected_values = [];
      }
    },
    async CheckCode(code, varient_index = null) {
      const result = await repository.checkUniqueCode({ code: code });
      if (result.data.code == -1) {
        if (varient_index == null) {
          this.errors.code = result.data.message;
        } else {
          this.errors["product_variations." + varient_index + ".code"] =
            result.data.message;
          
        }
      }else{
        if (varient_index == null) {
          this.errors.code = '';
        } else {
          this.errors["product_variations." + varient_index + ".code"] =
            '';
          
        }
      }
    },
  },
  computed: {
    enableVariantsTab() {
      return (
        this.product.type == "variable" &&
        this.attributes_selected_ids.length > 0 &&
        this.attributes_selected_ids[this.attributes_selected_ids.length - 1] !=
          null
      );
    },
  },
  watch: {
    "storedProductsSearch.category": {
      handler: function (val) {
        this.getProducts();
      },
      deep: true,
    },
    "product.slug": {
      handler: function (val) {
        this.product.slug =
          this.permalink + this.nameToSlug(val.split(this.permalink)[1]);
      },
      deep: true,
    },
    "product.name.en": {
      handler: function (val) {
        this.product.slug = this.permalink + this.nameToSlug(val);
      },
      deep: true,
    },
    "product.type": {
      handler: function (val) {
        if (val == "bundle" && this.storedProducts.length == 0) {
          this.getProducts();
        }
        this.product.quantity = 0;
        this.product.minimum_quantity = 0;
        this.product.reserved_quantity = 0;
      },
      deep: true,
    },
    "product.unit_id": {
      handler: function (val) {
        if (val != null) {
          this.units.forEach((e) => {
            if (val == e.id) this.selected_unit = e.name;
          });
        }
      },
    },
    bundleProductsIDs: {
      handler: function (val) {
        if (val.length > 0) {
          this.calculateBundlePricesFromProducts();
        }
      },
      deep: true,
    },
    bundles_pricing_list_ids: {
      handler: function (val) {
        if (val.length > 0) {
          this.calculateBundlePricesFromProducts();
        }
      },
      deep: true,
    },
    bundlePricingStatus: {
      handler: function (val) {
        if (val == "products") {
          this.calculateBundlePricesFromProducts();
        }
      },
      deep: true,
    },
    attributes_selected_ids: {
      handler: function (val) {
        if (val.length > 0) {
          // check if the selected attribute is already selected
          let count = this.attributes_selected_ids.filter(
            (x) =>
              x ==
              this.attributes_selected_ids[
                this.attributes_selected_ids.length - 1
              ]
          ).length;
          if (count > 1) {
            this.attributes_selected_ids.pop();
          } else {
            let count = 1;
            val.forEach((element) => {
              if (element != null) {
                //remove from selected attributes
                var index = this.attributes_unselected_ids.indexOf(element);
                if (index > -1) {
                  this.attributes_unselected_ids.splice(index, 1);
                }

                if (
                  this.attributes_obj[element].used_for_variations == true &&
                  this.attributes_obj[element].selected_values
                ) {
                  count *= this.attributes_obj[element].selected_values.length;
                }
              }
            });
            this.max_variables = count;
          }
        }
      },
      deep: true,
    },
    attributes_obj: {
      handler: function (val) {
        if (Object.keys(val).length > 0) {
          if (
            this.attributes_selected_ids[
              this.attributes_selected_ids.length - 1
            ] != null
          ) {
            let count = 1;
            this.attributes_selected_ids.forEach((element) => {
              if (
                this.attributes_obj[element].used_for_variations == true &&
                this.attributes_obj[element].selected_values
              ) {
                count *= this.attributes_obj[element].selected_values.length;
              }
            });
            this.max_variables = count;
          }
        }
      },
      deep: true,
    },
    tab: {
      handler: function (val) {
        if (val == "varients") {
          if (
            this.attributes_selected_ids[
              this.attributes_selected_ids.length - 1
            ] != null
          ) {
            if (this.product_variations.length == 0) {
              this.addProductToVariations();
            }
          }
        }
      },
      deep: true,
    },
  },
};
