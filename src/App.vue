<template>
  <v-app>
    <AppHeader></AppHeader>

    <AppSidebar></AppSidebar>

    <v-main>
      <div v-show="!loader">
        <router-view></router-view>
      </div>
    
      <div v-show="loader">
       <ProgressCircular />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import ProgressCircular from "@/components/ProgressCircular.vue";
import moment from 'moment';
export default {
  components: {
    AppHeader,
    AppSidebar,
    ProgressCircular,
  },

  setup() {
    const root = useRootStore();
    const { loader } = storeToRefs(root);
    return {
      loader,
      root
    };
  },

  methods: {
    checkExpiredUser() {
      if(this.root.user){
        var date = moment(new Date()).format(),
        expire = JSON.parse(this.root.user).expiry
        if(date>expire) {
          localStorage.removeItem("user");
          this.$router.push('/login')
        }
      }
    }
  },

  created() {
    this.checkExpiredUser()
  },

  watch: {
    $route: {
      deep: true,
      handler(to, from) {
        if (this.$route.name != "SignIn") {
          this.loader = true;
        } else {
          this.loader = false;
        }
      },
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/style";
</style>