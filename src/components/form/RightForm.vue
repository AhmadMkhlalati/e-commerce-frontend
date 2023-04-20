<template>
  <v-card class="right-form-card">
    <v-layout class="right-form" style="height: 100%">
      <div class="right-form-contain">
        <slot></slot>
      </div>
    </v-layout>
  </v-card>
</template>
<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "RightForm",
  data() {
    return {
      drawer: null,
      rail: false,
    };
  },
  emits: ["formVisiblity"],
});
</script>
<style lang="scss">
.right-form-card {
  position: fixed!important;
  top: 0!important;
  right: 0!important;
  height: 100%!important;
  width: 500px!important;
  transition: display 1000ms;
  box-shadow: 0px 0px 0px #22292f1c;
  .right-form {
    padding-top: 70px ;
    .right-form-contain{
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      width: 100%;
    }
  }
}
</style>
