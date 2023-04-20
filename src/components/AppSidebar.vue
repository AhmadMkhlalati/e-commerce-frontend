<template>
  <v-navigation-drawer
    class="side-bar-root"
    expand-on-hover
    v-if="root.authenticated"
    v-model="drawer"
    :rail="rail"
    :style="rail ? '' : 'width: fit-content !important;'"
    @mouseleave="sideBarMouseLeave"
    @mouseenter="sideBarMouseEnter"
    @click="toggleRail"
  >
    <v-list-item
      id="user-data-list"
      :title="root.getUser.username"
      :subtitle="root.getUser.email"
    >
      <template v-slot:prepend>
        <v-avatar>
          <img
            style="width: 100%; height: 100%; object-fit: contain"
            :src="root.getUser.image"
            @error="imageNotFound"
          />
        </v-avatar>
      </template>
      <template v-slot:append>
        <v-btn
          variant="text"
          :icon="rail ? 'mdi-radiobox-blank' : 'mdi-radiobox-marked'"
          @click="toogleRail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider class="divider-style"></v-divider>

    <v-list
      v-model:opened="open"
      class="list-style px-0"
      :lines="false"
      density="compact"
      nav
    >
      <v-list-item
        rounded="sm"
        active-color="primary"
        prepend-icon="mdi-view-dashboard"
        @click="goTo('/')"
        title="Dashboard"
        value="Dashboard"
      ></v-list-item>

      <v-list-item
        rounded="sm"
        active-color="primary"
        prepend-icon="mdi-cog-outline"
        @click="goTo('/settings')"
        title="System Settings"
        value="SystemSettings"
      ></v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            rounded="sm"
            active-color="primary"
            v-bind="props"
            prepend-icon="mdi-tune-vertical-variant"
            title="Setup"
            value="Setup"
          ></v-list-item>
        </template>

        <v-list-item
          rounded="sm"
          active-color="primary"
          v-bind="props"
          @click="goTo('/countries')"
          title="Country"
          class="first-level"
          value="Country"
        ></v-list-item>
        <v-list-item
          rounded="sm"
          active-color="primary"
          v-bind="props"
          @click="goTo('/brands')"
          title="Brands"
          class="first-level"
          value="Brands"
        ></v-list-item>
        <v-list-item
          rounded="sm"
          active-color="primary"
          v-bind="props"
          @click="goTo('/taxes')"
          title="Taxes"
          class="first-level"
          value="Taxes"
        ></v-list-item>
        <!-- <v-list-item
          rounded="sm"
          active-color="primary"
          v-bind="props"
          @click="goTo('/language')"
          title="Language"
          class="first-level"
          value="Language"
        ></v-list-item> -->
        <v-list-item
          rounded="sm"
          active-color="primary"
          v-bind="props"
          @click="goTo('/currency')"
          title="Currency"
          class="first-level"
          value="Currency"
        ></v-list-item>
        <v-list-item
          rounded="sm"
          active-color="primary"
          v-bind="props"
          @click="goTo('/pricing-classes')"
          title="Pricing Classes"
          class="first-level"
          value="PricingClasses"
        ></v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            active-color="primary"
            v-bind="props"
            prepend-icon="mdi-application-cog"
            title="Product Management"
            value="ProductManagement"
          ></v-list-item>
        </template>

        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/product')"
          title="Products"
          class="first-level"
          value="Product"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/categories')"
          title="Categories"
          class="first-level"
          value="Categories"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/fields')"
          title="Fields"
          class="first-level"
          value="Fields"
        ></v-list-item>
        <!-- <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/test')"
          title="Attributes"
          class="first-level"
          value="Attributes"
        ></v-list-item> -->
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/units')"
          title="Units"
          class="first-level"
          value="Units"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/labels')"
          title="Labels"
          class="first-level"
          value="Labels"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/tags')"
          title="Tags"
          class="first-level"
          value="Tags"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/pricing-list')"
          title="Pricing Lists"
          class="first-level"
          value="PricingLists"
        ></v-list-item>
        <!-- <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/test')"
          title="Discount"
          class="first-level"
          value="Discount"
        ></v-list-item> -->
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            active-color="primary"
            v-bind="props"
            prepend-icon="mdi-package-variant"
            title="Inventory & Stock"
            value="Inventory&Stock"
          ></v-list-item>
        </template>
        <!-- <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/test')"
          title="Stock Management"
          class="first-level"
          value="StockManagement"
        ></v-list-item> -->
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/orders')"
          title="Orders"
          class="first-level"
          value="Orders"
        ></v-list-item>

        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/coupon')"
          title="Coupon"
          class="first-level"
          value="Coupon"
        ></v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            active-color="primary"
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="User Management"
            value="UserManagement"
          ></v-list-item>
        </template>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/roles')"
          title="Roles"
          class="first-level"
          value="Roles"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/users')"
          title="Users"
          class="first-level"
          value="Users"
        ></v-list-item>
        <!-- <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/logs')"
          title="Users Log"
          class="first-level"
          value="UsersLog"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/user-history')"
          title="Users Edit History"
          class="first-level"
          value="UsersEditHistory"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/user-access')"
          title="Users Access"
          class="first-level"
          value="UserAccess"
        ></v-list-item>
        <v-list-item
          active-color="primary"
          v-bind="props"
          @click="goTo('/user-security')"
          title="Users Security"
          class="first-level"
          value="UserSecurity"
        ></v-list-item> -->
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ref } from "vue";
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const root = useRootStore();

    const { rail, rootTheme, drawer, loader, user } = storeToRefs(root);

    const open = ref(["Users"]);
    var theme_test = rootTheme._object.rootTheme.name.value;

    function toogleRail(val = null) {
      if (val == true || val == false) {
        root.$patch({
          rail: val,
        });
      } else {
        root.$patch({
          rail: !rail.value,
        });
      }
    }
    return {
      user,
      loader,
      root,
      rail,
      drawer,
      toogleRail,
      rootTheme,
      theme_test,
      open,
      theme: {
        name: {
          value: "light",
        },
      },
    };
  },
  methods: {
    imageNotFound(e) {
      e.target.src =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
    },
    goTo(route) {
      this.$router.push(route);
    },
    sideBarMouseLeave() {
      if (this.rail) {
        this.open = [];
        document.querySelectorAll(".v-list-item__overlay").forEach((e) => {
          e.classList.add("icon-width");
        });
      }
    },
    sideBarMouseEnter() {
      document.querySelectorAll(".v-list-item__overlay").forEach((e) => {
        e.classList.remove("icon-width");
      });
    },
  },
};
</script>

