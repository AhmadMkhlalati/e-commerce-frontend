<template>
  <v-container class="product-container" style="width: 100%; overflow-x: auto">
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
      <v-col cols="9">
        <v-row>
          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.title">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start title-box">
                      Title
                    </v-col>
                    <v-col cols="8" class="text--secondary"> </v-col>
                  </v-row>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <!-- Title Tabs -->
                  <v-row>
                    <v-col cols="12" class="d-flex justify-center tab-col">
                      <v-tabs v-model="titleTab" color="primary" centered>
                        <v-tab :value="'en'"> EN </v-tab>
                        <v-tab :value="'ar'"> AR </v-tab>
                      </v-tabs>
                    </v-col>
                  </v-row>

                  <v-window v-model="titleTab">
                    <v-window-item :value="'en'">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            density="compact"
                            label="English Title of The Product"
                            variant="outlined"
                            :error-messages="errors['name.en']"
                            v-model="product.name.en"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-row>
                            <v-col
                              :cols="edit_permalink ? '9' : '6'"
                              style="display: flex"
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
                                :error-messages="errors.slug"
                              ></v-text-field>
                              <v-icon
                                class="mx-3"
                                :style="
                                  edit_permalink
                                    ? 'font-size:26px'
                                    : 'font-size:20px '
                                "
                                :icon="
                                  !edit_permalink
                                    ? 'mdi-pencil'
                                    : 'mdi-content-save'
                                "
                                @click="edit_permalink = !edit_permalink"
                              ></v-icon>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-window-item>
                    <v-window-item :value="'ar'">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            density="compact"
                            label="Arabic Title of The Product"
                            variant="outlined"
                            :error-messages="errors['name.ar']"
                            v-model="product.name.ar"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-row>
                            <v-col
                              :cols="edit_permalink ? '9' : '6'"
                              style="display: flex"
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
                                  edit_permalink
                                    ? 'font-size:26px'
                                    : 'font-size:20px '
                                "
                                :icon="
                                  !edit_permalink
                                    ? 'mdi-pencil'
                                    : 'mdi-content-save'
                                "
                                @click="edit_permalink = !edit_permalink"
                              ></v-icon>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-window-item>
                  </v-window>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>

          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.description">
              <v-expansion-panel>
                <v-expansion-panel-title v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start title-box">
                      Descriptions
                    </v-col>
                    <v-col cols="8" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open" key="0">
                          Select trip destination
                        </span>
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
                              ref="description_en"
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
                              ref="specification_en"
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
          </v-col>

          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.media">
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
                    <v-col cols="4" class="mt-1 pb-0">
                      <v-img :src="product_data.image" height="160"></v-img>
                    </v-col>
                    <v-col cols="8">
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
                  <v-row justify="center">
                    <template v-if="product_data.images">
                      <template
                        v-if="product_data.images.length > 0"
                        height="300"
                        style="padding-bottom: 1rem"
                      >
                        <template
                          v-for="(item, i) in product_data.images"
                          :key="i"
                        >
                          <v-col cols="2">
                            <v-btn
                              size="x-small"
                              class="ma-2 delete-image"
                              @click="deleteImage(item.id, i)"
                              color="black"
                              icon="mdi-close"
                            ></v-btn>
                            <v-img :src="item.image" height="160"></v-img>
                          </v-col>
                        </template>
                      </template>
                    </template>

                    <template v-else> No Images Left </template>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="enable_upload_images_input"
                        hide-details
                        label="Upload Images"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" v-if="enable_upload_images_input">
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
          </v-col>

          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.setup">
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
                        disabled
                        v-model="product.type"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="3" style="border-right: 1px solid #dcd9d9">
                      <v-tabs
                        v-model="tab"
                        direction="vertical"
                        color="primary"
                      >
                        <v-tab
                          value="general"
                          :class="{ 'error-tab': errorsTab.general }"
                          :slider-color="errorsTab.general ? 'red' : ''"
                        >
                          <v-icon start> mdi-file-find </v-icon>
                          General
                        </v-tab>
                        <v-tab
                          v-if="product.type != 'service'"
                          value="shipping"
                          :class="{ 'error-tab': errorsTab.shipping }"
                          :slider-color="errorsTab.shipping ? 'red' : ''"
                        >
                          <v-icon start> mdi-truck </v-icon>
                          Shipping
                        </v-tab>
                        <v-tab
                          value="inventory"
                          :class="{ 'error-tab': errorsTab.inventory }"
                          :slider-color="errorsTab.inventory ? 'red' : ''"
                        >
                          <v-icon start> mdi-trending-up </v-icon>
                          Inventory
                        </v-tab>

                        <v-tab
                          v-if="product.type == 'variable'"
                          value="attributes"
                          :class="{ 'error-tab': errorsTab.attributes }"
                          :slider-color="errorsTab.attributes ? 'red' : ''"
                        >
                          <v-icon start> mdi-tag-outline </v-icon>
                          Attributes
                        </v-tab>
                        <v-tab
                          v-if="product.type == 'variable'"
                          value="varients"
                          :class="{ 'error-tab': errorsTab.varients }"
                          :slider-color="errorsTab.varients ? 'red' : ''"
                        >
                          <v-icon start> mdi-arrow-decision-outline </v-icon>
                          Variants
                        </v-tab>

                        <v-tab
                          v-if="product.type == 'bundle'"
                          value="bundle_management"
                          :class="{ 'error-tab': errorsTab.bundle_management }"
                          :slider-color="
                            errorsTab.bundle_management ? 'red' : ''
                          "
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
                                  disabled
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
                                  :error-message="errors.products_statuses_id"
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
                                :unrequired_fields="unrequired_fields"
                                :errors="errors.required_fields"
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
                                  counter
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
                                  counter
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
                                  counter
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
                                  counter
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
                                  @keypress="isNumber($event)"
                                  suffix="Piece"
                                  :error-messages="errors.quantity"
                                  v-model="product.quantity"
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
                                  type="number"
                                  counter
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
                                  type="number"
                                  counter
                                  @keypress="isNumber($event)"
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
                              v-for="(
                                attribute, index
                              ) in attributes_selected_ids"
                              :key="index"
                            >
                              <v-row class="pb-3 mt-2">
                                <v-col
                                  cols="12"
                                  v-if="errors.product_variations"
                                >
                                  <p style="color: red">
                                    {{ errors.product_variations[0] }}
                                  </p>
                                </v-col>
                                <v-col cols="4">
                                  <v-select
                                    label="Name"
                                    variant="outlined"
                                    density="compact"
                                    :items="attributes_fields"
                                    item-title="title"
                                    item-value="id"
                                    :errors-messages="errors.product_variations"
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
                                    item-title="value"
                                    item-value="id"
                                    density="compact"
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
                                    @click="
                                      deleteOptionAttribute(index, attribute)
                                    "
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
                                      attributes_obj[attribute]
                                        .used_for_variations
                                    "
                                  ></v-checkbox>
                                </v-col>
                              </v-row>
                              <v-divider></v-divider>
                            </template>
                          </v-window-item>
                          <v-window-item
                            v-if="enableVariantsTab"
                            value="varients"
                          >
                            <v-row justify="space-between">
                              <v-col
                                cols="4"
                                v-if="
                                  attributes_selected_ids.length > 0 &&
                                  attributes_obj[attributes_selected_ids[0]]
                                    .used_for_variations
                                "
                              >
                                <v-select
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
                                ></v-select>
                              </v-col>

                              <v-col cols="2" style="">
                                <v-btn
                                  v-if="
                                    product_variations.length < max_variables
                                  "
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
                            </v-row>
                            <v-expansion-panels class="mt-4 variation-panels">
                              <v-expansion-panel
                                v-for="(
                                  var_product, index
                                ) in product_variations"
                                :key="index"
                              >
                                <v-expansion-panel-title>
                                  # {{ index + 1 }}
                                  <template v-slot:actions="{ expanded }">
                                    <v-icon
                                      @click="
                                        deleteProductFromVariations(index)
                                      "
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
                                      v-for="(
                                        select, i
                                      ) in attributes_selected_ids"
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
                                          is_default_child.index != index
                                        "
                                        v-debounce="
                                          (val) => {
                                            is_default_child.status =
                                              !is_default_child.status;
                                            is_default_child.index =
                                              is_default_child.status
                                                ? index
                                                : '';
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
                                    <v-col cols="12" class="mt-1 pb-0">
                                      <v-img
                                        :src="var_product.image"
                                        height="160"
                                      ></v-img>
                                    </v-col>
                                    <v-col cols="12" class="pt-0">
                                      <UploadImages
                                        max="1"
                                        class="image-box"
                                        @changed="
                                          (val) => {
                                            handleVariableMainImage(val, index);
                                          }
                                        "
                                      />
                                    </v-col>
                                    <v-col cols="12" class="mt-1 pb-0">
                                      <span style="font-size: 15px">
                                        Add Gallery
                                      </span>
                                    </v-col>
                                    <v-col cols="12" class="mt-1 pb-0">
                                      <template v-if="var_product.images">
                                        <template
                                          v-if="var_product.images.length > 0"
                                          height="300"
                                          style="padding-bottom: 1rem"
                                        >
                                          <v-row>
                                            <template
                                              v-for="(
                                                item, i
                                              ) in var_product.images"
                                              :key="i"
                                            >
                                              <v-col cols="2">
                                                <v-btn
                                                  size="x-small"
                                                  class="ma-2 delete-image"
                                                  @click="
                                                    deleteVariantsImages(
                                                      item.id,
                                                      i,
                                                      index
                                                    )
                                                  "
                                                  color="black"
                                                  icon="mdi-close"
                                                ></v-btn>

                                                <v-img
                                                  :src="item.image"
                                                  height="100"
                                                ></v-img>
                                              </v-col>
                                            </template>
                                          </v-row>
                                        </template>
                                      </template>

                                      <template v-else>
                                        No Images Left
                                      </template>
                                    </v-col>
                                    <v-col cols="12" class="pt-0">
                                      <UploadImages
                                        class="image-box"
                                        @changed="
                                          (val) => {
                                            handleVariableGalleryImages(
                                              val,
                                              index
                                            );
                                          }
                                        "
                                      />
                                    </v-col>
                                  </v-row>

                                  <v-row class="mt-2">
                                    <v-col cols="6">
                                      <v-select
                                        v-model="
                                          var_product.products_statuses_id
                                        "
                                        :items="product_status"
                                        item-title="name"
                                        item-value="id"
                                        label="Product Status"
                                        variant="outlined"
                                        density="compact"
                                        :error-messages="
                                          errors[
                                            'product_variations.' +
                                              index +
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
                                        :error-messages="
                                          errors[
                                            'product_variations.' +
                                              index +
                                              '.code'
                                          ]
                                            ? 'The field is required.'
                                            : ''
                                        "
                                        disabled
                                        v-model="var_product.code"
                                      ></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                      <v-text-field
                                        label="SKU"
                                        density="compact"
                                        variant="outlined"
                                        :error-messages="
                                          errors[
                                            'product_variations.' +
                                              index +
                                              '.sku'
                                          ]
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
                                            'product_variations.' +
                                              index +
                                              '.barcode'
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
                                        :error-messages="
                                          errors[
                                            'product_variations.' +
                                              index +
                                              '.quantity'
                                          ]
                                            ? 'The field is required.'
                                            : ''
                                        "
                                        type="number"
                                        counter
                                        @keypress="isNumber($event)"
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
                                        counter
                                        @keypress="isNumber($event)"
                                        v-model="var_product.minimum_quantity"
                                      ></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                      <v-text-field
                                        label="Reserved Quantity"
                                        density="compact"
                                        variant="outlined"
                                        hide-details
                                        type="number"
                                        counter
                                        @keypress="isNumber($event)"
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
                                      v-for="(
                                        price, i_price
                                      ) in prices_original"
                                      :key="i_price"
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
                                            var_product['prices'][i_price][
                                              'price'
                                            ]
                                          "
                                          label="Price"
                                          type="number"
                                          counter
                                          @keypress="isNumber($event)"
                                          density="compact"
                                          :suffix="price.currency"
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
                                          counter
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
                                        counter
                                        @keypress="isNumber($event)"
                                        :error-messages="
                                          errors[
                                            'product_variations.' +
                                              i +
                                              '.weight'
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
                                          counter
                                          @keypress="isNumber($event)"
                                          :error-messages="
                                            errors[
                                              'product_variations.' +
                                                i +
                                                '.length'
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
                                          counter
                                          @keypress="isNumber($event)"
                                          :error-messages="
                                            errors[
                                              'product_variations.' +
                                                i +
                                                '.width'
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
                                          counter
                                          @keypress="isNumber($event)"
                                          :error-messages="
                                            errors[
                                              'product_variations.' +
                                                i +
                                                '.height'
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
                              <v-row v-for="id in bundleProductsIDs" :key="id">
                                <v-col cols="12">
                                  <v-expansion-panels
                                    class="mt-4 variation-panels"
                                  >
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
                                              :error-messages="
                                                errors[
                                                  'related_products.' +
                                                    i +
                                                    '.child_quantity'
                                                ]
                                              "
                                              type="number"
                                              counter
                                              @keypress="isNumber($event)"
                                              v-model="
                                                bundleProducts[id].quantity
                                              "
                                            ></v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row class="mt-4">
                                          <v-col cols="3  ">
                                            <v-subheader
                                              >Product Info:</v-subheader
                                            >
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
                                                    bundleProducts[id]
                                                      .nameStatus
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
                                                  bundleProducts[id]
                                                    .nameStatus == 'custom'
                                                "
                                              >
                                                <v-col cols="6" class="py-0">
                                                  <v-text-field
                                                    label="Custom product name English"
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
                                                    label="Custom product name Arabic"
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
                                        v-if="
                                          bundles_pricing_list_ids.length > 0
                                        "
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
                                    <tr
                                      v-for="id in bundleProductsIDs"
                                      :key="id"
                                    >
                                      <td>
                                        {{ bundleProducts[id].name.en }}
                                      </td>

                                      <template
                                        v-if="
                                          bundles_pricing_list_ids.length > 0
                                        "
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
                                              ? bundleProducts[id].prices[p]
                                                  .price
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
                                <v-radio-group
                                  v-model="bundlePricingStatus"
                                  inline
                                >
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

                            <template
                              v-if="bundles_pricing_list_ids.length > 0"
                            >
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
                                    hide-details
                                    :suffix="pricing_list[price].currency"
                                    v-model="pricing_list[price].price"
                                    type="number"
                                    counter
                                    @keypress="isNumber($event)"
                                  ></v-text-field>
                                </v-col>

                                <v-col cols="4">
                                  <v-text-field
                                    label="Discounted Price"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    :suffix="pricing_list[price].currency"
                                    v-model="
                                      pricing_list[price].discounted_price
                                    "
                                    type="number"
                                    counter
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
          </v-col>

          <v-col cols="12" v-if="product.type != 'bundle'">
            <v-expansion-panels class="panel-style" v-model="panel.pricing">
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
                          <span
                            v-if="cost_per_item != null && cost_per_item != ''"
                            ><span style="font-weight: 600"
                              >Cost per item :</span
                            >
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
                        counter
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
                        counter
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
        </v-row>
      </v-col>

      <v-col cols="3">
        <v-row>
          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.status">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start title-box">
                      Status
                    </v-col>
                    <v-col cols="8" class="text--secondary"> </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" class="padding-right-inputs">
                      <v-select
                        v-model="product.website_status"
                        :items="statuses"
                        label="Status"
                        variant="outlined"
                        item-title="name"
                        item-value="value"
                        density="compact"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.category">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="6" class="d-flex justify-start title-box">
                      Categories
                    </v-col>
                    <v-col cols="5" class="d-flex justify-end">
                      <v-btn
                        class="add-btn"
                        size="x-small"
                        icon="mdi-plus"
                        @click="goTo('Categories')"
                        color="#b8b8b8"
                      >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row style="margin: 0.6rem; border-radius: 0.4rem">
                    <v-col
                      cols="12"
                      v-if="product.categories"
                      style="padding: 0"
                    >
                      <Tree
                        :nodes="product.categories"
                        :use-checkbox="true"
                        :use-icon="false"
                        show-child-count
                        v-model:nodes="product.categories"
                        :id="product.categories.id"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.label">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="6" class="d-flex justify-start title-box">
                      Label
                    </v-col>
                    <v-col cols="5" class="d-flex justify-end">
                      <v-btn
                        style="position: absolute; transform: translateY(20%)"
                        class="add-btn"
                        size="x-small"
                        icon="mdi-plus"
                        @click="goTo('Labels')"
                        color="#b8b8b8"
                      >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" class="padding-right-inputs">
                      <v-select
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
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels class="panel-style" v-model="panel.tag">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="6" class="d-flex justify-start title-box">
                      Tags
                    </v-col>
                    <v-col cols="5" class="d-flex justify-end">
                      <v-btn
                        class="add-btn"
                        size="x-small"
                        icon="mdi-plus"
                        @click="goTo('Tags')"
                        color="#b8b8b8"
                      >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" class="padding-right-inputs">
                      <v-select
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
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-btn
      rounded="pill"
      color="primary"
      size="x-large"
      @click="create_update_Product"
      class="mt-3"
      style="float: right"
    >
      Update
    </v-btn>
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
                  product.name
                }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-col cols="6">
                <span style="position: absolute; transform: translateY(50%)">{{
                  product.price ? product.price : "--"
                }}</span>
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

  data() {
    return {
      enable_upload_images_input: false,
      product_prices_obj: [],
      product_data: {},
    };
  },
  methods: {
    deleteImage(id, i) {
      this.product_data.images.splice(i, 1);
      this.product.images_deleted.push(id);
    },
    deleteVariantsImages(image_id, element_id, varian_id) {
      this.product_variations[varian_id]["images"].splice(element_id, 1);
      this.product_variations[varian_id]["images_deleted"].push(image_id);
    },

    fillProductData() {
      if (this.product_data != {}) {
        this.product.type = this.product_data.type;
        this.product.name = this.product_data.name;
        this.product.summary = this.product_data.summary;

        this.product.website_status = this.product_data.website_status;
        this.product_data.labels.forEach((e) => this.product.labels.push(e.id));
        this.product_data.tags.forEach((e) => this.product.tags.push(e.id));

        this.product.length = this.product_data["length"];
        this.product.weight = this.product_data.weight;
        this.product.width = this.product_data.width;
        this.product.height = this.product_data.height;

        this.product.sku = this.product_data.sku;
        this.product.code = this.product_data.code;
        this.product.barcode = this.product_data.barcode;
        this.product.products_statuses_id =
          this.product_data.products_statuses_id;

        this.product.unit_id = this.product_data.unit.id;
        this.product.tax_id = this.product_data.tax.id;
        this.product.brand_id = this.product_data.brand.id;
        this.product.categories = this.product_data.categories;
        this.product.category_id = this.product_data.category.id;

        this.product.quantity = this.product_data.quantity;
        this.product.minimum_quantity = this.product_data.minimum_quantity;
        this.product.reserved_quantity = this.product_data.reserved_quantity;
        this.product.pre_order = this.product_data.pre_order ? true : false;
        this.product.meta_description = this.product_data.meta_description || {
          en: "",
          ar: "",
        };
        this.product.meta_keyword = this.product_data.meta_keyword || {
          en: "",
          ar: "",
        };
        this.product.meta_title = this.product_data.meta_title || {
          en: "",
          ar: "",
        };
        this.product.images = this.product_data.images;
        if (this.product_data.description.ar != undefined) {
          this.product.description = this.product_data.description;
          this.$refs.description_en.setHTML(this.product_data.description.en);
        }
        if (this.product_data.specification.ar != undefined ) {
          this.product.specification = this.product_data.specification;
          this.$refs.specification_en.setHTML(
            this.product_data.specification.en
          );
        }
        if (this.product_data.prices.length > 0) {
          this.product_data.prices.forEach((element) => {
            this.product_prices_obj[element.price_id] = element;
          });
          this.prices.forEach((p) => {
            if (this.product_prices_obj[p.price_id] != undefined) {
              p.id = this.product_prices_obj[p.price_id].id;
              p.price = this.product_prices_obj[p.price_id].price;
              p.discounted_price =
                this.product_prices_obj[p.price_id].discounted_price;
            }
          });
        }

        if (this.product_data.products_fields.length > 0) {
          this.product_data.products_fields.forEach((f) => {
            if (!this.object_fields[f.field_id].is_required) {
              this.fields.push(f.field_id);
            }
            if (this.object_fields[f.field_id].type == "checkbox") {
              this.object_fields[f.field_id].value =
                f.value == 1 ? true : false;
            }
            if (
              this.object_fields[f.field_id].type == "text" ||
              this.object_fields[f.field_id].type == "textarea"
            ) {
              this.object_fields[f.field_id].value = JSON.parse(
                JSON.parse(f.value)
              );
            } else {
              this.object_fields[f.field_id].value = f.value;
            }
          });
        }

        if (this.product_data.type == "bundle") {
          this.product.bundle_price_status =
            this.product_data.bundle_price_status;
          if (this.product_data.related_products.length > 0) {
            // inserting bundle's sub-products
            this.product_data.related_products.forEach((e) => {
              this.bundleProductsIDs.push(e.id);
              this.bundleProducts[e.id] = JSON.parse(JSON.stringify(e));
              this.bundleProducts[e.id].quantity = parseInt(e.child_quantity);
              this.bundleProducts[e.id].prices = e.prices;

              // check child product name status
              if (e.child_name_status != undefined) {
                this.bundleProducts[e.id].name = JSON.parse(
                  JSON.stringify(e.name_original)
                );
                this.bundleProducts[e.id].nameStatus = e.child_name_status;

                if (this.bundleProducts[e.id].nameStatus == "hide") {
                  this.bundleProducts[e.id].custom_name_en = "";
                  this.bundleProducts[e.id].custom_name_ar = "";
                } else if (this.bundleProducts[e.id].nameStatus == "default") {
                  this.bundleProducts[e.id].custom_name_en = e.name_original.en;
                  this.bundleProducts[e.id].custom_name_ar = e.name_original.ar;
                } else if (this.bundleProducts[e.id].nameStatus == "custom") {
                  this.bundleProducts[e.id].custom_name_en = e.name.en;
                  this.bundleProducts[e.id].custom_name_ar = e.name.ar;
                } else {
                  this.bundleProducts[e.id].nameStatus = "default";
                  this.bundleProducts[e.id].custom_name_en = e.name_original.en;
                  this.bundleProducts[e.id].custom_name_ar = e.name_original.ar;
                }
              } else {
                this.bundleProducts[e.id].nameStatus = "default";
                this.bundleProducts[e.id].custom_name_en = e.name_original.en;
                this.bundleProducts[e.id].custom_name_ar = e.name_original.ar;
              }

              this.bundleProducts[e.id].name = e.name_original;
            });
            // inserting prices
            this.product_data.prices.forEach((p) => {
              this.bundles_pricing_list_ids.push(p.price_id);
              this.pricing_list[p.price_id] = p;
              this.pricing_list[p.price_id].id = p.price_id;
            });
          }
        } else if (this.product_data.type == "variable") {
          if (
            this.product_data.attributes_fields.length > 0 &&
            this.product_data.variations.length > 0
          ) {
            this.product_variations = this.product_data.variations;
            this.attributes_selected_ids.pop();

            this.product_data.attributes_fields.forEach((e) => {
              let id = parseInt(e.field_id);

              if (!this.attributes_selected_ids.includes(id)) {
                this.attributes_selected_ids.push(id);
                this.removeItemOnceFromUnselectedAttributes(id);
              }

              this.attributes_obj[id].used_for_variations = true;

              if (!this.attributes_obj[id].selected_values)
                this.attributes_obj[id].selected_values = [];
              this.attributes_obj[id].selected_values.push(
                parseInt(e.field_value_id)
              );
            });

            this.product_data.variations.forEach((v, index) => {
              v.images_deleted = [];
              if (v.is_default_child) {
                this.is_default_child = {
                  status: true,
                  index: index,
                };
              }
              v.potential_fields = [];
              this.attributes_selected_ids.forEach((id, i) => {
                v.potential_fields[id] = {
                  field_id: id,
                  is_attribute: true,
                  type: "select",
                  value:
                    id == v.attributes_fields[i].field_id
                      ? v.attributes_fields[i].value
                      : null,
                };
              });
            });
          }
        }

        // if(response.data.data.attributes.length > 0){

        //   let temp_obj = {};
        //   response.data.data.attributes.forEach(element => {
        //     this.attributes_unselected_ids.push(element.id);
        //     temp_obj[element.id] = element;
        //     temp_obj[element.id].used_for_variations = false;
        //   });
        //   this.attributes_obj = temp_obj;
        // }
      }
    },
  },
  mounted() {
    this.getProductData().then(() => this.fillProductData());
    this.loader = false;
  },
};
</script>

<style lang="scss">
.error-editor {
  border: red solid 3px !important;
}
.error-tab {
  background-color: #ff000038 !important;
  border: 1px solid antiquewhite !important;
}
.delete-image {
  transform: translate(-1.2rem, 2rem);
  font-size: 0.7rem;
  z-index: 200;
  max-width: 1.3rem !important;
  max-height: 1.3rem;
}
.v-theme--light {
  .add-btn {
    width: 1.4rem !important;
    height: 1.4rem !important;
    color: #fefefe !important;
    background-color: #292929 !important;
    transform: translateY(-18%) !important;
    box-shadow: none !important;
    .v-btn__icon {
      margin-right: 1px !important;
      margin-bottom: 1px !important;
    }
  }
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
.tree-row-item {
  padding: 0px !important;
}
//input fields

.panel-style.v-theme--light .v-field {
  background-color: #fefefe !important;
  // border-radius: 2rem;
}
.panel-style.v-theme--light .v-field:hover {
  border-color: transparent !important;
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
.v-expansion-panel-title {
  padding: 0px !important;
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
</style>
