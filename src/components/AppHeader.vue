<template>
  <v-app-bar v-if="root.authenticated">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="toogleDrawer()"
      ></v-app-bar-nav-icon>
      <span class="d-flex align-center pl-3">CMS Logo</span>
    </template>

    <v-spacer></v-spacer>

    <v-icon
      @click="toggleTheme"
      style="font-size: 25px; margin-inline: 10px"
      v-if="theme.name.value == 'dark'"
      >mdi-white-balance-sunny</v-icon
    >
    <v-icon
      @click="toggleTheme"
      style="font-size: 25px; margin-inline: 10px"
      v-else
      >mdi-weather-night</v-icon
    >

    <!--start : profile menu -->
    <v-menu
      v-model="profile"
      :close-on-content-click="false"
      location="start"
      style="margin-left: 10px"
    >
      <template v-slot:activator="{ props }">
        <v-icon style="font-size: 25px; margin-inline: 10px" v-bind="props"
          >mdi-account-circle</v-icon
        >
      </template>

      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-list class="pa-sm-0" v-model:opened="open">
            <v-list-item
              @click="profile = false"
              style="cursor: pointer"
              prepend-icon="mdi-account-circle"
              title="Profile"
            ></v-list-item>
            <v-divider></v-divider>

            <!-- translation list -->

            <v-list-group>
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-translate"
                  title="Languages"
                  value="Users"
                ></v-list-item>
              </template>
              <template v-for="(language, index) in languages" :key="index">
                <v-list-item
                  @click="changeLanguage(index)"
                  style="cursor: pointer"
                  :style="
                    language.isDefualt
                      ? 'padding-inline-start: 15px !important;'
                      : ''
                  "
                  :prepend-icon="language.isDefualt ? 'mdi-check' : ''"
                  :title="language.name"
                ></v-list-item>
                <!-- <v-list-item style="cursor:pointer" title="English"></v-list-item>
                        <v-list-item style="cursor:pointer" title="French"></v-list-item> -->
              </template>
            </v-list-group>
            <v-divider></v-divider>

            <v-list-item
              @click="logout()"
              style="cursor: pointer"
              prepend-icon="mdi-logout"
              title="Logout"
            ></v-list-item>
          </v-list>
        </v-card-actions>
      </v-card>
    </v-menu>
    <!--end : profile menu -->
  </v-app-bar>
</template>

<script setup>
import { useTheme } from "vuetify";
import { reactive, ref } from "vue";
import { useRootStore } from "@/stores/root.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const root = useRootStore();
const router = useRouter();

const { count, languages, rootTheme, drawer } = storeToRefs(root);

const open = ref(["Users"]);
const notifications = ref([
  {
    title: "mdi-bell-ring-outline",
    isRead: false,
    time: "Mon at 10:25 AM",
    img: "https://cdn.vuetifyjs.com/images/john.jpg",
  },
  {
    title: "mdi-bell-ring-outline",
    isRead: true,
    time: "Mon at 10:40 AM",
    img: "https://cdn.vuetifyjs.com/images/john.jpg",
  },
  {
    title: "john.doe@doe.com",
    isRead: false,
    time: "Mon at 11:50 AM",
    img: "https://cdn.vuetifyjs.com/images/john.jpg",
  },
  {
    title: "mdi-bell-ring-",
    isRead: false,
    time: "Mon at 10:22 AM",
    img: "https://cdn.vuetifyjs.com/images/john.jpg",
  },
  {
    title: "mdi-outline",
    isRead: true,
    time: "Mon at 10:45 AM",
    img: "https://cdn.vuetifyjs.com/images/john.jpg",
  },
  {
    title: "john..com",
    isRead: false,
    time: "Mon at 11:54 AM",
    img: "https://cdn.vuetifyjs.com/images/john.jpg",
  },
]);
const fav = ref(true);
const notification_menu = ref(false);
const profile = ref(false);
const notification_count = ref(7);

defineExpose({
  rootTheme,
  notifications,
  languages,
  fav,
  notification_menu,
  profile,
  notification_count,
  open,
});

const theme = useTheme();

function toogleDrawer() {
  root.$patch({
    drawer: !drawer.value,
  });
}

function toggleTheme() {
  let result = (theme.global.name.value = theme.global.current.value.dark
    ? "light"
    : "dark");
  root.$patch({
    rootTheme: result,
  });
  return result;
}

function logout() {
  try {
    // const  res  = root.logout()
    root.logout();
    profile.value = false;
    router.push({ name: "SignIn" });
  } catch (error) {
    alert("error logout: " + error);
  }
}
</script>