<style lang="scss">
.icon-width {
  width: 40px;
}

.side-bar-root {
  transition: none;
}

.side-bar-root:not(.v-navigation-drawer--active) {
  .v-list-item__overlay {
    width: 40px !important;
  }
  .v-navigation-drawer__content {
    width: 91%;
  }
}

.divider-style {
  background-color: #686868;
  padding: 0px;
  margin-inline: 17%;
  margin-top: 8px;
}

.v-theme--light .v-navigation-drawer {
  background-color: #f9f9f9;
}

.v-list-item {
  padding: 4px 7px !important;
}

.v-list-item-subtitle {
  font-size: 13px !important;
}
.list-style .v-theme--light.v-list-item:hover {
  background-color: white !important;
}

.list-style .v-theme--light.v-list-item:active {
  background-color: white;
}

.v-list-item-title.level-one {
  padding-left: 3px !important;
}
.first-level {
  margin-left: 20px !important;
  width: 92% !important;
  font-size: 1.1rem;
  font-family: Montserrat, Helvetica, Arial, serif;
  font-weight: 400;
  min-height: 22px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.v-list-item-title {
  font-size: 0.9rem !important;
  padding: 0.7rem 0 !important;
}
#user-data-list .v-list-item-title {
  padding: 0 !important;
}
.v-theme--light.v-list {
  background-color: #f9f9f9 !important;
  overflow-x: hidden !important;
}
.v-theme--dark.v-list {
  /* background-color:#212121 !important; */
  overflow-x: hidden !important;
}

.v-list-item__prepend > .v-icon {
  margin-inline-end: 15px !important;
  margin-inline-start: 8px !important;
}

.v-list-item__append > .v-icon {
  margin-inline-start: 10px !important;
}
</style>
