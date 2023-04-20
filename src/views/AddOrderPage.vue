<template>

  <!-- main -->
  <v-container class="order-container" style="width: 100%;overflow-x: auto;">
      <!-- success alert -->
      <v-alert v-if="isSucceed_alert" density="comfortable" type="success" variant="tonal"> 
        {{successMessage}}
      </v-alert>
        <!-- error alert -->
        <v-alert v-if="isFaild" density="comfortable" type="error" variant="tonal" > 
        {{errorMessage}}
        </v-alert>
        <!-- <form>  -->
        <v-row>
          <v-col cols="9">
            <v-row>
              <v-col cols="12">
                <v-card
                      class="mx-auto"
                    >
                    <v-card-text>
                          <v-row >
                            <!-- success alert -->
                            <v-alert class="order-success-alert-id" v-if="isSucceed" density="comfortable" type="success" variant="tonal" style="position: relative !important;max-width:100% !important;z-index: 100;"> 
                              {{successMessage}} <strong>{{data_returned_after_success.prefix ?  data_returned_after_success.prefix + ' /' : ''}} </strong>  
                            </v-alert>
                          
                          <v-col cols="12" class="title-box" v-else>
                            New Order
                          </v-col>
                   
                        </v-row>
                             <v-row class="mt-3">
                             <v-col cols="12" class="mt-4 pb-0 font-weight-black">
                              <v-subheader>General:</v-subheader>
                              </v-col>
                              <v-col cols="4" >
                              <v-select
                                :items="data_create.customers"
                                v-model="order_data.client_id"
                                :error-messages="errors.client_id ? errors.client_id : ''"
                                label="Client's Name"
                                item-title="value"
                                item-value="id"
                                variant="outlined"
                                density="compact"
                                clearable
                                :hide-details="errors.client_id ?  errors.client_id.length != 0  ? false : true : ''"
                              ></v-select>
                              </v-col>
                        
                                 <v-col cols="4"  >
                                <v-text-field
                                  density="compact"
                                  v-model="order_data.date"
                                  variant="outlined"
                                  hide-details
                                  label="Date"
                                  type="date"
                                  readonly
                                  disabled
                                ></v-text-field>
                                </v-col>
                              <v-col cols="4" >
                                  <v-select
                                    :items="data_create.currencies"
                                    v-model="order_data.currency_id"
                                    label="Currency"
                                    item-title="value"
                                    item-value="id"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                  ></v-select>
                              </v-col>
                              <v-col cols="4" >
                                  <v-text-field
                                    density="compact"
                                    label="Rate"
                                    variant="outlined"
                                    hide-details
                                    v-model="order_data.currency_rate"
                                    :disabled="currencies_obj[order_data.currency_id] ? currencies_obj[order_data.currency_id].is_default : false"
                                    type="number"
                                   
                                ></v-text-field>
                              </v-col>
                              
                                <v-col cols="12" class=" pb-0 font-weight-black">
                                    <v-subheader>Comments:</v-subheader>
                                </v-col>
                                  <v-col cols="4"  >
                                    <v-textarea
                                       v-model="order_data.comment"
                                       :error-messages="errors.comment"
                                        filled
                                        auto-grow
                                        label="Write.."
                                        rows="3"
                                        row-height="10"
                                        required
                                        variant="outlined"
                                        :hide-details="errors.comment ?  errors.comment.length != 0  ? false : true : ''"
                                      ></v-textarea>
                                </v-col>       
                              </v-row>
                              <v-row class="mt-4">
                                <v-col cols="6" v-if="client_addresses[order_data.client_id]">
                                   <v-select
                                          :items="client_addresses[order_data.client_id].addresses"
                                          v-model="order_data.billing_address_id"
                                          label="Billing Address"
                                          item-title="value"
                                          item-value="id"
                                          variant="outlined"
                                          density="compact"
                                          clearable
                                          :hide-details="errors.client_id ?  errors.client_id.length != 0  ? false : true : ''"
                                    ></v-select>
                                </v-col>
                                  <v-col cols="6" v-if="client_addresses[order_data.client_id]">
                                        <v-select
                                          :items="client_addresses[order_data.client_id].addresses"
                                          v-model="order_data.shipping_address_id"
                                          label="Shipping Address"
                                          item-title="value"
                                          item-value="id"
                                          variant="outlined"
                                          density="compact"
                                          clearable
                                          :hide-details="errors.client_id ?  errors.client_id.length != 0  ? false : true : ''"
                                    ></v-select>

                                </v-col>
                                    <v-col cols="12">
                                      <v-checkbox
                                          v-model="order_data.is_billing_as_shipping"
                                          label="Shipping Details as billing details"
                                          hide-details
                                          :disabled="order_data.shipping_address_id != null || order_data.billing_address_id != null "
                                        ></v-checkbox>
                                    </v-col>
                                    <v-col cols="6" v-if="!edit_billing">
                                      <v-row>
                                          <v-col cols="2"  >
                                            <span class="text-subtitle-2" style="padding-right:8px">Billing:</span>
                                          
                                          </v-col>
                                          <v-col cols="10" >
                                          
                                            <p class="text-caption " >{{order_data.billing.first_name ? order_data.billing.first_name : '---'}}  {{order_data.billing.last_name ? order_data.billing.last_name : '---'}} <v-icon class="mx-3" style="font-size:20px" icon="mdi-pencil" @click="edit_billing = true"></v-icon></p>
                                            <p class="text-caption pt-1" >{{countries_obj[order_data.billing.country_id] ? countries_obj[order_data.billing.country_id].value :'---' }}</p>
                                            <p class="text-caption pt-1" >{{order_data.billing.address_1 ? order_data.billing.address_1 : '---'}} </p>
                                            <p class="text-caption pt-1" >{{order_data.billing.address_2 ? order_data.billing.address_2 : '---'}} </p>
                                          </v-col>
                                          <v-col cols="12" >
                                            <span class="text-subtitle-2"  style="padding-right:8px">Email Address:</span>
                                            <a  class="text-caption" :style="order_data.billing.email_address ? 'text-decoration: underline;color:rgb(161, 161, 161)':''"> <span style="font-size:13px">{{order_data.billing.email_address ? order_data.billing.email_address : '---'}}</span></a>

                                          </v-col>
                                          <v-col cols="12" >
                                            <span class="text-subtitle-2" style="padding-right:8px">Phone Number:</span>
                                            <a  class="text-caption" :style="order_data.billing.phone_number ? 'text-decoration: underline;color:rgb(161, 161, 161)':''"> <span style="font-size:13px">{{order_data.billing.phone_number ? order_data.billing.phone_number : '---'}}</span></a>

                                          </v-col>

                                      </v-row>
                                    </v-col>
                                  <v-col cols="6" v-if="edit_billing">
                                          <v-row>
                                            <v-col cols="12" >
                                                <span class="text-subtitle-2" style="padding-right:8px">Billing:</span>
                                              
                                              </v-col>
                                            <v-col cols="6">

                                              <v-text-field
                                              v-model="order_data.billing.first_name"
                                              :error-messages="errors['billing.first_name'] ? errors['billing.first_name'] : ''"
                                              label="First name"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['billing.first_name'] ?  errors['billing.first_name'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                v-model="order_data.billing.last_name"
                                                :error-messages="errors['billing.last_name'] ? errors['billing.last_name'] : ''"
                                                label="Last name"
                                                density="compact"
                                                variant="outlined" 
                                                :hide-details="errors['billing.last_name'] ?  errors['billing.last_name'].length != 0  ? false : true : ''">
                                                </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.billing.company_name"
                                              label="Company name"
                                              density="compact"
                                              variant="outlined"
                                              hide-details>
                                              </v-text-field>

                                            </v-col>
                                                <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.billing.address_1"
                                              :error-messages="errors['billing.address_1'] ? errors['billing.address_1'] : ''"
                                              label="Address 1"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['billing.address_1'] ?  errors['billing.address_1'].length != 0  ? false : true : ''">
                                              </v-text-field>
                               

                                            </v-col>
                                              <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.billing.address_2"
                                              :error-messages="errors['billing.address_2'] ? errors['billing.address_2'] : ''"
                                              label="Address 2"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['billing.address_2'] ?  errors['billing.address_2'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                          <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.billing.city"
                                              :error-messages="errors['billing.city'] ? errors['billing.city'] : ''"
                                              label="City"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['billing.city'] ?  errors['billing.city'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                                <v-select
                                                v-model="order_data.billing.country_id"
                                                :error-messages="errors['billing.country_id'] ? errors['billing.country_id'] : ''"
                                                :items="data_create.countries"
                                                label="Country"
                                                variant="outlined"
                                                item-title="value"
                                                item-value="id"
                                                density="compact"
                                                :hide-details="errors['billing.country_id'] ?  errors['billing.country_id'].length != 0  ? false : true : ''"
                                              ></v-select>
                                            </v-col>
                                            <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.billing.email_address"
                                              :error-messages="errors['billing.email_address'] ? errors['billing.email_address'] : ''"
                                              label="Email Address"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['billing.email_address'] ?  errors['billing.email_address'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.billing.phone_number"
                                              :error-messages="errors['billing.phone_number'] ? errors['billing.phone_number'] : ''"
                                              label="Phone Number"
                                              density="compact"
                                              variant="outlined"
                                              type="number"
                                              :hide-details="errors['billing.phone_number'] ?  errors['billing.phone_number'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                                <v-select
                                                v-model="order_data.billing.payment_method_id"
                                                :error-messages="errors['billing.payment_method_id'] ? errors['billing.payment_method_id'] : ''"
                                                :items="data_create.payment_methods"
                                                label="Payment Method"
                                                variant="outlined"
                                                item-title="value"
                                                item-value="id"
                                                density="compact"
                                                :hide-details="errors['billing.payment_method_id'] ?  errors['billing.payment_method_id'].length != 0  ? false : true : ''"
                                              ></v-select>
                            
                                            </v-col>

                                          </v-row>
                                        

                                  </v-col>
                             
                                    <v-col cols="6" v-if="!edit_shipping">
                                      <v-row>
                                          <v-col cols="2" >
                                            <span class="text-subtitle-2" style="padding-right:8px">Shipping:</span>
                                          
            
                                          </v-col>
                                          <v-col cols="10" >
                                          
                                  
                                            <p class="text-caption " >{{order_data.shipping.first_name ? order_data.shipping.first_name : '---'}}  {{order_data.shipping.last_name ? order_data.shipping.last_name : '---'}} <v-icon class="mx-3" style="font-size:20px" v-if="!order_data.is_billing_as_shipping" icon="mdi-pencil" @click="edit_shipping = true"></v-icon></p>
                                            <p class="text-caption pt-1" >{{countries_obj[order_data.shipping.country_id] ? countries_obj[order_data.shipping.country_id].value :'---' }}</p>
                                            <p class="text-caption pt-1" >{{order_data.shipping.address_1 ? order_data.shipping.address_1 : '---'}} </p>
                                            <p class="text-caption pt-1" >{{order_data.shipping.address_2 ? order_data.shipping.address_2 : '---'}} </p>
                            
                                            
                                          </v-col>
                                    
                                            <v-col cols="12" >
                                                <span class="text-subtitle-2"  style="padding-right:8px">Phone Number:</span>
                                                <a  class="text-caption" :style="order_data.shipping.phone_number ? 'text-decoration: underline;color:rgb(161, 161, 161)':''"> <span style="font-size:13px">{{order_data.shipping.phone_number ? order_data.shipping.phone_number :'---' }}</span></a>
                                              </v-col>

                                    </v-row>
                                    </v-col>
                                    <v-col cols="6"  v-if="edit_shipping && !order_data.is_billing_as_shipping ">
                                        <v-row>
                                          <v-col cols="12" >
                                            <span class="text-subtitle-2" style="padding-right:8px">Shipping:</span>
                                          
                                          </v-col>
                                            <v-col cols="6">

                                              <v-text-field
                                              v-model="order_data.shipping.first_name"
                                              :error-messages="errors['shipping.first_name'] ? errors['shipping.first_name'] : ''"
                                              label="First name"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['shipping.first_name'] ?  errors['shipping.first_name'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field
                                                v-model="order_data.shipping.last_name"
                                                :error-messages="errors['shipping.last_name'] ? errors['shipping.last_name'] : ''"
                                                label="Last name"
                                                density="compact"
                                                variant="outlined"
                                                :hide-details="errors['shipping.last_name'] ?  errors['shipping.last_name'].length != 0  ? false : true : ''">
                                                </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.shipping.company_name"
                                              label="Company name"
                                              density="compact"
                                              variant="outlined"
                                              hide-details>
                                              </v-text-field>

                                            </v-col>
                                                <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.shipping.address_1"
                                              :error-messages="errors['shipping.address_1'] ? errors['shipping.address_1'] : ''"
                                              label="Address 1"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['shipping.address_1'] ?  errors['shipping.address_1'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                              <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.shipping.address_2"
                                              :error-messages="errors['shipping.address_2'] ? errors['shipping.address_2'] : ''"
                                              label="Address 2"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['shipping.address_2'] ?  errors['shipping.address_2'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                          <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.shipping.city"
                                              :error-messages="errors['shipping.city'] ? errors['shipping.city'] : ''"
                                              label="City"
                                              density="compact"
                                              variant="outlined"
                                              :hide-details="errors['shipping.city'] ?  errors['shipping.city'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                                <v-select
                                                v-model="order_data.shipping.country_id"
                                                :items="data_create.countries"
                                                :error-messages="errors['shipping.country_id'] ? errors['shipping.country_id'] : ''"
                                                label="Country"
                                                variant="outlined"
                                                item-title="value"
                                                item-value="id"
                                                density="compact"
                                                :hide-details="errors['shipping.country_id'] ?  errors['shipping.country_id'].length != 0  ? false : true : ''"
                                              ></v-select>
                                            </v-col>
                                            
                                            <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.shipping.email_address"
                                              :error-messages="errors['shipping.email_address'] ? errors['shipping.email_address'] : ''"
                                              label="Email Address"
                                              density="compact"
                                              variant="outlined"  
                                              :hide-details="errors['shipping.email_address'] ?  errors['shipping.email_address'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            <v-col cols="12">
                                              <v-text-field
                                              v-model="order_data.shipping.phone_number"
                                              :error-messages="errors['shipping.phone_number'] ? errors['shipping.phone_number'] : ''"
                                              label="Phone Number"
                                              density="compact"
                                              variant="outlined"
                                              type="number"
                                              :hide-details="errors['shipping.phone_number'] ?  errors['shipping.phone_number'].length != 0  ? false : true : ''">
                                              </v-text-field>

                                            </v-col>
                                            </v-row>

                                    

                                  </v-col>
                               
                              
                              </v-row>

                              <v-row>
                                <v-col cols="6">
                                  <v-row>
                                      <!-- btns save billing form -->
                                      <v-col  v-if="edit_billing ">
                                        <v-row>
                                            <v-col cols="12" style="justify-content:right" class="d-flex" >
                                                <v-btn
                                                  rounded="pill"
                                                  color="black"
                                                  size="small"
                                                  class="my-3 mx-1"
                                                  @click="{edit_billing = false ;order_data.billing.edit_type='done'}"
                                                >
                                                  Done
                                                </v-btn>
                                                <v-btn
                                                  v-if="order_data.billing_address_id != null"
                                                  rounded="pill"
                                                  color="black"
                                                  size="small"
                                                  class="my-3 mx-1"
                                                  @click="{edit_billing = false;order_data.billing.edit_type='update'}"
                                                >
                                                  Update
                                                </v-btn>
                                                <v-btn
                                                  rounded="pill"
                                                  color="black"
                                                  size="small"
                                                  class="my-3 mx-1"
                                                  @click="{edit_billing = false ;order_data.billing.edit_type='create'}"
                                                >
                                                  Save as new
                                                </v-btn>
                                            </v-col>
                                  

                                        </v-row>

                                      </v-col>
                                  </v-row>
                              
                                </v-col>
                                    <v-col cols="6">
                          
                                    <v-row>
                                      <!-- btns save shipping form -->
                                    <v-col  v-if="edit_shipping && !order_data.is_billing_as_shipping ">
                                      <v-row>
                                          <v-col cols="12" style="justify-content:right" class="d-flex" >
                                              <v-btn
                                                rounded="pill"
                                                color="black"
                                                size="small"
                                                class="my-3 mx-1"
                                                @click="{edit_shipping = false;order_data.shipping.edit_type='done'} "
                                              >
                                                Done
                                              </v-btn>
                                              <v-btn
                                                v-if="order_data.shipping_address_id != null"
                                                rounded="pill"
                                                color="black"
                                                size="small"
                                                class="my-3 mx-1"
                                                @click="{edit_shipping = false;order_data.shipping.edit_type='update'} "
                                              >
                                                Update
                                              </v-btn>
                                              <v-btn
                                                rounded="pill"
                                                color="black"
                                                size="small"
                                                class="my-3 mx-1"
                                                @click="{edit_shipping = false ;order_data.shipping.edit_type='create'}"
                                              >
                                                Save as new
                                              </v-btn>
                                          </v-col>
                            

                                      </v-row>

                                    </v-col>
                                    
                                  </v-row>

                                </v-col>
                            
                              </v-row>
                                  
                               
                    </v-card-text>



                 </v-card>
              </v-col>
              <v-col cols="12">
                <v-card
                      class="mx-auto"
                    >
                    <v-card-text>
                                <v-row>
                                        <v-col cols="12" class="my-5 pl-4" >
                                         <v-btn
                                          class="mr-4"
                                          size="x-small"
                                          icon="mdi-plus"
                                          @click="openAddProductModal()"
                                          color="white" ></v-btn> 
                                          <span>Add Product</span> 
                                        </v-col>
                                      
                                      </v-row>
                            
                                <v-row >
                    
                              <v-col cols="12">
                                <v-table
                                  fixed-header
                                  :max-height="Object.keys(selected_products).length >0 ? '600px' :''"
                                  class="product-order-table"
                                >
                                  <thead style="z-index: 9;position: relative;" class="order-head-table">
                                    <tr>
                                      <th class="text-left" >
                                        Product
                                      </th>
                                      <th>

                                      </th>
                                      <th class="text-left">
                                        Unit price
                                      </th>
                                      <th class="text-left" >
                                        Qty
                                      </th>
                                      <th class="text-left">
                                        Tax
                                      </th>
                                        <th class="text-left">
                                        Total
                                      </th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <template v-if="Object.keys(selected_products).length >0">
                                      <tr
                                        v-for="(product ,key ,index) in selected_products" :key="key"
                                      >
                                          <td class="py-1"> 
                                            <v-img
                                            :src="product.image"
                                            :lazy-src="product.image"
                                              aspect-ratio="1"
                                              height="90"
                                              width="110"
                                              cover
                                              max-height="150"
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
                                          </td>
                                        <td style="height: fit-content;">
                                          <div class="d-flex flex-column " style="height: 100%;">
                                            <span class="align-self-start" style="max-width: 200px;overflow-wrap: break-word;">{{ product.name}}</span>
                                            <span class="align-self-start" style="color:rgb(161, 161, 161);font-size:12px">SKU: {{ product.sku}}</span>

                                          </div>
                                            
                                            </td>
                                        <td>{{ product.unit_price ? product.unit_price : '--' }}</td>
                                        <td style="width:75px" :style="product.quantity ?'' : 'color: red'" v-if="!product.edit_status">{{ product.quantity != 0 || errors['selected_products.'+index+'.quantity'] ? product.quantity : 'NA' }}  {{errors['selected_products.'+index+'.quantity'] && product.quantity>0 && product.quantity< product.quantity_in_stock_available  ? errors['selected_products.'+index+'.quantity'][0] : ''}}</td>

                                        <td style="width:150px" v-else> 
                                          <v-text-field
                                          variant="underlined"
                                          density="compact"
                                          type="number"
                                          min="1" 
                                          :max="!product.pre_order ? product.quantity_in_stock : '' "
                                          class="mt-8"
                                          v-model="product.quantity"
                                          :id="product.id" 
                                          :rules="[(!product.pre_order && product.quantity > product.quantity_in_stock && product.quantity != '') || (!product.pre_order && product.quantity == 0 && product.quantity != '')? 'Qty must be between 1 and  ' +product.quantity_in_stock : (product.quantity < 1 && product.quantity != '') ? 'Qty must be positive':'']" 
                                          autofocus
                                          @focus="$event.target.select()"
                                          style="min-width:40px"
                                          @keyup.enter="enableEditing(product.id)"
                                          :error-messages="errors['selected_products.'+index+'.quantity'] ? errors['selected_products.'+index+'.quantity'] : ''"
                                        ></v-text-field> </td>
                                          <td>{{ product.tax ? product.tax: '--' }}</td>
                                        <td>{{  product.unit_price * product.quantity < 0 ? 'NA' : parseFloat(product.unit_price * product.quantity).toFixed(3) }}</td>

                                          <td   >
                                          <div class="d-flex justify-center align-center flex-column flex-md-row"  style="height: 100%;">
                                              <v-icon class="mx-3" style="font-size:20px" :icon="product.edit_status ?'mdi-content-save':'mdi-pencil'"   @click="enableEditing(product.id)" ></v-icon>
                                              <v-icon class="mx-3" style="font-size:20px" icon="mdi-close" @click="removeProductFromSelectedProduct(product.id)" ></v-icon>

                                          </div>
                                          </td>
                                      </tr>
                              
                                    </template>
                                    <template v-else>
                                      <tr>
                                          <th class="text-center" colspan="7">No Product Added</th>
                                      </tr>
                                    </template>
                                  </tbody>
                                </v-table>

                             </v-col>
                              <v-col cols="12" class="mt-3">
                                <v-row>
                                  <v-col cols="4" >
                                    <v-select
                                      :items="data_create.delivery_methods"
                                      label="Shipping Company"
                                      variant="outlined"
                                      item-title="value"
                                      item-value="id"
                                      density="compact"
                                      hide-details
                                      v-model="order_data.shipping_company_id"
                                    ></v-select>
                                  </v-col>
                                   <v-col cols="4" >
                                      <v-btn
                                      rounded="pill"
                                      color="white"
                                      :disabled="order_data.shipping_company_id == null"
                                      @click="shipping_company_dialog =true"
                                    >
                                      Prepare
                                    </v-btn>
                                   </v-col>
                                   <v-col cols="12" class="text-right " >
                                      <p><span class="text-caption pr-3">Product Subtotal:</span><span class="text-subtitle-2" style="font-weight:800">{{currencies_obj[order_data.currency_id] ? currencies_obj[order_data.currency_id].symbol:currencies_obj[default_currency_id] ? currencies_obj[default_currency_id].symbol : '' }} {{(subtotal).toFixed(3)}}</span> </p> 
                                      <p><span class="text-caption pr-3">Shipping:</span> <span class="text-subtitle-2" style="font-weight:800">{{currencies_obj[order_data.currency_id] ? currencies_obj[order_data.currency_id].symbol:currencies_obj[default_currency_id] ? currencies_obj[default_currency_id].symbol : '' }} {{(shipping).toFixed(3)}}</span></p>
                                      <p><span class="text-caption pr-3">Tax:</span><span class="text-subtitle-2" style="font-weight:800">{{currencies_obj[order_data.currency_id] ? currencies_obj[order_data.currency_id].symbol:currencies_obj[default_currency_id] ? currencies_obj[default_currency_id].symbol : '' }} {{(total_taxes).toFixed(3)}}</span></p>
                                      <p><span class="text-caption pr-3">Discount:</span><span class="text-subtitle-2" style="font-weight:800">{{ coupon_order.percentage ? coupon_order.percentage +'%': coupon_order.amount ? coupon_order.amount * (order_data.currency_rate ? order_data.currency_rate : 1) : '0.00' }}</span></p>
                                      <p><span class="text-caption pr-3">Order Total:</span> <span class="text-subtitle-2" style="font-weight:800">{{currencies_obj[order_data.currency_id] ? currencies_obj[order_data.currency_id].symbol:currencies_obj[default_currency_id] ? currencies_obj[default_currency_id].symbol : '' }} {{getDiscountPrice}} </span></p>
                                       <p><span class="text-caption pr-3">Total :</span> <span class="text-subtitle-2" style="font-weight:800"> {{currencies_obj[default_currency_id] ? currencies_obj[default_currency_id].symbol : ''}} {{(getDiscountPrice/(order_data.currency_rate ? order_data.currency_rate : 1)).toFixed(3)}} </span></p>
                                   </v-col>
                                   <v-col cols="12" class="d-flex justify-end" >
                                    <div class="d-flex" style="width:40%">
                                          <v-text-field 
                                          :loading="false"
                                          v-model="order_data.coupon_code"
                                          label="Coupon"
                                          density="compact" 
                                          variant="outlined"
                                          :error-messages="coupon_order.error_message"
                                          @keyup.enter="order_data.coupon_code != '' ? getCouponOrder() : ''"
                                          :hide-details="coupon_order.error_message != '' ? false :true"
                                          >

                                      </v-text-field>
                                      <v-icon class="mt-2 px-2" @click="getCouponOrder" :style="order_data.coupon_code == '' ? 'opacity:0.4 ;pointer-events:none' : ''">mdi-refresh</v-icon>
                                      <span class="mt-2 pl-1" :style="coupon_order.is_valid && parseFloat(coupon_order.minimum_amount * order_data.currency_rate) <= discount_price ? 'color:green' : 'color:red'">{{ coupon_order.percentage ? coupon_order.percentage +'%': coupon_order.amount *(order_data.currency_rate ? order_data.currency_rate : 1)  }}</span>

                                    </div>    

                                   </v-col>


                                </v-row>

                              </v-col>
                          <v-divider></v-divider>
                            <v-col cols="12" class="mt-3">

                                   <v-btn
                                      rounded="pill"
                                      color="white"
                                      style="float:right"
                                    >
                                      Refund
                                    </v-btn>
                              </v-col>
              
                    
                        </v-row>

                    </v-card-text>



                 </v-card>
              </v-col>

       


             

            </v-row>
          </v-col>
          <v-col cols="3" >
              <v-row>
                  <v-col cols="12" >
                        <v-expansion-panels class="panel-style" v-model="panel.status">
                              <v-expansion-panel>
                                <v-expansion-panel-title >
                                  <v-row no-gutters>
                                    <v-col cols="12" class="d-flex justify-start title-box">
                                      Status
                                    </v-col>
                             
                                  </v-row>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                              
                                  <v-row >
                              
                                    <v-col cols="12" >
                                    <v-select
                                      :items="data_create.statuses"
                                      label="Status"
                                      variant="outlined"
                                      item-title="value"
                                      item-value="id"
                                      density="compact"
                                      v-model="order_data.status_id"
                                      :error-messages="errors.status_id"
                                      :hide-details="errors.status_id ? false : true"
                                    ></v-select>
                                    </v-col>
                              
                              
                                  </v-row>



                                </v-expansion-panel-text>
                              </v-expansion-panel>
                        </v-expansion-panels>
                  </v-col>
                  <v-col cols="12">
                    <v-expansion-panels class="panel-style" v-model="panel.actions">

                        <v-expansion-panel>
                          <v-expansion-panel-title v-slot="{ open }">
                            <v-row no-gutters>
                              <v-col cols="4" class="d-flex justify-start title-box">
                                Actions
                              </v-col>
                              <v-col
                                cols="8"
                                class="text--secondary"
                              >
                                <v-fade-transition leave-absolute>
                                  <span
                                    v-if="open"
                                    key="0"
                                  >
                                    Select trip destination
                                  </span>
                                  <span
                                    v-else
                                    key="1"
                                  >
                                   
                                  </span>
                                </v-fade-transition>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text class="action-panel">
                        
                            <v-row >
                        
                              <v-col cols="12">
                                    <v-sheet
                                    :elevation="elevation"
                                    style="width:100%"
                                    class="rounded my-3 px-2"

                                  >
                                  <v-row>
                                    <v-col cols="12">
                                      <h5 class="">Invoice #8679</h5>
                                    </v-col>
                          
                                    <v-col cols="12" class="d-flex action-row">
                                      <v-icon >mdi-printer</v-icon>
                                      <p class="pl-3">Print Invoice</p>
                                    </v-col>
                               
                                     <v-col cols="12" class="d-flex action-row">
                                      <v-icon >mdi-briefcase-download-outline</v-icon>
                                      <p class="pl-3">Download Invoice</p>
                                    </v-col>
                                
                                    <v-col cols="12" class="d-flex action-row">
                                      <v-icon >mdi-printer-pos</v-icon>
                                      <p class="pl-3">Print Order</p>
                                    </v-col>
                                     
                                    <v-col cols="12" class="d-flex action-row">
                                      <v-icon >mdi-download</v-icon>
                                      <p class="pl-3">Download Packing List</p>
                                    </v-col>

                                  </v-row>

                                  
                                  
                                  </v-sheet>
                         
                              </v-col>
                        
                            </v-row>



                          </v-expansion-panel-text>
                        </v-expansion-panel>


                    </v-expansion-panels>
                  </v-col>
                         <v-col cols="12">
                    <v-expansion-panels class="panel-style" v-model="panel.notes">

                        <v-expansion-panel>
                          <v-expansion-panel-title v-slot="{ open }">
                            <v-row no-gutters>
                              <v-col cols="4" class="d-flex justify-start title-box">
                                Notes
                              </v-col>
                              <v-col
                                cols="8"
                                class="text--secondary"
                              >
                                <v-fade-transition leave-absolute>
                                  <span
                                    v-if="open"
                                    key="0"
                                  >
                                    Select trip destination
                                  </span>
                                  <span
                                    v-else
                                    key="1"
                                  >
                                   
                                  </span>
                                </v-fade-transition>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text class="note-panel">
                        
                            <v-row >
                              <template v-for="(note ,index) in order_data.notes" :key="index">

                                <v-col cols="12">
                                      <v-sheet
                                      :elevation="elevation"
                                      style="width:100%"
                                      class="rounded my-3 px-2"

                                    >
                                    <v-row>
                                      <v-col cols="12" class="pb-0 pt-4 ">
                                        <h5 class="pl-3">{{note.title}}</h5>
                                      </v-col>
                            
                                      <v-col cols="12" >
                                      
                                        <p class="pl-3">{{note.note}}</p>
                                      </v-col>
                                
                                      <v-col cols="12" class="d-flex action-row" >
                                        <p class="pl-3 text-caption">{{note.username}}</p>
                                        <p class="pl-3 text-caption">{{note.date}}</p>
                                      </v-col>
                                  


                                    </v-row>
                                  

                                    
                                    
                                    </v-sheet>
                          
                                </v-col>

                              </template>
                        
                        
                            </v-row>
                            <v-row  v-if="!add_note">
                              <v-col cols="12" class="my-5 pl-4" >
                                <v-btn
                                class="mr-4"
                                size="x-small"
                                icon="mdi-plus"
                                @click="addNoteForm()"
                                color="white" ></v-btn> 
                                <span>Add Note</span> 
                              </v-col>
                            </v-row>
                            <v-row v-else>
                              <v-col cols="12"  >
                                  <v-text-field
                                    v-model="note.title"
                                    label="Title"
                                    density="compact"
                                    variant="outlined"
                                    hide-details>
                                  </v-text-field>
                              </v-col>
                              <v-col cols="12"  >
                                  <v-textarea
                                    v-model="note.note"
                                    filled
                                    auto-grow
                                    label="Write Note.."
                                    rows="5"
                                    row-height="10"
                                    required
                                    variant="outlined"
                                     hide-details
                                  ></v-textarea>
                              </v-col>
                              <v-col cols="12" >
                                <v-btn
                                  size="x-small"
                                  @click="saveNote()"
                                  style="float:right"
                                  color="black"
                                  rounded >Save</v-btn> 
                                <v-btn
                                  class="mr-4"
                                  size="x-small"
                                  @click="addNoteForm()"
                                  style="float:right"
                                  color="black" 
                                  rounded >Cancel</v-btn> 
                              </v-col>
                            </v-row>



                          </v-expansion-panel-text>
                        </v-expansion-panel>


                    </v-expansion-panels>
                  </v-col>
       

              </v-row>
          </v-col>
        </v-row>
        <!-- </form> -->
        <v-btn
          rounded="pill"
          color="primary"
          size="x-large"
          @click="createOrder"
          class="mt-3"
          style="float:right"
          :loading="loading_btn"
          :disabled="loading_btn"
        >
        <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
          Submit
        </v-btn>
  </v-container>

  <!-- add Product dialog -->
  <v-dialog
    v-model="add_product"
    class="add-product-dialog"
  >
    <v-card>
      <v-card-text style="overflow-y: scroll; position: relative;overflow-x: hidden;">
        <v-row >
          <v-col cols="12">
        <datatable
          ref="add-product_dt"
          theadId="add-product-dt"
          pageURL="api/dashboard/product/get-products-for-order"
          headersURL="api/dashboard/headers/products-select"
          :selectedProductsIDs="SelectedProductsIDs"
          :selectedProducts="selected_products"
          @editElement="handleEditElement"
          @deleteElement="handleDeleteElement"
          @activateElement="handleActivateElement"
          :currency_rate="order_data.currency_rate"
          :currency_id="order_data.currency_id"

          />
          </v-col>
        </v-row>
        

      </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="black-darken-1"
          text
          @click="add_product = false"
        >
          Close
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- coupon dialog -->
  <v-dialog
    v-model="coupon_dialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Invaid Coupon !!
      </v-card-title>
      <v-card-text>to continue, check new coupon then save data</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="checkCoupon"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- validation quantity dialog -->
  <v-dialog
    v-model="validation_quantity_dialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Invaid product Quantity !!
      </v-card-title>
      <v-card-text>Check quantity selected for products</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="validation_quantity_dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- validation currency dialog -->
  <v-dialog
    v-model="validation_currency_dialog"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Invaid  currency / rate!!
      </v-card-title>
      <v-card-text>Check currency selected and currency rate  </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="validation_currency_dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- note*** shipping company dialog in edit order not updated  -->

  <!-- shipping company dialog -->
    <v-dialog
      v-model="shipping_company_dialog"
        class="shipping-comapny-dialog"
    >
      <v-card class="shipping-company-card">
        <v-card-text>
            <v-row> 
              <v-col cols="6" class="px-10 mt-3 pb-10" style="border-bottom: 1px solid rgb(137, 137, 137);border-right: 1px solid rgb(137, 137, 137);">
                  <v-row>
                    <v-col cols="12" class="pb-0">
                        <span class="text-h5 pl-0 font-weight-bold"> Shipper Details</span>
                    </v-col>
                    <v-col cols="12">
                        <span class="text-subtitle-2 font-weight-bold">General :</span>
                    </v-col>
                    <v-col cols="4" class="pb-1">Reference:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.reference}}</v-col>
                    <v-col cols="4" class="pb-1">Name:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.name}}</v-col>
                    <v-col cols="4" class="pb-1">E-mail:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.email}}</v-col>
                    <v-col cols="4" class="pb-1">Company:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.company}}</v-col>
                    <v-col cols="4" class="pb-1">Address:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.address}}</v-col>

                    <v-col cols="4" class="pb-1">Country:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.country}}</v-col>
                    <v-col cols="4" class="pb-1">City:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0"> {{shipping_company.shipper_details.city}}</v-col>
                    <v-col cols="4" class="pb-1">Postal Code:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.postal_code}}</v-col>
                    <v-col cols="4" class="pb-1">Phone</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.phone}}</v-col>
                    
                  </v-row>

              </v-col>
              <v-col cols="6" class="px-10 mt-6 pb-6" style="border-bottom: 1px solid rgb(137, 137, 137);">
                <v-row>
                   <v-col cols="12" class="pb-0">
                      <span class="text-h5 font-weight-bold pl-0"> Receiver Details</span>
                   </v-col>
                  <v-col cols="12" class="pb-0"  >
                      <v-text-field
                        label="Reference"
                        v-model="shipping_company.receiver_details .reference"
                        density="compact"
                        variant="outlined"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0"  >
                      <v-text-field
                        label="Name"
                        density="compact"
                        variant="outlined"
                        disabled
                        v-model="shipping_full_name"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0"  >
                      <v-text-field
                        label="E-mail"
                        density="compact"
                        variant="outlined"
                        disabled
                        v-model="order_data.shipping.email"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0"  >
                      <v-textarea
                        filled
                        auto-grow
                        label="Address"
                        rows="3"
                        row-height="5"
                        required
                        variant="outlined"
                        hide-details
                        disabled
                        v-model="order_data.shipping.address_1"
                      ></v-textarea>
                  </v-col>
                  <v-col cols="12" class="pb-0" >
                      <v-select
                        :items="data_create.countries"
                        label="Country"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        disabled
                        v-model="order_data.shipping.country_id"
                      ></v-select>
                  </v-col>
                  <v-col cols="12" class="pb-0" >
                      <v-select
                        :items="data_create.countries"
                        label="City"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        v-model="shipping_company.receiver_details .city_id"
                        hide-details
                      ></v-select>
                  </v-col>
                    <v-col cols="12" class="pb-0"  >
                      <v-text-field
                        label="Postal Code"
                        density="compact"
                        variant="outlined"
                        v-model="shipping_company.receiver_details .postal_code"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0"  >
                      <v-text-field
                        label="Phone"
                        density="compact"
                        variant="outlined"
                        disabled
                        v-model="order_data.shipping.phone_number"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  
                   
                </v-row>

              </v-col>
            </v-row> 
             <v-row>
              <v-col cols="12" class="px-10 mt-6 pb-6" >
                   <v-row>
                   <v-col cols="12" class="pb-0">
                      <span class="text-h5 font-weight-bold pl-0">Shippment Information</span>
                   </v-col>
                  <v-col cols="4" class="pb-0"  >
                      <v-text-field
                        label="Total Weight"
                        v-model="shipping_company.shippment_information.unit_value"
                        density="compact"
                        variant="outlined"
                        hide-details>
                      </v-text-field>
                  </v-col>
                   <v-col cols="2" class="pb-0" >
                      <v-select
                        :items="data_create.currencies"
                        label="Unit"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="shipping_company.shippment_information.unit_id"
                      ></v-select>
                  </v-col>
                   <v-col cols="6" class="pb-0"  >
                      <v-text-field
                        label="Reference"
                        v-model="shipping_company.shippment_information.reference"
                        density="compact"
                        variant="outlined"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  <v-col cols="6" class="pb-0" >
                      <v-select
                        :items="data_create.currencies"
                        label="Product Type"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="shipping_company.shippment_information.product_type_id"
                      ></v-select>
                  </v-col>                  
                  <v-col cols="6" class="pb-0" >
                      <v-select
                        :items="data_create.currencies"
                        label="Service Type"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="shipping_company.shippment_information.service_type_id"
                      ></v-select>
                  </v-col>                 
                   <v-col cols="6" class="pb-0" >
                      <v-select
                        :items="data_create.currencies"
                        label="Additional services"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="shipping_company.shippment_information.additional_service_id"
                      ></v-select>
                  </v-col>                  
                  <v-col cols="6" class="pb-0" >
                      <v-select
                        :items="data_create.currencies"
                        label="Payment Type"
                        item-title="value"  
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="shipping_company.shippment_information.payment_type_id"
                      ></v-select>
                  </v-col>
                  <v-col cols="6" class="pb-0"  >
                      <v-text-field
                        label="COD Amount"
                        density="compact"
                        variant="outlined"
                        type="number"
                        v-model="shipping_company.shippment_information.cod_amount"
                        hide-details>
                      </v-text-field>
                  </v-col>
 
                  <v-col cols="6" class="pb-0" >
                      <v-select
                        :items="data_create.currencies"
                        label="Currency"
                        item-title="value"
                        item-value="id"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="shipping_company.shippment_information.currency_id"
                      ></v-select>
                  </v-col>
                  <v-col cols="6" class="pb-0"  >
                      <v-text-field
                        label="Number of pieces"
                        density="compact"
                        variant="outlined"
                        type="number"
                        v-model="shipping_company.shippment_information.number_of_pieces"
                        hide-details>
                      </v-text-field>
                  </v-col>
                  <v-col cols="6" class="pb-0"  >
                      <v-textarea
                        filled
                        auto-grow
                        label="Description"
                        rows="3"
                        row-height="5"
                        required
                        variant="outlined"
                         hide-details
                         v-model="shipping_company.shippment_information.description"
                      ></v-textarea>
                  </v-col>
                  
                   
                </v-row>

              </v-col>

            </v-row>
            <!-- <v-row>
              <v-col cols="6" class="px-10 mt-3 pb-10" style="border-right: 1px solid rgb(137, 137, 137);">
                  <v-row>
                    <v-col cols="12" class="pb-0">
                        <span class="text-h5 pl-0 font-weight-bold"> Shipper Details</span>
                    </v-col>
                    <v-col cols="12">
                        <span class="text-subtitle-2 font-weight-bold">General :</span>
                    </v-col>
                    <v-col cols="4" class="pb-1">Reference:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.reference}}</v-col>
                    <v-col cols="4" class="pb-1">Name:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.name}}</v-col>
                    <v-col cols="4" class="pb-1">E-mail:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.email}}</v-col>
                    <v-col cols="4" class="pb-1">Company:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.company}}</v-col>
                    <v-col cols="4" class="pb-1">Address:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.address}}</v-col>

                    <v-col cols="4" class="pb-1">Country:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.country}}</v-col>
                    <v-col cols="4" class="pb-1">City:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0"> {{shipping_company.shipper_details.city}}</v-col>
                    <v-col cols="4" class="pb-1">Postal Code:</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.postal_code}}</v-col>
                    <v-col cols="4" class="pb-1">Phone</v-col>
                    <v-col cols="8" class="text-caption pb-1 pl-0">{{shipping_company.shipper_details.phone}}</v-col>
                    
                  </v-row>

              </v-col>
              <v-col cols="6" class="pb-0 mt-3">
                  <v-card
                  style="height:100%;box-shadow:none;background-color:#f9f9f9"
                  >
                    <v-card-title class="text-h6 font-weight-regular justify-space-between" style="height:10%">
                      <span>{{ currentTitle }}</span>
                      <v-avatar
                        color="primary"
                        size="24"
                        v-text="step"
                      ></v-avatar>
                    </v-card-title>

                    <v-window v-model="step" style="height:80%;overflow-y: scroll;max-height:400px">
                      <v-window-item :value="1" class="px-5 py-5">
                         <v-row >
                          
                            <v-col cols="12" class="pb-0"  >
                                <v-text-field
                                  label="Reference"
                                  density="compact"
                                  variant="outlined"
                                  v-model="shipping_company.receiver_details .reference"
                                  hide-details>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" class="pb-0"  >
                                <v-text-field
                                  label="Name"
                                  density="compact"
                                  variant="outlined"
                                  v-model="shipping_company.receiver_details .name"
                                  hide-details>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" class="pb-0"  >
                                <v-text-field
                                  label="E-mail"
                                  density="compact"
                                  variant="outlined"
                                  v-model="shipping_company.receiver_details .email"
                                  hide-details>
                                </v-text-field>
                            </v-col>
          
                            <v-col cols="12" class="pb-0" >
                                <v-select
                                  :items="data_create.currencies"
                                  label="Country"
                                  item-title="value"
                                  item-value="id"
                                  variant="outlined"
                                  density="compact"
                                  v-model="shipping_company.receiver_details .country"
                                  hide-details
                                ></v-select>
                            </v-col>
                            <v-col cols="12" class="pb-0" >
                                <v-select
                                  :items="data_create.currencies"
                                  label="City"
                                  item-title="value"
                                  item-value="id"
                                  variant="outlined"
                                  density="compact"
                                  v-model="shipping_company.receiver_details .city"
                                  hide-details
                                ></v-select>
                            </v-col>
                              <v-col cols="12" class="pb-0"  >
                                <v-text-field
                                  label="Postal Code"
                                  density="compact"
                                  variant="outlined"
                                  v-model="shipping_company.receiver_details .postal_code"
                                  hide-details>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" class="pb-0"  >
                                <v-text-field
                                  label="Phone"
                                  density="compact"
                                  variant="outlined"
                                  v-model="shipping_company.receiver_details .phone"
                                  hide-details>
                                </v-text-field>
                            </v-col>
                            
                   
                           </v-row>
                      </v-window-item>

                      <v-window-item :value="2">
                        <v-card-text>
                          <v-text-field
                            label="Password"
                            type="password"
                          ></v-text-field>
                          <v-text-field
                            label="Confirm Password"
                            type="password"
                          ></v-text-field>
                          <span class="text-caption grey--text text--darken-1">
                            Please enter a password for your account
                          </span>
                        </v-card-text>
                      </v-window-item>

                      <v-window-item :value="3">
                        <div class="pa-4 text-center">
                          <v-img
                            class="mb-4"
                            contain
                            height="128"
                            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                          ></v-img>
                          <h3 class="text-h6 font-weight-light mb-2">
                            Welcome to Vuetify
                          </h3>
                          <span class="text-caption grey--text">Thanks for signing up!</span>
                        </div>
                      </v-window-item>
                    </v-window>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-btn
                        v-if="step > 1"
                        text
                        @click="step--"
                      >
                        Back
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        v-if="step < 3"
                        color="primary"
                        depressed
                        @click="step++"
                      >
                        Next
                      </v-btn>
                      <v-btn
                        v-if="step == 3"
                        text
                        depressed
                      >
                        save
                      </v-btn>
                    </v-card-actions>
                  </v-card>


              </v-col>
            </v-row> -->
        </v-card-text>
           <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            
            rounded="pill"
            color="black"
            size="small"
            class="my-3 mx-1"
            @click="shipping_company_dialog = false"
            style="background-color: #000000 !important;color: #FFFFFF !important;"
          >
            Create Payment 
          </v-btn>

          <v-btn
            rounded="pill"
            size="small"
            color="white"
            class="my-3 mx-1"
            style="color: #000000 !important;background-color: #FFFFFF !important;"
            @click="shipping_company_dialog = false"
          >
            Close
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
import repository from '@/api/repository';
import datatable from "@/components/addProductDatatable.vue";
import { useRootStore } from "@/stores/root.js"
import { storeToRefs } from 'pinia'


