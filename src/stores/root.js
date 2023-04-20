import { defineStore } from "pinia";
import repository from "@/api/repository.js";
import router from "@/router";

export const useRootStore = defineStore("root", {
  id: "root",
  state: () => ({
    languages: [
      { name: "عربي", isDefualt: false },
      { name: "English", isDefualt: true },
      { name: "française", isDefualt: false },
    ],
    rootTheme: {
      name: {
        value: "light",
      },
    },
    count: 25,
    rail: true,
    drawer: true,
    counter: 0,
    user: localStorage.user ? localStorage.getItem("user") : null,
    loader: true,
  }),
  actions: {
    async getToken() {
      return await repository.getToken();
    },

    async login(newUser) {
      const { data } = await repository.login(newUser);

      if (data.code === 1) {
        router.push({ name: "Home" });
        this.user = data.data.user;
        const date = new Date()
        date.setDate(date.getDate() + 1)
        const item = {
          value: this.user,
          expiry: date,
        }
        localStorage.user = JSON.stringify(item)
      }

      return data;
    },

    async logout() {
      this.user = null;
      localStorage.removeItem("user");
      await repository.logout();
    },
  },

  getters: {
    // user: state => state.user,
    authenticated: (state) => state.user !== null,
    getUser:(state) => {
      let user =typeof state.user == 'string' ? JSON.parse(state.user) : state.user
      user = user ? user.value ?? user : null
      return user
    },
  },
});
