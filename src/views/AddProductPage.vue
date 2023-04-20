<template>
  <v-container class="product-container">
    <v-row>
      <v-col cols="12" class="mt-10" v-if="create_product_errors.length > 0">          
              <v-row>
                <template v-for="(error, i) in create_product_errors" :key="i">
                  <v-col cols="12" md="12">
                    <v-alert
                      border="start"
                      @click="goTo(error.link)"
                      border-color="deep-purple accent-4"
                      elevation="2"
                      icon="mdi-cloud-alert"
                      class="my-3"
                      style="
                        cursor: pointer;
                        position: relative !important;
                        max-width: 100% !important;
                        z-index: 100;
                      "
                    >
                      <h3>
                        {{ error.title }}
                      </h3>
                      <div>{{ error.message }}</div></v-alert
                    >
                  </v-col>
                </template>
              </v-row>
      </v-col>
      <v-col cols="9" class="pe-0">
        <v-expansion-panels class="panel-style mb-3" v-model="panel.title">
          <v-expansion-panel>
            <v-expansion-panel-title class="text-h6 px-0">
              Title
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <div class="d-flex justify-center">
                <v-tabs v-model="titleTab" color="primary" centered>
                  <v-tab :value="'en'"> EN </v-tab>
                  <v-tab :value="'ar'"> AR </v-tab>
                </v-tabs>
              </div>

              <v-window v-model="titleTab">
                <v-window-item :value="'en'">
                  <v-text-field
                    density="compact"
                    label="English Title of The Product"
                    variant="outlined"
                    :error-messages="errors['name.en']"
                    v-model="product.name.en"
                  ></v-text-field>

                  <v-col
                    class="pt-0 px-0 d-flex align-items-center"
                    :cols="edit_permalink ? '9' : '6'"
                  >
                    <span class="pr-2">Permalink:</span>
                    <a
                      v-if="!edit_permalink"
                      class="text-caption pt-1"
                      style="
                        text-decoration: underline;
                        color: rgb(161, 161, 161);
                      "
                    >
                      {{ product.slug }}</a
                    >

                    <v-text-field
                      class="pt-0"
                      style="max-width: 80%"
                      v-else
                      density="compact"
                      v-model="product.slug"
                      variant="underlined"
                      :error-messages="errors.slug"
                    ></v-text-field>

                    <v-icon
                      class="mx-3"
                      :style="
                        edit_permalink ? 'font-size:26px' : 'font-size:20px '
                      "
                      :icon="
                        !edit_permalink ? 'mdi-pencil' : 'mdi-content-save'
                      "
                      @click="edit_permalink = !edit_permalink"
                    ></v-icon>
                  </v-col>

                  <div style="color: red" v-if="errors.slug">
                    {{ errors.slug[0] }}
                  </div>
                </v-window-item>
                <v-window-item :value="'ar'">
                  <v-text-field
                    density="compact"
                    label="Arabic Title of The Product"
                    variant="outlined"
                    :error-messages="errors['name.ar']"
                    v-model="product.name.ar"
                  ></v-text-field>

                  <v-col
                    class="pt-0 px-0 d-flex align-items-center"
                    :cols="edit_permalink ? '9' : '6'"
                  >
                    <span class="pr-2">Permalink:</span>
                    <a
                      v-if="!edit_permalink"
                      class="text-caption pt-1"
                      style="
                        text-decoration: underline;
                        color: rgb(161, 161, 161);
                      "
                    >
                      {{ product.slug }}</a
                    >

                    <v-text-field
                      style="max-width: 80%"
                      v-else
                      density="compact"
                      v-model="product.slug"
                      variant="underlined"
                      hide-details
                    ></v-text-field>
                    <v-icon
                      class="mx-3"
                      :style="
                        edit_permalink ? 'font-size:26px' : 'font-size:20px '
                      "
                      :icon="
                        !edit_permalink ? 'mdi-pencil' : 'mdi-content-save'
                      "
                      @click="edit_permalink = !edit_permalink"
                    ></v-icon>
                  </v-col>
                </v-window-item>
              </v-window>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          class="panel-style mb-3"
          v-model="panel.description"
        >
          <v-expansion-panel>
            <v-expansion-panel-title v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start title-box">
                  Descriptions
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open" key="0"> Select trip destination </span>
                    <span v-else key="1">
                      {{ trip.location }}
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- Title Tabs -->
              <v-row>
                <v-col cols="12" class="d-flex justify-center tab-col">
                  <v-tabs v-model="descriptionTab" color="primary" centered>
                    <v-tab :value="'en'"> EN </v-tab>
                    <v-tab :value="'ar'"> AR </v-tab>
                  </v-tabs>
                </v-col>
              </v-row>

              <v-window v-model="descriptionTab">
                <v-window-item :value="'en'">
                  <v-row>
                    <v-col cols="12">
                      <span style="font-size: 15px">
                        Add a short description about your product
                        (English)</span
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        density="compact"
                        label="Text English"
                        placeholder="Text"
                        variant="outlined"
                        :error-messages="errors.summary"
                        v-model="product.summary.en"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span style="font-size: 15px">
                        Add a long description about your product (English)
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <p style="color: red" v-if="errors.description">
                          {{ errors.description[0] }}
                        </p>

                        <QuillEditor
                          contentType="html"
                          v-model:content="product.description.en"
                          :options="options"
                          class="editor"
                          theme="snow"
                          :class="{ 'error-editor': errors.description }"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="my-8">
                    <v-col cols="12">
                      <span style="font-size: 15px">
                        Add specification (English)
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <p style="color: red" v-if="errors.specification">
                          {{ errors.specification[0] }}
                        </p>
                        <QuillEditor
                          contentType="html"
                          :options="options"
                          theme="snow"
                          class="editor"
                          v-model:content="product.specification.en"
                          :class="{ 'error-editor': errors.specification }"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="'ar'">
                  <v-row>
                    <v-col cols="12">
                      <span style="font-size: 15px">
                        Add a short description about your product
                        (Arabic)</span
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        density="compact"
                        label="Text Arabic"
                        placeholder="Text"
                        variant="outlined"
                        :error-messages="errors.summary"
                        v-model="product.summary.ar"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span style="font-size: 15px">
                        Add a long description about your product (Arabic)
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <p style="color: red" v-if="errors.description">
                          {{ errors.description[0] }}
                        </p>
                        <QuillEditor
                          contentType="html"
                          v-model:content="product.description.ar"
                          :options="options"
                          class="editor"
                          theme="snow"
                          :class="{ 'error-editor': errors.description }"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <v-row class="my-8">
                    <v-col cols="12">
                      <span style="font-size: 15px">
                        Add specification (Arabic)
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <div>
                        <p style="color: red" v-if="errors.specification">
                          {{ errors.specification[0] }}
                        </p>
                        <QuillEditor
                          contentType="html"
                          :options="options"
                          theme="snow"
                          class="editor"
                          :class="{ 'error-editor': errors.specification }"
                          v-model:content="product.specification.ar"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels class="panel-style mb-3" v-model="panel.media">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start title-box">
                  Media
                </v-col>
                <v-col cols="8" class="text--secondary"> </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <span style="font-size: 15px">
                    Add a main image for your product</span
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <UploadImages
                    ref="mainImageUpload"
                    max="1"
                    class="image-box"
                    @changed="handleMainImage"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <span style="font-size: 15px">
                    Add one or more images to the product gallery
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <UploadImages
                    ref="galleryImagesUpload"
                    class="image-box"
                    @changed="handleGalleryImages"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels class="panel-style mb-3" v-model="panel.setup">
          <v-expansion-panel>
            <v-expansion-panel-title v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start title-box">
                  Product Data
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open" key="0"> Select Type </span>
                    <span v-else key="1">
                      {{ product.type }}
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-title>

            <v-expansion-panel-text class="product-data">
              <v-row no-gutters>
                <v-col cols="3" class="mb-6" style="padding-right: 1rem">
                  <v-select
                    :items="types"
                    label="product type"
                    variant="outlined"
                    density="compact"
                    :error-messages="errors.type"
                    v-model="product.type"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="3" style="border-right: 1px solid #dcd9d9">
                  <v-tabs v-model="tab" direction="vertical" color="primary">
                    <v-tab value="general" :class="{ 'error-tab':errorsTab.general}" :slider-color="errorsTab.general ? 'red':''">
                      <v-icon start> mdi-file-find </v-icon>
                      General
                    </v-tab>
                    <v-tab v-if="product.type != 'service'" value="shipping" :class="{ 'error-tab':errorsTab.shipping}" :slider-color="errorsTab.shipping ? 'red':''">
                      <v-icon start> mdi-truck </v-icon>
                      Shipping
                    </v-tab>
                    <v-tab value="inventory" :class="{ 'error-tab':errorsTab.inventory}"   :slider-color="errorsTab.inventory ? 'red':''">
                      <v-icon start> mdi-trending-up </v-icon>
                      Inventory
                    </v-tab>

                    <v-tab v-if="product.type == 'variable'" value="attributes" :class="{'error-tab':errorsTab.attributes}" :slider-color="errorsTab.attributes ? 'red':''">
                      <v-icon start> mdi-tag-outline </v-icon>
                      Attributes
                    </v-tab>
                    <v-tab v-if="product.type == 'variable'" value="varients" :class="{ 'error-tab':errorsTab.varients }" :slider-color="errorsTab.varients ? 'red':''">
                      <v-icon start> mdi-arrow-decision-outline </v-icon>
                      Variants
                    </v-tab>

                    <v-tab
                      v-if="product.type == 'bundle'"
                      value="bundle_management"
                      :class="{ 'error-tab':errorsTab.bundle_management}"
                      :slider-color="errorsTab.bundle_management ? 'red':''"
                    >
                      <v-icon start> mdi-briefcase-plus </v-icon>
                      Bundle Management
                    </v-tab>
                    <v-tab
                      v-if="product.type == 'bundle'"
                      value="bundle_pricing_list"
                    >
                      <v-icon start> mdi-briefcase-check </v-icon>
                      Bundle Pricing Lis
                    </v-tab>

                    <v-tab value="metas">
                      <v-icon start> mdi-script-text-key </v-icon>
                      Metas
                    </v-tab>
                  </v-tabs>
                </v-col>

                <v-col cols="9" style="transform: translateY(-72px)">
                  <div>
                    <v-window v-model="tab">
                      <v-window-item value="general">
                        <v-row>
                          <!-- Code -->
                          <v-col cols="6">
                            <v-text-field
                              label="Code"
                              density="compact"
                              variant="outlined"
                              v-debounce:500ms="
                                (val) => {
                                  CheckCode(val);
                                }
                              "
                              debounce-events="update"
                              :error-messages="errors.code"
                              v-model="product.code"
                            ></v-text-field>
                          </v-col>

                          <!-- Category -->
                          <v-col cols="6">
                            <v-select
                              v-model="product.category_id"
                              :items="categories_list"
                              label="Main Category"
                              variant="outlined"
                              density="compact"
                              item-title="name"
                              item-value="id"
                              :error-messages="errors.category_id"
                            ></v-select>
                          </v-col>

                          <!-- Unit -->
                          <v-col cols="6">
                            <v-select
                              v-model="product.unit_id"
                              :items="units"
                              label="Units"
                              variant="outlined"
                              item-title="name"
                              item-value="id"
                              density="compact"
                              :error-messages="errors.unit_id"
                            ></v-select>
                          </v-col>

                          <!-- Brand -->
                          <v-col cols="6">
                            <v-select
                              v-model="product.brand_id"
                              :items="brands"
                              label="Brands"
                              variant="outlined"
                              item-title="name"
                              item-value="id"
                              density="compact"
                              :error-messages="errors.brand_id"
                            ></v-select>
                          </v-col>

                          <!-- Tax Status -->
                          <v-col cols="6">
                            <v-select
                              v-model="product.tax_id"
                              :items="taxes"
                              item-title="name"
                              item-value="id"
                              label="Tax"
                              variant="outlined"
                              density="compact"
                              :error-messages="errors.tax_id"
                            ></v-select>
                          </v-col>

                          <!-- product status -->
                          <v-col cols="6">
                            <v-select
                              v-model="product.products_statuses_id"
                              :items="product_status"
                              item-title="name"
                              item-value="id"
                              label="Product Status"
                              variant="outlined"
                              density="compact"
                              :error-messages="errors.products_statuses_id"
                            ></v-select>
                          </v-col>

                          <v-col cols="6">
                            <v-checkbox
                              v-model="product.pre_order"
                              variant="outlined"
                              density="compact"
                              hide-details
                              label="Pre-Order"
                            ></v-checkbox>
                          </v-col>

                          <!-- Tax Class -->
                          <!-- <v-col cols="6">
                                        <v-select
                                        v-model="product.tax_class_id"
                                        :items="types"
                                        label="Tax Class"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        ></v-select>
                                      </v-col> -->
                          <v-divider
                            style="margin: 1rem 0 0 0"
                            inset
                          ></v-divider>

                          <div class="text-h5" style="margin-left: 1rem">
                            Additional Fields
                          </div>
                          <dynamic-fields
                            :required_fields="required_fields"
                            :object_fields="object_fields"
                            :errors="errors.required_fields"
                            :unrequired_fields="unrequired_fields"
                            :fields="fields"
                            @UpdateFields="
                              (val) => {
                                this.fields = val;
                              }
                            "
                          ></dynamic-fields>
                        </v-row>
                      </v-window-item>
                      <v-window-item
                        v-if="product.type != 'service'"
                        value="shipping"
                      >
                        <v-row>
                          <v-col cols="3  ">
                            <v-subheader>Weight</v-subheader>
                          </v-col>
                          <v-col cols="9">
                            <v-text-field
                              v-model="product.weight"
                              type="number"
                              @keypress="isNumber($event)"
                              label="Weight"
                              density="compact"
                              suffix="Kg"
                              variant="outlined"
                              :error-messages="errors.weight"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="3 ">
                            <v-subheader>Dimensions</v-subheader>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              v-model="product.length"
                              type="number"
                              @keypress="isNumber($event)"
                              label="Length"
                              density="compact"
                              variant="outlined"
                              :error-messages="errors.length"
                              suffix="cm"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              v-model="product.width"
                              type="number"
                              @keypress="isNumber($event)"
                              label="Width"
                              density="compact"
                              variant="outlined"
                              :error-messages="errors.width"
                              suffix="cm"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              v-model="product.height"
                              type="number"
                              @keypress="isNumber($event)"
                              label="Height"
                              density="compact"
                              variant="outlined"
                              :error-messages="errors.height"
                              suffix="cm"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <!-- <v-row>
                                        <v-col cols="3">
                                          <v-subheader>Shipping Class</v-subheader>
                                        </v-col>
                                        <v-col cols="9">
                                          <v-select
                                            label="Shipping Class"
                                            variant="outlined"
                                            density="compact"

                                          ></v-select>
                                        </v-col>
                                      </v-row> -->
                      </v-window-item>
                      <v-window-item value="inventory">
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              label="SKU"
                              density="compact"
                              variant="outlined"
                              :error-messages="errors.sku"
                              v-model="product.sku"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6">
                            <v-text-field
                              label="GTIN"
                              density="compact"
                              variant="outlined"
                              :error-messages="errors.barcode"
                              v-model="product.barcode"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6" v-if="product.type == 'normal'">
                            <v-text-field
                              label="Quantity"
                              density="compact"
                              variant="outlined"
                              type="number"
                              counter
                              min="0" 
                              :suffix="selected_unit"
                              :error-messages="errors.quantity"
                              v-model="product.quantity"
                              @keypress="isNumber($event)"
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="6"
                            v-if="
                              !(
                                product.type == 'variable' ||
                                product.type == 'service'
                              )
                            "
                          >
                            <v-text-field
                              label="Min Quantity"
                              density="compact"
                              variant="outlined"
                              :suffix="selected_unit"
                              type="number"
                              min="0" counter
                              @keypress="isNumber($event)"
                              :error-messages="errors.minimum_quantity"

                              v-model="product.minimum_quantity"
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="6"
                            v-if="
                              product.type != 'variable' &&
                              product.type != 'service'
                            "
                          >
                            <v-text-field
                              label="Reserved Quantity"
                              density="compact"
                              variant="outlined"
                              min="0" counter
                              type="number"
                              @keypress="isNumber($event)"
                              :suffix="selected_unit"
                              :error-messages="errors.reserved_quantity"

                              v-model="product.reserved_quantity"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-window-item>

                      <v-window-item
                        v-if="product.type == 'variable'"
                        value="attributes"
                      >
                        <template
                          v-for="(attribute, index) in attributes_selected_ids"
                          :key="index"
                        >
                          <v-col cols="12" v-if="errors.product_variations">
                            <p style="color: red">
                              {{ errors.product_variations[0] }}
                            </p>
                          </v-col>
                          <v-row class="mt-5">
                            <v-col cols="4">
                              <v-select
                                label="Name"
                                variant="outlined"
                                density="compact"
                                :items="attributes_fields"
                                item-title="title"
                                item-value="id"
                                v-model="attributes_selected_ids[index]"
                              ></v-select>
                            </v-col>

                            <v-col cols="5">
                              <v-select
                                v-if="
                                  attribute != undefined &&
                                  attribute != null &&
                                  attribute != 0
                                "
                                label="Values"
                                variant="outlined"
                                :items="
                                  attributes_obj[attribute].select_options
                                "
                                @changed="
                                  (val) => {
                                    this.check_if_selected_all(val);
                                  }
                                "
                                item-title="value"
                                item-value="id"
                                density="compact"
                                hide-details
                                v-model="
                                  attributes_obj[attribute].selected_values
                                "
                                multiple
                                chips
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="3" class="add-close-icon">
                              <v-btn
                                v-if="
                                  attributes_selected_ids.length <
                                  attributes_fields.length
                                "
                                class="mr-4"
                                size="x-small"
                                icon="mdi-plus"
                                @click="addAttribute(index)"
                                color="white"
                              >
                              </v-btn>
                              <v-btn
                                v-if="attributes_selected_ids.length > 1"
                                size="x-small"
                                icon="mdi-close"
                                color="black"
                                @click="deleteOptionAttribute(index, attribute)"
                              ></v-btn>
                            </v-col>
                          </v-row>

                          <v-row
                            v-if="
                              attribute != undefined &&
                              attribute != null &&
                              attribute != 0
                            "
                          >
                            <v-col cols="12" class="py-0">
                              <v-checkbox
                                label="Select All"
                                hide-details
                                density="compact"
                                @change="
                                  (val) => {
                                    selectAllAttributeValue(
                                      select_all_variants[index],
                                      attribute
                                    );
                                  }
                                "
                                v-model="select_all_variants[index]"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" class="py-0">
                              <v-checkbox
                                label="Used for variations"
                                hide-details
                                density="compact"
                                v-model="
                                  attributes_obj[attribute].used_for_variations
                                "
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-divider></v-divider>
                        </template>
                      </v-window-item>
                      <v-window-item v-if="enableVariantsTab" value="varients">
                        <v-row justify="space-between">
                          <v-col
                            cols="4"
                            v-if="
                              attributes_selected_ids.length > 0 &&
                              attributes_obj[attributes_selected_ids[0]]
                                .used_for_variations
                            "
                          >
                            <!-- <v-select
                              :items="
                                attributes_obj[attributes_selected_ids[0]]
                                  .select_options
                              "
                              item-title="value"
                              item-value="id"
                              label="Add Variation"
                              v-model="
                                attributes_obj[attributes_selected_ids[0]]
                                  .selected_values
                              "
                              variant="outlined"
                              density="compact"
                              multiple
                              chips
                            ></v-select> -->

                            <v-col cols="2" style="">
                              <v-btn
                                v-if="product_variations.length < max_variables"
                                style="
                                  position: absolute;
                                  transform: translateY(20%);
                                "
                                class="mr-4"
                                size="x-small"
                                icon="mdi-plus"
                                @click="addProductToVariations()"
                                color="#b8b8b8"
                              >
                              </v-btn>
                            </v-col>
                          </v-col>
                        </v-row>
                        <v-expansion-panels class="mt-15 variation-panels">
                          <v-expansion-panel
                            v-for="(var_product, i) in product_variations"
                            :key="i"
                          >
                            <v-expansion-panel-title>
                              # {{ i + 1 }}
                              <template v-slot:actions="{ expanded }">
                                <v-icon
                                  @click="deleteProductFromVariations(i)"
                                  class="pr-6 non-expended"
                                  icon="mdi-close"
                                >
                                </v-icon>
                                <v-icon
                                  :icon="
                                    expanded
                                      ? 'mdi-chevron-up'
                                      : 'mdi-chevron-down'
                                  "
                                >
                                </v-icon>
                              </template>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-row class="mt-1">
                                <template
                                  v-for="(select, i) in attributes_selected_ids"
                                  :key="i"
                                >
                                  <v-col
                                    cols="4"
                                    v-if="
                                      attributes_obj[select]
                                        .used_for_variations == true &&
                                      attributes_obj[select].selected_values
                                    "
                                  >
                                    <v-select
                                      :items="getSelectedValues(select)"
                                      item-title="value"
                                      item-value="id"
                                      :label="attributes_obj[select].title"
                                      v-model="
                                        var_product.potential_fields[select]
                                          .value
                                      "
                                      variant="outlined"
                                      density="compact"
                                      hide-details
                                    ></v-select>
                                  </v-col>
                                </template>
                                <v-col cols="4">
                                  <v-checkbox
                                    :disabled="
                                      is_default_child.status &&
                                      is_default_child.index != i
                                    "
                                    v-debounce="
                                      (val) => {
                                        is_default_child.status =
                                          !is_default_child.status;
                                        is_default_child.index =
                                          is_default_child.status ? i : '';
                                      }
                                    "
                                    debounce-events="update"
                                    label="default child?"
                                    hide-details
                                    density="compact"
                                    v-model="var_product.is_default_child"
                                  ></v-checkbox>
                                </v-col>
                              </v-row>

                              <v-row>
                                <!-- Title Tabs -->
                                <v-row class="mt-1">
                                  <v-col
                                    cols="12"
                                    class="d-flex justify-center tab-col"
                                    style="padding-bottom: 0"
                                  >
                                    <v-tabs
                                      v-model="varDescriptionTab"
                                      color="primary"
                                      centered
                                    >
                                      <v-tab :value="'en'"> EN </v-tab>
                                      <v-tab :value="'ar'"> AR </v-tab>
                                    </v-tabs>
                                  </v-col>
                                </v-row>

                                <v-window v-model="varDescriptionTab">
                                  <v-window-item :value="'en'">
                                    <v-row>
                                      <v-col cols="12" class="mt-1 pb-0">
                                        <span style="font-size: 15px">
                                          Add a long description about your
                                          product (English)
                                        </span>
                                      </v-col>
                                      <v-col cols="12">
                                        <div>
                                          <QuillEditor
                                            contentType="html"
                                            v-model:content="
                                              var_product.description.en
                                            "
                                            :options="options"
                                            class="editor"
                                            theme="snow"
                                          />
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <v-row class="my-4">
                                      <v-col cols="12" class="mt-1 pb-0">
                                        <span style="font-size: 15px">
                                          Add specification (English)
                                        </span>
                                      </v-col>
                                      <v-col cols="12">
                                        <div>
                                          <QuillEditor
                                            contentType="html"
                                            :options="options"
                                            theme="snow"
                                            class="editor"
                                            v-model:content="
                                              var_product.specification.en
                                            "
                                          />
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-window-item>
                                  <v-window-item :value="'ar'">
                                    <v-row>
                                      <v-col cols="12" class="mt-1 pb-0">
                                        <span style="font-size: 15px">
                                          Add a long description about your
                                          product (Arabic)
                                        </span>
                                      </v-col>
                                      <v-col cols="12">
                                        <div>
                                          <QuillEditor
                                            contentType="html"
                                            v-model:content="
                                              var_product.description.ar
                                            "
                                            :options="options"
                                            class="editor"
                                            theme="snow"
                                          />
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <v-row class="mt-1">
                                      <v-col cols="12" class="mt-1 pb-0">
                                        <span style="font-size: 15px">
                                          Add specification (Arabic)
                                        </span>
                                      </v-col>
                                      <v-col cols="12">
                                        <div>
                                          <QuillEditor
                                            contentType="html"
                                            :options="options"
                                            theme="snow"
                                            class="editor"
                                            v-model:content="
                                              var_product.specification.ar
                                            "
                                          />
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-window-item>
                                </v-window>
                              </v-row>

                              <v-row>
                                <v-col cols="12" class="mt-1 pb-0">
                                  <span style="font-size: 15px">
                                    Add Image
                                  </span>
                                </v-col>
                                <v-col cols="12" class="pt-0">
                                  <UploadImages
                                    max="1"
                                    :variable_id="i"
                                    class="image-box"
                                    @changed="
                                      (val) => {
                                        handleVariableMainImage(val, i);
                                      }
                                    "
                                  />
                                </v-col>
                                <v-col cols="12" class="mt-1 pb-0">
                                  <span style="font-size: 15px">
                                    Add Gallery
                                  </span>
                                </v-col>
                                <v-col cols="12" class="pt-0">
                                  <UploadImages
                                    class="image-box"
                                    @changed="
                                      (val) => {
                                        handleVariableGalleryImages(val, i);
                                      }
                                    "
                                  />
                                </v-col>
                              </v-row>

                              <v-row class="mt-2">
                                <v-col cols="6">
                                  <v-select
                                    v-model="var_product.products_statuses_id"
                                    :items="product_status"
                                    item-title="name"
                                    item-value="id"
                                    label="Product Status"
                                    variant="outlined"
                                    density="compact"
                                    :error-messages="
                                      errors[
                                        'product_variations.' +
                                          i +
                                          '.products_statuses_id'
                                      ]
                                        ? 'The field is required.'
                                        : ''
                                    "
                                  ></v-select>
                                </v-col>

                                <v-col cols="6">
                                  <v-text-field
                                    label="CODE"
                                    density="compact"
                                    variant="outlined"
                                    v-debounce:500ms="
                                      (val) => {
                                        CheckCode(val, i);
                                      }
                                    "
                                    debounce-events="update"
                                    :error-messages="
                                      errors[
                                        'product_variations.' + i + '.code'
                                      ]
                                    "
                                    v-model="var_product.code"
                                  ></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                  <v-text-field
                                    label="SKU"
                                    density="compact"
                                    variant="outlined"
                                    :error-messages="
                                      errors['product_variations.' + i + '.sku']
                                        ? 'The field is required.'
                                        : ''
                                    "
                                    v-model="var_product.sku"
                                  ></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                  <v-text-field
                                    label="GTIN"
                                    density="compact"
                                    variant="outlined"
                                    :error-messages="
                                      errors[
                                        'product_variations.' + i + '.barcode'
                                      ]
                                        ? 'The field is required.'
                                        : ''
                                    "
                                    v-model="var_product.barcode"
                                  ></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                  <v-text-field
                                    label="Quantity"
                                    density="compact"
                                    variant="outlined"
                                    type="number"
                                    @keypress="isNumber($event)"
                                    min="0" counter
                                    :suffix="selected_unit"
                                    :error-messages="
                                      errors[
                                        'product_variations.' + i + '.quantity'
                                      ]
                                        ? 'The field is required.'
                                        : ''
                                    "
                                    v-model="var_product.quantity"
                                  ></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                  <v-text-field
                                    label="Minimum Quantity"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    type="number"
                                    min="0" counter
                                    @keypress="isNumber($event)"
                                    :suffix="selected_unit"
                                    v-model="var_product.minimum_quantity"
                                  ></v-text-field>
                                </v-col>

                                <v-col cols="6">
                                  <v-text-field
                                    label="Reserved Quantity"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    min="0" counter
                                    type="number"
                                    @keypress="isNumber($event)"
                                    :suffix="selected_unit"
                                    v-model="var_product.reserved_quantity"
                                  ></v-text-field>
                                </v-col>
                              </v-row>

                              <v-row class="mt-4">
                                <v-col cols="12">
                                  <v-checkbox
                                    label="Same price as parent product"
                                    hide-details
                                    density="compact"
                                    v-model="
                                      var_product.is_same_price_as_parent
                                    "
                                  ></v-checkbox>
                                </v-col>
                              </v-row>

                              <template
                                v-if="!var_product.is_same_price_as_parent"
                              >
                                <v-row
                                  class="mb-2"
                                  v-for="(price, i_price) in prices_original"
                                  :key="price"
                                >
                                  <v-col cols="4">
                                    <div
                                      class="text-body"
                                      style="margin-left: 0.5rem"
                                    >
                                      {{ price.name }}
                                    </div>
                                  </v-col>
                                  <v-col cols="4">
                                    <v-text-field
                                      v-model="
                                        var_product['prices'][i_price]['price']
                                      "
                                      label="Price"
                                      type="number"
                                      @keypress="isNumber($event)"
                                      min="0" counter
                                      density="compact"
                                      :suffix="price.currency"
                                      hide-details

                                      variant="outlined"
                                      :error-messages="
                                        errors[
                                          'product_variations.' +
                                            i +
                                            '.prices.' +
                                            i_price +
                                            '.price'
                                        ]
                                          ? 'The field is required.'
                                          : ''
                                      "
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="4">
                                    <v-text-field
                                      v-model="
                                        var_product['prices'][i_price][
                                          'discounted_price'
                                        ]
                                      "
                                      label="Discounted Price"
                                      type="number"
                                      min="0" counter
                                      @keypress="isNumber($event)"
                                      density="compact"
                                      :suffix="price.currency"
                                      variant="outlined"
                                      hide-details
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </template>

                              <v-row class="mt-3">
                                <v-col cols="3  ">
                                  <v-subheader>Weight</v-subheader>
                                </v-col>
                                <v-col cols="9">
                                  <v-text-field
                                    label="Weight"
                                    density="compact"
                                    suffix="Kg"
                                    variant="outlined"
                                    type="number"
                                    min="0" counter
                                    @keypress="isNumber($event)"
                                    :error-messages="
                                      errors[
                                        'product_variations.' + i + '.weight'
                                      ]
                                        ? 'The field is required.'
                                        : ''
                                    "
                                    v-model="var_product.weight"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                  <v-checkbox
                                    label="Same Dimensions as parent product"
                                    hide-details
                                    density="compact"
                                    v-model="
                                      var_product.is_same_dimensions_as_parent
                                    "
                                  ></v-checkbox>
                                </v-col>
                                <template
                                  v-if="
                                    !var_product.is_same_dimensions_as_parent
                                  "
                                >
                                  <v-col cols="3 ">
                                    <v-subheader>Dimensions</v-subheader>
                                  </v-col>
                                  <v-col cols="3">
                                    <v-text-field
                                      label="Length"
                                      density="compact"
                                      variant="outlined"
                                      type="number"
                                      min="0" counter
                                      @keypress="isNumber($event)"
                                      :error-messages="
                                        errors[
                                          'product_variations.' + i + '.length'
                                        ]
                                          ? 'The field is required.'
                                          : ''
                                      "
                                      suffix="cm"
                                      v-model="var_product.length"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="3">
                                    <v-text-field
                                      label="Width"
                                      density="compact"
                                      variant="outlined"
                                      type="number"
                                      min="0" counter
                                      @keypress="isNumber($event)"
                                      :error-messages="
                                        errors[
                                          'product_variations.' + i + '.width'
                                        ]
                                          ? 'The field is required.'
                                          : ''
                                      "
                                      suffix="cm"
                                      v-model="var_product.width"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="3">
                                    <v-text-field
                                      label="Height"
                                      density="compact"
                                      variant="outlined"
                                      type="number"
                                      min="0" counter
                                      @keypress="isNumber($event)"
                                      :error-messages="
                                        errors[
                                          'product_variations.' + i + '.height'
                                        ]
                                          ? 'The field is required.'
                                          : ''
                                      "
                                      suffix="cm"
                                      v-model="var_product.height"
                                    ></v-text-field>
                                  </v-col>
                                </template>
                              </v-row>

                              <!-- <v-row>
                                                      <v-col cols="3">
                                                        <v-subheader>Shipping Class</v-subheader>
                                                      </v-col>
                                                      <v-col cols="9">
                                                        <v-select
                                                          label="Shipping Class"
                                                          variant="outlined"
                                                          density="compact"

                                                        ></v-select>
                                                      </v-col>
                                                </v-row>
                                                      
                                                <v-row>
                                                        <v-col cols="12">
                                                        <v-subheader>Add description</v-subheader>
                                                      </v-col>
                                                        <v-col cols="12">
                                                        <div>
                                                          <QuillEditor  :options="options" theme="snow" class="editor" v-model="specification_editor"/>
                                                        </div>
                                                        </v-col>
                                                </v-row> -->
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                        <v-divider></v-divider>
                      </v-window-item>

                      <v-window-item
                        v-if="product.type == 'bundle'"
                        value="bundle_management"
                      >
                        <v-row>
                          <v-col cols="12" class="my-5 pl-4">
                            <v-btn
                              class="mr-4"
                              size="x-small"
                              icon="mdi-plus"
                              @click="openAddProductModal"
                              color="white"
                            ></v-btn>
                            <span>Add Product</span>
                          </v-col>
                        </v-row>
                        <template v-if="bundleProductsIDs.length > 0">
                          <v-row v-for="(id, i) in bundleProductsIDs" :key="id">
                            <v-col cols="12">
                              <v-expansion-panels class="mt-4 variation-panels">
                                <v-expansion-panel>
                                  <v-expansion-panel-title>
                                    {{ bundleProducts[id].name.en }}
                                    <template v-slot:actions="{ expanded }">
                                      <v-icon
                                        class="pr-6 non-expended"
                                        @click="removeProductFromBundle(id)"
                                        icon="mdi-close"
                                      >
                                      </v-icon>

                                      <v-icon
                                        :icon="
                                          expanded
                                            ? 'mdi-chevron-up'
                                            : 'mdi-chevron-down'
                                        "
                                      >
                                      </v-icon>
                                    </template>
                                  </v-expansion-panel-title>
                                  <v-expansion-panel-text>
                                    <v-row class="mt-2">
                                      <v-col cols="3  ">
                                        <v-subheader>Quantity</v-subheader>
                                      </v-col>
                                      <v-col cols="9">
                                        <v-text-field
                                          label="Quantity"
                                          density="compact"
                                          variant="outlined"
                                          min="0" counter
                                          :error-messages="
                                            errors[
                                              'related_products.' +
                                                i +
                                                '.child_quantity'
                                            ]
                                          "
                                          :suffix="selected_unit"
                                          type="number"
                                          @keypress="isNumber($event)"
                                          v-model="bundleProducts[id].quantity"
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                    <v-row class="mt-4">
                                      <v-col cols="3  ">
                                        <v-subheader>Product Info:</v-subheader>
                                      </v-col>
                                      <v-col cols="9">
                                        <v-row>
                                          <v-col cols="12" class="py-0">
                                            <v-radio-group
                                              :error-messages="
                                                errors[
                                                  'related_products.' +
                                                    i +
                                                    '.child_name_status'
                                                ]
                                                  ? 'you have to select one .'
                                                  : ''
                                              "
                                              v-model="
                                                bundleProducts[id].nameStatus
                                              "
                                              inline
                                            >
                                              <v-radio
                                                label="Use default product name"
                                                value="default"
                                              ></v-radio>
                                              <v-radio
                                                label="Use a custom product name"
                                                value="custom"
                                              ></v-radio>
                                              <v-radio
                                                label="Hide product name"
                                                value="hide"
                                              ></v-radio>
                                            </v-radio-group>
                                          </v-col>
                                          <template
                                            v-if="
                                              bundleProducts[id].nameStatus ==
                                              'custom'
                                            "
                                          >
                                            <v-col cols="6" class="py-0">
                                              <v-text-field
                                                label="Custom name English"
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                v-model="
                                                  bundleProducts[id]
                                                    .custom_name_en
                                                "
                                              ></v-text-field>
                                            </v-col>
                                            <v-col cols="6" class="py-0">
                                              <v-text-field
                                                label="Custom name Arabic"
                                                density="compact"
                                                variant="outlined"
                                                hide-details
                                                v-model="
                                                  bundleProducts[id]
                                                    .custom_name_ar
                                                "
                                              ></v-text-field>
                                            </v-col>
                                          </template>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-col>
                            <v-divider></v-divider>
                          </v-row>
                        </template>
                      </v-window-item>
                      <v-window-item
                        v-if="product.type == 'bundle'"
                        value="bundle_pricing_list"
                      >
                        <v-row class="mb-2 mt-1">
                          <v-col cols="6">
                            <v-select
                              :items="prices"
                              item-title="name"
                              item-value="price_id"
                              label="Choose Pricing List"
                              variant="outlined"
                              density="compact"
                              hide-details
                              multiple
                              v-model="bundles_pricing_list_ids"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row v-if="bundles_pricing_list_ids.length > 0">
                          <v-col cols="12">
                            <v-table fixed-header height="300px">
                              <thead>
                                <tr>
                                  <th class="text-left">Product</th>
                                  <template
                                    v-if="bundles_pricing_list_ids.length > 0"
                                  >
                                    <th
                                      v-for="id in bundles_pricing_list_ids"
                                      :key="id"
                                      class="text-left"
                                    >
                                      {{ pricing_list[id].name }}
                                    </th>
                                  </template>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="id in bundleProductsIDs" :key="id">
                                  <td>
                                    {{ bundleProducts[id].name.en }}
                                  </td>

                                  <template
                                    v-if="bundles_pricing_list_ids.length > 0"
                                  >
                                    <td
                                      v-for="p in bundles_pricing_list_ids"
                                      :key="p"
                                    >
                                      {{
                                        (bundleProducts[id].quantity
                                          ? bundleProducts[id].quantity
                                          : 0) +
                                        " * " +
                                        (bundleProducts[id].prices[p]
                                          ? bundleProducts[id].prices[p].price
                                          : 0)
                                      }}
                                    </td>
                                  </template>
                                </tr>
                              </tbody>
                            </v-table>
                          </v-col>
                        </v-row>

                        <v-row class="mt-2">
                          <v-col cols="12">
                            <v-radio-group v-model="bundlePricingStatus" inline>
                              <v-radio
                                label="Set a default price"
                                value="default"
                              ></v-radio>
                              <v-radio
                                label="Take prices from products"
                                value="from_products"
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                        </v-row>

                        <template v-if="bundles_pricing_list_ids.length > 0">
                          <v-row
                            v-for="(price, i) in bundles_pricing_list_ids"
                            :key="i"
                          >
                            <v-col cols="4">
                              <v-text>
                                {{ pricing_list[price].name }}
                              </v-text>
                            </v-col>

                            <v-col cols="4">
                              <v-text-field
                                label="Price"
                                density="compact"
                                variant="outlined"
                                min="0" counter
                                hide-details
                                :suffix="pricing_list[price].currency"
                                v-model="pricing_list[price].price"
                                type="number"
                                @keypress="isNumber($event)"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="4">
                              <v-text-field
                                label="Discounted Price"
                                density="compact"
                                variant="outlined"
                                min="0" counter
                                hide-details
                                :suffix="pricing_list[price].currency"
                                v-model="pricing_list[price].discounted_price"
                                type="number"
                                @keypress="isNumber($event)"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </template>
                      </v-window-item>

                      <v-window-item value="metas">
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              label="Meta Title (EN)"
                              density="compact"
                              variant="outlined"
                              hide-details
                              v-model="product.meta_title.en"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6">
                            <v-text-field
                              label="Meta Title (AR)"
                              density="compact"
                              variant="outlined"
                              hide-details
                              v-model="product.meta_title.ar"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              label="Meta Description (EN)"
                              density="compact"
                              variant="outlined"
                              hide-details
                              v-model="product.meta_description.en"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6">
                            <v-text-field
                              label="Meta Description (AR)"
                              density="compact"
                              variant="outlined"
                              hide-details
                              v-model="product.meta_description.ar"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              label="Meta Keyword (EN)"
                              density="compact"
                              variant="outlined"
                              hide-details
                              v-model="product.meta_keyword.en"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6">
                            <v-text-field
                              label="Meta Keyword (AR)"
                              density="compact"
                              variant="outlined"
                              hide-details
                              v-model="product.meta_keyword.ar"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-window-item>
                    </v-window>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          v-if="product.type != 'bundle'"
          class="panel-style"
          v-model="panel.pricing"
        >
          <v-expansion-panel>
            <v-expansion-panel-title v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-start title-box">
                  Pricing
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open" key="0"> Set data </span>
                    <span v-else key="1">
                      <span v-if="price != null && price != ''">
                        <span style="font-weight: 600">Price:</span>
                        {{ price }}
                      </span>
                      <span
                        v-if="
                          discounted_price != null && discounted_price != ''
                        "
                        ><span style="font-weight: 600"
                          >Discounted price :</span
                        >
                        {{ discounted_price }}
                      </span>
                      <span v-if="cost_per_item != null && cost_per_item != ''"
                        ><span style="font-weight: 600">Cost per item :</span>
                        {{ cost_per_item }}
                      </span>
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row class="mb-2" v-for="price in prices" :key="price">
                <v-col cols="4 d-flex align-center ">
                  <div class="text-body" style="margin-left: 0.5rem">
                    {{ price.name }}
                  </div>
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    v-model="price.price"
                    label="Price"
                    type="number"
                    min="0" counter
                    @keypress="isNumber($event)"
                    density="compact"
                    :suffix="price.currency"
                    variant="outlined"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="price.discounted_price"
                    label="Discounted Price"
                    type="number"
                    min="0" counter
                    @keypress="isNumber($event)"
                    density="compact"
                    :suffix="price.currency"
                    variant="outlined"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="3" class="ps-4">
        <v-expansion-panels class="panel-style mb-3" v-model="panel.status">
          <v-expansion-panel>
            <v-expansion-panel-title class="px-0">
              Status
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-select
                class="mt-4"
                v-model="product.website_status"
                :items="statuses"
                label="Status"
                variant="outlined"
                item-title="name"
                item-value="value"
                density="compact"
              ></v-select>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          class="panel-style panel-style-with-btn mb-3"
          v-model="panel.category"
        >
          <v-expansion-panel>
            <v-expansion-panel-title
              class="px-0 py-3 d-flex align-center justify-space-between"
            >
              <span class="w-100">Categories</span>
              <v-btn
                size="x-small"
                icon="mdi-plus"
                @click="goTo('Categories')"
                color="#b8b8b8"
              >
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <Tree
                v-if="product.categories"
                style="padding: 0"
                class="mt-4"
                :nodes="product.categories"
                :use-checkbox="true"
                :use-icon="false"
                show-child-count
                v-model:nodes="product.categories"
                :id="product.categories.id"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          class="panel-style panel-style-with-btn mb-3"
          v-model="panel.label"
        >
          <v-expansion-panel>
            <v-expansion-panel-title
              class="px-0 py-3 d-flex align-center justify-space-between"
            >
              <span class="w-100">Label</span>
              <v-btn
                size="x-small"
                icon="mdi-plus"
                @click="goTo('Labels')"
                color="#b8b8b8"
              >
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-select
                class="mt-4"
                v-model="product.labels"
                :items="labels"
                item-title="name"
                item-value="id"
                label="Label"
                variant="outlined"
                density="compact"
                chips
                multiple
              ></v-select>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels
          class="panel-style panel-style-with-btn mb-3"
          v-model="panel.tag"
        >
          <v-expansion-panel>
            <v-expansion-panel-title
              class="px-0 py-3 d-flex align-center justify-space-between"
            >
              <span class="w-100">Tags</span>
              <v-btn
                size="x-small"
                icon="mdi-plus"
                @click="goTo('Tags')"
                color="#b8b8b8"
              >
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-select
                class="mt-4"
                v-model="product.tags"
                :items="tags"
                item-title="name"
                item-value="id"
                label="Tags"
                variant="outlined"
                density="compact"
                chips
                multiple
              ></v-select>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <!--0 => Add one-->
    <!--1 => Add one and make form empty-->
    <div class="d-flex justify-end my-3">
      <v-btn
        rounded="pill"
        color="primary"
        size="x-large"
        @click="create_update_Product"
        class="mt-3"
      >
        Add one
      </v-btn>
      <v-btn
        rounded="pill"
        color="primary"
        size="x-large"
        @click="create_update_Product(1)"
        class="mt-3 mx-2"
      >
        Add Multi
      </v-btn>
    </div>
  </v-container>

  <v-dialog v-model="add_product" persistent class="add-product-dialog">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="mt-2">
            <v-select
              label="Values"
              variant="outlined"
              :items="categories_list"
              v-model="storedProductsSearch.category"
              item-title="name"
              item-value="id"
              density="compact"
              hide-details
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="mt-2">
            <v-text-field
              label="Product Search"
              v-model="storedProductsSearch.product_name"
              v-debounce:500ms="searchProduct"
              debounce-events="update"
              density="compact"
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="8">
            <span>Product</span>
          </v-col>
          <v-col cols="4">
            <span>Price</span>
          </v-col>
        </v-row>
        <v-row v-for="product in storedProducts" :key="product">
          <v-col cols="8">
            <v-row>
              <v-col cols="4">
                <v-img
                  :src="product.image"
                  :lazy-src="product.image"
                  aspect-ratio="1"
                  height="65"
                  width="110"
                  cover
                  class="bg-grey-lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey-lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
              <v-col
                cols="8"
                class="align-center"
                style="padding-left: 0px !important"
              >
                <span style="position: absolute; transform: translateY(50%)">{{
                  product.name.en
                }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-col cols="6">
                <span
                  style="position: absolute; transform: translateY(50%)"
                  v-for="item in product.prices"
                  :key="item"
                  >{{ product.prices ? item.price : "--" }}</span
                >
              </v-col>
              <v-col
                cols="6"
                v-if="!this.bundleProductsIDs.includes(product.id)"
              >
                <v-btn
                  class="mr-4"
                  size="x-small"
                  icon="mdi-plus"
                  @click="addProductToBundule(product.id)"
                  color="#b8b8b8"
                ></v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black-darken-1" text @click="add_product = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</template>

<script>
import ProductMixin from "../Mixin/product-mixin";
import numberOnlyMixin from "../Mixin/numberOnlyMixin";
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";

export default {
  name: "AddProductPage",
  mixins: [ProductMixin, numberOnlyMixin],
  setup() {
    const root = useRootStore();
    const { loader } = storeToRefs(root);

    return {
      loader,
    };
  },

  mounted() {
    this.getProductData();
    this.loader = false;
  },
};
</script>

<style lang="scss">
.error-editor {
  border: red solid 3px !important;
}
.error-tab{
  background-color: #ff000038!important;
  border: 1px solid antiquewhite!important;
}
.v-theme--light {
  .tree-row-item:hover {
    background-color: #767171 !important;
    color: #f9f9f9;
  }

  .image-box {
    background: #fefefe !important;
    border: 1px dashed #6b6b6b !important;
  }
  .product-data {
    padding-top: 18px;
  }
}

//input fields

.panel-style.v-theme--light .v-field {
  background-color: #fefefe !important;
  // border-radius: 2rem;
}
.panel-style.v-theme--light .v-field:hover {
  border-color: transparent !important;
}
.tree-row-item {
  padding: 0px !important;
}
.v-theme--dark {
  .image-box {
    background: #212121 !important;
    border: 1px dashed #6b6b6b !important;
  }
  .tree-row-item:hover {
    background-color: #6f6f6f !important;
    color: #ddd;
  }
}
.image-box {
  border: 1px dashed !important;
}
.v-field .v-field__append-inner {
  padding-top: 0.5rem !important;
}
.padding-right-inputs {
  padding-top: 1.1rem !important;
}

.v-tabs--horizontal .v-tab {
  --v-btn-height: 0 !important;
}
.v-tabs--horizontal .v-slide-group__content {
  max-height: 1.4rem;
}
.v-tabs--horizontal .v-window {
  padding-top: 10px;
}
.v-tabs--horizontal .tab-col {
  padding: 0 !important;
}
.v-tabs--horizontal .v-tabs--fixed-tabs .v-slide-group__content > *,
.v-tabs--centered .v-slide-group__content > * {
  max-height: 2rem !important;
  max-width: 1rem !important;
  margin: 0 !important;
  padding: 0 !important;
}
.v-window__container {
  padding-top: 8px !important;
}
.plus-button {
  color: #212121;
  font-size: 1.5em;
  color: #fff;
  border-radius: 100% !important;
  width: 50px;
  height: 50px !important;
  margin-bottom: 2rem;
}
.v-theme--light .v-expansion-panel {
  background-color: #f9f9f9;
}
.v-expansion-panel {
  padding-inline: 12px;
}
.v-theme--light .v-expansion-panel-title__overlay {
  background-color: #f9f9f9;
}
.v-theme--dark .v-expansion-panel-title__overlay {
  background-color: #212121;
}
.v-expansion-panel--active > .v-expansion-panel-title {
  border-bottom: 1px solid #dcd9d9 !important;
}
.panel-style .v-field--focused {
  border: none !important;
}

.panel-style .v-expansion-panel {
  border-radius: 12px !important;
}
.v-theme--light .textarea-panel-style .v-field__field {
  background-color: #fefefe !important;
}
.v-theme--light .ql-toolbar {
  background-color: #fefefe !important;
}
.ql-toolbar {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}
.ql-container {
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}
.v-text-field__suffix {
  padding-top: 8px !important;
}

.product-container .editor {
  height: 200px !important;
}

.v-theme--dark .imgsPreview .imageHolder .plus[data-v-69bb59a3] {
  color: white !important;
  background: #212121 !important;
}
.v-theme--dark .clearButton {
  color: white !important;
}

.title-box {
  font-weight: 600;
  font-size: 17px;
}
.add-close-icon .v-icon {
  vertical-align: inherit !important;
}

.variation-panels .v-expansion-panel-text__wrapper {
  padding-left: 0px !important;
}
.variation-panels .v-label {
  max-width: fit-content !important;
}
.add-product-dialog .v-overlay__content {
  width: 50%;
}

.add-product-dialog .v-card {
  border-radius: 12px !important;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #cdcdcd;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: grey;
}

.panel-style-with-btn {
  .v-expansion-panel-title__icon {
    margin-inline-start: 5px !important;
  }
}
.v-counter{
  display: none;
}
</style>