export default {
    components: {
      datatable,
    },
    name: 'AddOrderPage',
 
    setup (){

      const root = useRootStore();
      const { loader,user} = storeToRefs(root);

      return{
        loader,
        user
      }
    },
    data() {
      return {
        user_profile:{},
        shipping_full_name:'',
        coupon_dialog:false,
        validation_quantity_dialog:false,
        validation_currency_dialog:false,
        shipping_company_dialog:false,
        formVisibility: false,
        isSucceed :false,
        isSucceed_alert: false,
        isFaild :false,
        errorMessage :'',
        successMessage :'',
        value: '',
        custom: true,
        subtotal:0,
        shipping:12,
        total_taxes:0,
        total:0,
        edit_shipping:true,
        edit_billing:true,
        add_product:false,
        add_note:false,
        types:['normal', 'variant', 'bundle', 'service'],
        order_id:null,
        data_create:{},
        countries_obj:{},  
        panel:{
          actions:[0],
          status:[0],
          notes:[0],
        },
        storedProducts:[],
        SelectedProductsIDs:[],
        selected_products:{},
        order_data:{
          client_id:null,
          date:'',
          time: '',
          comment:'',
          is_billing_as_shipping:false,
          billing:{
            first_name:'',
            last_name:'',
            company_name:'',
            address_1:'',
            address_2:'',
            city:'',
            country_id:null,
            email_address:'',
            phone_number:'',
            payment_method_id:null,
            edit_type:null,
          },
          
          shipping:{
            first_name:'',
            last_name:'',
            company_name:'',
            address_1:'',
            address_2:'',
            city:'',
            country_id:null,
            email_address:'',
            phone_number:'',
            edit_type:null,
          },
          billing_address_id:null,
          shipping_address_id:null,
          selected_products:[],
          shipping_company_id:null,
          notes:[],
          status_id:null,
          coupon_code:'',
          currency_id:null,
          total_price:null,
          currency_rate:1,


        },
        original_order_data:{
                    client_id:null,
          date:'',
          time: '',
          comment:'',
          is_billing_as_shipping:false,
          billing:{
            first_name:'',
            last_name:'',
            company_name:'',
            address_1:'',
            address_2:'',
            city:'',
            country_id:null,
            email_address:'',
            phone_number:'',
            payment_method_id:null,
            edit_type:null,
          },
          
          shipping:{
            first_name:'',
            last_name:'',
            company_name:'',
            address_1:'',
            address_2:'',
            city:'',
            country_id:null,
            email_address:'',
            phone_number:'',
            edit_type:null,
          },
          billing_address_id:null,
          shipping_address_id:null,
          selected_products:[],
          shipping_company_id:null,
          notes:[],
          status_id:null,
          coupon_code:'',
          currency_id:null,
          total_price:null,
          currency_rate:1,

        },
        storedProductsSearch:{
          limit:10,
          category:"",
          product_name : ""
        },
        coupon_order:{
              code:'',
              is_valid: false,
              message: "",
              error_message: "",
              amount: null,
              percentage: null,
              minimum_amount: null,
              is_discount_on_shipping: false
          },
          loading_coupon:false,
          note:  {
            title:"",
            note:'',
            username:'user name new',
            date:'March 29, 2055',
          },
          discount_price:0,
          code:null,
          errors: {
            client_id: [],
            comment: [],
            status_id: [],
            coupon_code: [],
            "billing.first_name": [],
            "billing.last_name": [],
            "billing.address_1": [],
            "billing.address_2": [],
            "billing.city": [],
            "billing.country_id": [],
            "billing.phone_number": [],
            "billing.email_address": [],
            "billing.payment_method_id": [],
            "shipping.first_name": [],
            "shipping.last_name": [],
            "shipping.address_1": [],
            "shipping.address_2": [],
            "shipping.city": [],
            "shipping.country_id": [],
            "shipping.phone_number": [],
            "shipping.email_address": []
          },
          currencies_obj:{},
          currency:null,   
          default_currency_id:null,    
          isLoading:true,   
          loading_btn: false,
          client_addresses:{},
          address_data:{},
          original_address_data:{},
          validation_quantity:false,
          data_returned_after_success:{},
          step: 1,
          shipping_company:{
              id:1,
              shipper_details:{
                reference:'36874',
                name:'Skin Perfection',
                email:'hello@skinperfection.me',
                company:'Skin Perfection',
                address:'Seifeddine El Khatib ,street,Tueiny building ,number 4709, 1st floor',
                country:'Lebanon',
                city:'Beirut',
                postal_code:'00000',
                phone:'96181620417',
              },
               receiver_details :{
                  reference:'111111',
                  name:'Skin Perfection',
                  email:'hello@skinperfection.me',
                  company:'Skin Perfection',
                  address:'Seifeddine El Khatib ,street,Tueiny building ,number 4709, 1st floor',
                  country:1,
                  city_id:2,
                  postal_code:'222222',
                  phone:'96181620417',
              },
              shippment_information :{
                  unit_value:120,
                  unit_id:2,
                  reference:'aaaaaaaa',
                  product_type_id:1,
                  service_type_id:1,
                  additional_service_id:1,
                  payment_type_id:2,
                  cod_amount:3333,
                  currency_id:1,
                  description:'ddddddddddddddddddddddddddd',
                  number_of_pieces:10,
              },
          },
          original_shipping_company:{
              id:1,
              shipper_details:{
                reference:'36874',
                name:'Skin Perfection',
                email:'hello@skinperfection.me',
                company:'Skin Perfection',
                address:'Seifeddine El Khatib ,street,Tueiny building ,number 4709, 1st floor',
                country:'Lebanon',
                city:'Beirut',
                postal_code:'00000',
                phone:'96181620417',

              },
               receiver_details :{
                  reference:'111111',
                  name:'Skin Perfection',
                  email:'hello@skinperfection.me',
                  company:'Skin Perfection',
                  address:'Seifeddine El Khatib ,street,Tueiny building ,number 4709, 1st floor',
                  country:1,
                  city_id:2,
                  postal_code:'222222',
                  phone:'96181620417',
              },
              shippment_information :{
                  unit_value:120,
                  unit_id:2,
                  reference:'aaaaaaaa',
                  product_type_id:1,
                  service_type_id:1,
                  additional_service_id:1,
                  payment_type_id:2,
                  cod_amount:3333,
                  currency_id:1,
                  description:'ddddddddddddddddddddddddddd',
                  number_of_pieces:10,
              },
          },
      }
      
    },
    computed:{
     currentTitle () {
        switch (this.step) {
          case 1: return 'Shippment Information'
          case 2: return 'Create a password'
          default: return 'Account created'
        }
      },
      getDiscountPrice(){
        var DiscountPrice = 0
        var discounted_total = this.total
        var percentage = this.coupon_order.percentage
        if(this.coupon_order.is_valid && !this.coupon_order.is_discount_on_shipping)
        {
             discounted_total=this.subtotal

        }else
        {
          discounted_total = this.total

        }
            
        if (discounted_total >= parseFloat(this.coupon_order.minimum_amount * this.order_data.currency_rate) && this.coupon_order.is_valid) {
            

          if(percentage != null)
          {
            DiscountPrice = (discounted_total - ((discounted_total * percentage)/100)).toFixed(3)

          }else{
            DiscountPrice = (discounted_total - (this.coupon_order.amount  * (this.order_data.currency_rate ? this.order_data.currency_rate : 1))).toFixed(3)
            if(DiscountPrice <0 )
            {
              DiscountPrice= 0
            }
          }
          if(!this.coupon_order.is_discount_on_shipping)
          {
              DiscountPrice= (parseFloat(DiscountPrice) + parseFloat(this.shipping)).toFixed(3)
          }
            this.coupon_order.error_message =''

        }else{
          DiscountPrice = this.total
          if(!this.coupon_order.is_valid &&  this.code == 1 )
          {
            this.coupon_order.error_message ='Coupon not valid'

          }else if(this.coupon_order.is_valid){

            this.coupon_order.error_message ='Sorry, but you at least have to buy '+(this.coupon_order.minimum_amount * this.order_data.currency_rate ) +' '+ (this.currencies_obj[this.order_data.currency_id] ? this.currencies_obj[this.order_data.currency_id].symbol : "") +' to use this coupon'
          }

        }
        this.discount_price= parseFloat(discounted_total)
        return DiscountPrice;
      },
    },
    methods: {
      checkBillingAsShipping(val ,type){
         this.order_data.billing_address_id == this.order_data.shipping_address_id && this.order_data.billing_address_id !=null &&  this.order_data.shipping_address_id != null? (this.order_data.is_billing_as_shipping = true, this.edit_shipping = false) :  (this.order_data.is_billing_as_shipping = false);
        if(type=='billing_address')
        {
             if(val != null)
              {
                this.order_data.billing=this.address_data[this.order_data.billing_address_id] ? this.address_data[this.order_data.billing_address_id].data : this.original_order_data.billing
              }else{
                this.order_data.billing =this.original_order_data.billing
              }
        }else{
               if(val != null)
                {
                  this.order_data.shipping=this.address_data[this.order_data.shipping_address_id] ? this.address_data[this.order_data.shipping_address_id].data : this.original_order_data.shipping
                }else{
                  this.order_data.shipping =this.original_order_data.shipping
                }
        }
        this.address_data = JSON.parse(JSON.stringify(this.original_address_data));

      },
      getCurrentDate()
      {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        today =yyyy  + '-' + mm  + '-' + dd;
        this.order_data.date= today
      },
      async handleEditElement(data){
          this.selected_products =data.SelectedProducts
          this.SelectedProductsIDs =data.SelectedProductsIDs
      },
      checkCoupon(){
        this.coupon_dialog=false
      },
      clearErrors(){
        this. errors= {
            client_id: [],
            comment: [],
            status_id: [],
            coupon_code: [],
            "billing.first_name": [],
            "billing.last_name": [],
            "billing.address_1": [],
            "billing.address_2": [],
            "billing.city": [],
            "billing.country_id": [],
            "billing.phone_number": [],
            "billing.email_address": [],
            "billing.payment_method_id": [],
            "shipping.first_name": [],
            "shipping.last_name": [],
            "shipping.address_1": [],
            "shipping.address_2": [],
            "shipping.city": [],
            "shipping.country_id": [],
            "shipping.phone_number": [],
            "shipping.email_address": []
          };

      },
       clearCoupon()
      {
          this.coupon_order={
          code:'',
          is_valid: false,
          message: "",
          error_message: "",
          amount: null,
          percentage: null,
          minimum_amount: null,
          is_discount_on_shipping: false
        }
        this.discount_price=0  
      },
      async createOrder(){
        this.loading_btn = true
          this.order_data.selected_products=[]
        this.SelectedProductsIDs.forEach(id => {
        this.order_data.selected_products.push(this.selected_products[id])
        });
        this.calculateTotal(this.order_data.selected_products)
        this.order_data.total_price =this.getDiscountPrice;
        if(this.coupon_order.code == this.order_data.coupon_code && this.validation_quantity)
        {
          const response = await repository.createOrder(this.order_data);
            this.clearErrors()
            if(response.data.code == 1){
                  this.isSucceed = true
                  this.isSucceed_alert = true
                  this.successMessage = "Submitted Successfully."
                  this.formVisibility = false
                  this.data_returned_after_success = response.data.data.order
                  setTimeout(() => this.isSucceed_alert = false, 3000);
            } else {
             
                   this.isFaild = true
                  this.errorMessage = response.data.message
                  this.formVisibility = false
                  setTimeout(() => this.isFaild = false, 3000);
                  if(response.data.errors)
                  {
                    this.errors= response.data.errors
                  }
                
                  this.coupon_order.error_message = this.errors.coupon_code ? this.errors.coupon_code : ''
            }
        }else if(!this.validation_quantity){
            this.validation_quantity_dialog=true
        }else if(this.coupon_order.code != this.order_data.coupon_code)
        {
          this.coupon_dialog=true
        }
        this.loading_btn = false
      },
      sumTaxes(){
            var sum = 0;
            var val=this.selected_products
            for( var el in val ) {
            if( val.hasOwnProperty( el ) && parseFloat( val[el].tax * val[el].quantity ) >= 0) {
              sum += parseFloat( val[el].tax * val[el].quantity );
            }
          }
            this.total_taxes=sum
      },
      addNoteForm(){
        this.add_note = !this.add_note
        var current_date = new Date().toLocaleDateString(undefined, { month: 'long', day: '2-digit',year: 'numeric'});
        this.note = {
            title:"",
            note:'',
            username:this.user_profile.username,
            date:current_date,
        }
      },
      saveNote(){
         this.add_note = !this.add_note
        this.order_data.notes.push(this.note)
        this.note = {
            title:"",
            note:'',
            username:'-----',
            date:'--------',
        }

      },
      enableEditing(id){
      
          this.selected_products[id].edit_status = !this.selected_products[id].edit_status;
      },
      async getCouponOrder(){
        var  params =0
          this.loading_coupon = true
        if(this.order_data.coupon_code != '')
        {
          params = this.order_data.coupon_code 
        }
        const response = await repository.getCouponOrder(params);
          this.code = response.data.code
        if(response.data.code == 1){
          this.coupon_order= response.data.data
        }else{
              this.clearCoupon()
              this.coupon_order.code= response.data.data.coupon_code
              this.coupon_order.error_message ="coupon code not found"
        }
          this.loading_coupon = false

        
      },
      async getProducts(){
        const response = await repository.getProductsOrder(this.storedProductsSearch);
        if(response.data.code == 1){
          this.storedProducts = response.data.data.products;
        } else {
          alert('no product stored')
        }
      },
      async getCreateOrderData(){
        const response = await repository.createOrderData();
        if(response.data.code ==1){
          this.data_create = response.data.data;
        } else {
          alert('no data create')
        }
      },
      async addProductToSelectedProducts(id){
        if(!this.SelectedProductsIDs.includes(id)){
          this.SelectedProductsIDs.push(id);
          this.storedProducts.forEach(element => {
            if(element.id == id){
              this.selected_products[id] = element;
            }
          });
          
        } 
      },
      removeProductFromSelectedProduct(id){
        this.SelectedProductsIDs.splice(this.SelectedProductsIDs.indexOf(id), 1);
        delete this.selected_products[id];
      },
      openAddProductModal(){
        if(this.order_data.currency_id >0 && this.order_data.currency_rate >0)
        {
          this.add_product = true;
        }else
        {
          this.validation_currency_dialog=true;
        }
      },
      calculateTotal(val){
          var sum = 0;
          var valid = true
          if(Object.keys(val).length > 0)
          {
            for( var el in val )
            {
              if( val.hasOwnProperty( el ) && parseFloat( val[el].unit_price * val[el].quantity  ) >= 0 )
              {
                  sum += parseFloat( val[el].unit_price * val[el].quantity  );
              }
              if(val[el].quantity <=  0 || val[el].quantity == '')
              {
                valid= false
              }
            }

          }else
          {
            valid= false         
          }

          this.validation_quantity = valid;
          this.subtotal=sum
          this.sumTaxes()
          this.total=(parseFloat(this.subtotal) + parseFloat(this.shipping)).toFixed(3)
          if(this.order_data.coupon_code != '')
          {
            this.getCouponOrder()
          }
      },

    },
    watch:{
      selected_products:{
        handler:function(val){
             this.calculateTotal(val)
        },
        deep:true
      },
      'order_data.is_billing_as_shipping':{
         handler:function(val){
          // if(this.order_data.shipping_address_id == null)
          // {
            if(val == true)
            {
              this.order_data.shipping = this.order_data.billing
              this.edit_shipping = false
            }else{
              this.order_data.shipping = this.original_order_data.shipping
              // this.edit_shipping = true

            }
          // }
        },
        deep:true
      },
      'order_data.billing_address_id':{
         handler: function(val){
           this.checkBillingAsShipping(val ,'billing_address')
        },
        deep:true
      },
       'order_data.shipping_address_id':{
         handler: function(val){
           this.checkBillingAsShipping(val,'shipping_address');
        },
        deep:true
      },
      'order_data.coupon_code':{
          handler:function(val){
          if(val == ""){
            this.clearCoupon()
          }
        },
        deep:true

      },
      'order_data.client_id':{
          handler:function(val){
          if(val == null){
            this.order_data.shipping_address_id = null 
            this.order_data.billing_address_id = null 
          }
        },
        deep:true

      },
      'order_data.currency_id':{
       handler:function(val){
        if(this.currencies_obj[val])
        {
          this.order_data.currency_rate= this.currencies_obj[val].rate
        }
      },
      deep:true
     },
     'order_data.currency_rate':{
       handler:function(val){
          
        for( var el in this.selected_products )
          {
            if(this.selected_products.hasOwnProperty(el) )
            {
                this.selected_products[el].unit_price= this.selected_products[el].original_unit_price * val
                this.selected_products[el].tax= this.selected_products[el].original_tax* val
            }

          }
      },
      deep:true
     },
      'order_data.shipping_company_id':{
       handler:function(val){
        this.shipping_company_dialog = true
      },
      deep:true
     },
     'order_data.shipping':{
         handler: function(val){
           this.shipping_full_name = val.first_name+' '+val.last_name
        },
        deep:true
      },
    },
    async created(){
     this.user_profile =(typeof this.user == 'string') ? JSON.parse(this.user) : this.user
     await this.getCreateOrderData()
     this.order_data.currency_id = this.data_create.default_currency
     this.getCurrentDate()
     // create countries object of objects
     this.data_create.countries.forEach(element => {
          this.countries_obj[element.id] = element;
      });

     // create customers object of objects

     this.data_create.customers.forEach(element => {
        this.client_addresses[element.id] = element;
        // create addresses object of objects
        element.addresses.forEach(address => {
        this.address_data[address.id] = address;
      });

     });
      this.original_address_data = JSON.parse(JSON.stringify(this.address_data));
      // create currencies object of objects
      this.data_create.currencies.forEach(element => {
          this.currencies_obj[element.id] = element;
          if(element.is_default)
          {
            this.default_currency_id = element.id
          }
      });
      this.loader=false
  
    }, 
   }
</script>

