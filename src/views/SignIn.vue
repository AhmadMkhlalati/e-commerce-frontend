<template>
  <div class="background" style="margin-top: 5%">
    <v-row no-gutters>
      <v-col align-self="start" style="max-width: 40rem !important" cols="6">
        <v-alert
          v-if="hasError"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ errorMsg }}
        </v-alert>

        <form class="login-form">
          <v-row class="px-5">
            <v-col
              class="mb-15"
              justify="center"
              style="font-size: 25px; color: black"
              cols="6"
            >
              <h3 class="text-start font-weight-bold">Login</h3>
            </v-col>
            <v-col class="py-0" cols="12">
              <v-text-field
                class="text-input-login"
                name="email"
                label="Email"
                v-model="user.email"
                variant="outlined"
                style="width: 90% !important"
                required
              ></v-text-field>
            </v-col>

            <v-col class="py-0" cols="12">
              <v-text-field
                label="Password"
                v-model="user.password"
                variant="outlined"
                name="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                style="width: 100% !important"
                required
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" cols="12">
              <div v-if="passwordError" class="error">{{ passwordError }}</div>

              <div class="terms">
                <input type="checkbox" v-model="terms" required />
                <label style="color: black">Accept terms and conditions</label>
              </div>
            </v-col>

            <!-- <v-row>
          <v-spacer></v-spacer> -->
            <v-col cols="12" class="text-center">
              <v-btn
                @click.prevent="login"
                style="
                  margin-top: 2rem;
                  margin-top: 2rem;
                  width: 65%;
                  background-color: black;
                  color: white;
                  border-radius: 20px;
                  text-transform: none;
                "
                >Login</v-btn
              >
            </v-col>

            <!-- </v-row> -->
            <v-dialog v-model="dialog" hide-overlay persistent class="stand-by-login-dialog">
              <v-card color="primary">
                <v-card-text>
                  Please stand by
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-row>
        </form>
      </v-col>
      <v-col justify="center" cols="6">
        <v-row no-gutters style="margin-top: 16%; margin-left: 10%">
          <v-col justify="center" cols="12">
            <h1 class="font-weight-bold">Itsconsigliere</h1>
            <h1 class="font-weight-bold">CMS</h1>
          </v-col>

          <v-col justify="center" cols="4" class="mt-13 px-4">
            <v-card style="background-color: white; box-shadow: none">
              <v-row>
                <v-col cols="12">
                  <v-icon class="mx-auto d-flex justify-center mt-0" size="88"
                    >mdi-package-variant</v-icon
                  >
                </v-col>
                <v-col cols="12" class="login-title d-flex justify-center mt-0">
                  Setup
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col justify="center" cols="4" class="mt-13 px-4">
            <v-card style="background-color: white; box-shadow: none">
              <v-row>
                <v-col cols="12">
                  <v-icon class="mx-auto d-flex justify-center mt-0" size="88"
                    >mdi-format-list-checks</v-icon
                  >
                </v-col>
                <v-col cols="12" class="login-title d-flex justify-center mt-0">
                  Manage
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col justify="center" cols="4" class="mt-13 px-4">
            <v-card style="background-color: white; box-shadow: none">
              <v-row>
                <v-col cols="12">
                  <v-icon class="mx-auto d-flex justify-center mt-0" size="88"
                    >mdi-cart-outline</v-icon
                  >
                </v-col>
                <v-col cols="12" class="login-title d-flex justify-center mt-0">
                  Produce
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters style="margin-top: 16%; margin-left: 10%">
          <v-col justify="center" cols="8">
            <p class="text-caption" style="color: rgb(161, 161, 161)">
              © 2022 Consigliere. All Rights Reserved
            </p>
          </v-col>
          <!-- <v-col  justify="center" cols="4">
            <p  class="text-caption" style="color:rgb(161, 161, 161)">Lorem Ipsum</p>
          </v-col> -->
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useRootStore } from "@/stores/root.js";

export default {
  setup() {
    const root = useRootStore();

    return {
      root,
    };
  },
  data() {
    return {
      email: "",
      password: "",
      terms: false,
      passwordError: null,
      user: {
        email: null,
        password: "",
      },
      error: null,
      loading: false,
      dialog: false,
      hasError: false,
      errorMsg: "",
      show1: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  methods: {
    async login() {
      this.dialog = true;
      this.error = null;
      try {
        await this.root.getToken();
        const res = await this.root.login(this.user);
        if (res.code === -1) {
          this.errorMsg = res.message;
          this.hasError = true;
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.dialog = false;
      }
    },
  },
};
</script>

<style lang="scss">
.login-form {
  label {
    color: #000;
    display: inline-block;
    padding-top: 0.2rem !important;
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    // margin-top: 1rem !important;
  }
  .v-field__input input {
    background: transparent !important;
  }
}

.v-theme--light input:-webkit-autofill,
.v-theme--light input:-webkit-autofill:hover,
.v-theme--light input:-webkit-autofill:focus,
.v-theme--light input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
}
.v-theme--dark input:-webkit-autofill,
.v-theme--dark input:-webkit-autofill:hover,
.v-theme--dark input:-webkit-autofill:focus,
.v-theme--dark input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #121212 inset !important;
  box-shadow: 0 0 0 30px #121212 inset !important;
}

.login-title {
  background-color: transparent;
  font-size: 1.7vw;
  padding: 0.5rem 0px;
  font-family: "Poppins-Bold", sans-serif;
  font-weight: 800;
}
form {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  max-width: 36rem;
  align-items: center;
  margin: 0 auto;
  margin-top: 2rem;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

.submit {
  text-align: center;
  background: #37979b;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}
.error {
  color: #ff0062;
  margin-top: 10px;
  font-size: 0.8em;
  font-weight: bold;
}
.v-alert:not(.order-success-alert-id) {
  max-width: 36rem;
  align-items: center;
  margin: 0 auto;
  position: fixed !important;
  left: 50%;
  transform: translateX(-50%);
  width: 100% !important;
  z-index: 9999;
}
.v-theme--light .login-form .v-field__field {
  background-color: #fefefe !important;
}
</style>
