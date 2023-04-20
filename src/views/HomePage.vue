<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-sheet
        class="pa-2 ma-2 mt-5"
        style="
          justify-content: center;
          display: flex;
          font-weight: 400;
          font-size: 2rem;
        "
      >
        Dashboard
      </v-sheet>
    </v-col>

    <v-col cols="12">
      <v-sheet class="pa-2 ma-2">
        <v-row dense>
          <v-col cols="12" lg="4">
            <v-card
              color="#385F73"
              theme="dark"
              style="padding: 0.5rem 0px !important"
              class="clickable-sheet"
              @click="goTo('/product')"
            >
              <v-card-title class="text-h5"> Products </v-card-title>

              <v-card-text class="py-0 my-3">
                <v-row align="center" hide-gutters no-gutters>
                  <v-col class="text-h2" cols="9"><Vue3autocounter ref='currencies' :startAmount='0' :endAmount='data.products' :duration='2'  separator=',' :autoinit='true' /></v-col>

                  <v-col cols="3" class="text-right">
                    <v-icon size="88">mdi-package-variant</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card
              color="#6a1d37"
              theme="dark"
              style="padding: 0.5rem 0px !important"
              class="clickable-sheet"
              @click="goTo('/orders')"
            >
              <v-card-title class="text-h5"> Orders </v-card-title>

              <v-card-text class="py-0 my-3">
                <v-row align="center" hide-gutters no-gutters>
                  <v-col class="text-h2" cols="9"><Vue3autocounter ref='currencies' :startAmount='0' :endAmount='data.orders' :duration='2'  separator=',' :autoinit='true' /></v-col>

                  <v-col cols="3" class="text-right">
                    <v-icon size="88">mdi-cart-plus</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card
              color="rgb(160, 159, 79)"
              theme="dark"
              style="padding: 0.5rem 0px !important"
              class="clickable-sheet"
              @click="goTo('/brands')"
            >
              <v-card-title class="text-h5"> Brands </v-card-title>

              <v-card-text class="py-0 my-3">
                <v-row align="center" hide-gutters no-gutters>
                  <v-col class="text-h2" cols="9"><Vue3autocounter ref='currencies' :startAmount='0' :endAmount='data.brands' :duration='2'  separator=',' :autoinit='true' /></v-col>

                  <v-col cols="3" class="text-right">
                    <v-icon size="88">mdi-alpha-b-box-outline</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card
              color="rgb(48, 33, 149)"
              theme="dark"
              style="padding: 0.5rem 0px !important"
              class="clickable-sheet"
              @click="goTo('/countries')"
            >
              <v-card-title class="text-h5"> Countries </v-card-title>

              <v-card-text class="py-0 my-3">
                <v-row align="center" hide-gutters no-gutters>
                  <v-col class="text-h2" cols="9"><Vue3autocounter ref='currencies' :startAmount='0' :endAmount='data.countries' :duration='2'  separator=',' :autoinit='true' /> </v-col>

                  <v-col cols="3" class="text-right">
                    <v-icon size="88">mdi-earth</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" lg="4">
            <v-card
              color="rgb(199, 57, 57)"
              theme="dark"
              style="padding: 0.5rem 0px !important"
              class="clickable-sheet"
              @click="goTo('/taxes')"
            >
              <v-card-title class="text-h5"> Taxes </v-card-title>

              <v-card-text class="py-0 my-3">
                <v-row align="center" hide-gutters no-gutters>
                  <v-col class="text-h2" cols="9"><Vue3autocounter ref='currencies' :startAmount='0' :endAmount='data.taxes' :duration='1.5'  separator=',' :autoinit='true' /></v-col>

                  <v-col cols="3" class="text-right">
                    <v-icon size="88">mdi-clipboard-text-multiple-outline</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" lg="4">
            <v-card
              color="rgb(96, 149, 33)"
              theme="dark"
              style="padding: 0.5rem 0px !important"
              class="clickable-sheet"
              @click="goTo('/currency')"
            >
              <v-card-title class="text-h5"> Currencies </v-card-title>

              <v-card-text class="py-0 my-3">
                <v-row align="center" hide-gutters no-gutters>
                  <v-col class="text-h2" cols="9"> <Vue3autocounter ref='currencies' :startAmount='0' :endAmount='data.currencies' :duration='2'  separator=',' :autoinit='true' /> </v-col>

                  <v-col cols="3" class="text-right">
                    <v-icon size="88">mdi-currency-usd</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";
import datatable from "@/components/datatable.vue";
import repository from "@/api/repository";
import Vue3autocounter from 'vue3-autocounter';

export default {
  components: {
    datatable,
    Vue3autocounter,
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
      data:{
        brands: 0,
        countries: 0,
        currencies: 0,
        customers: 0,
        orders: 0,
        products: 0,
        taxes: 0,
      }
    }
  },
  mounted() {
    this.loader = false;
    this.getDasboardData();
  },
  methods:{
     goTo(route) {
      this.$router.push(route);
    },
    async getDasboardData(){
      const response = await repository.getDasboardData();
      this.data =response.data.data
    }
  },  

  computed: {
    cols() {
      const { xl,lg} = this.$vuetify.display;
      return xl||lg ? [6, 6] : [12, 12];
    },
  },
};
</script>
<style>
.clickable-sheet{
  cursor: pointer;
}

</style>
