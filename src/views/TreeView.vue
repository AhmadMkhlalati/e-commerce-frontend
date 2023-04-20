<template>

        <v-row justify="center" class="pa-2 ma-2">
                <v-col
                cols="6"
                >


        <input v-model="searchText" type="text" />
        <Tree
            :nodes="data"
            :search-text="searchText"
            :use-checkbox="true"
            :use-icon="false"
            show-child-count
            @nodeExpanded="onNodeExpanded"
            @update:nodes="onUpdate"
            @nodeClick="onNodeClick"
            v-model:nodes="data"
        />
            <!-- use-row-delete -->

        </v-col>
        </v-row>


</template>

<script>
import { ref } from "vue";
import Tree from "vue3-tree";
import "vue3-tree/dist/style.css";

export default {
  components: {
    Tree,
  },
  setup() {
    const data = ref([
      {
        id: 1,
        label: "Animal",
        
        nodes: [
          {
            id: 2,
            label: "Dog",
        

            nodes: [
              {   
                id: 78,
                label: "cheep",
                nodes: [
                        {
                            checked: false,
                            id: 88,
                            label: "Azzam Ya Man",
                        }
                    ],
                    
              },
              {
                id: 5,
                label: "Japanese Bobtail Cat",
                checked: true,


              },
               {
                id: 6,
                label: "Japanese Bobtail sdsadsdCa",
                checked: true,

              },
            ],
          },
          {
            id: 3,
            label: "Cat",
            nodes: [
              {
                checked: true,
                id: 4,
                label: "Egyptian Mau Cat",
              },
              {
                checked: true,
                id: 5,
                label: "Japanese Bobtail Cat",
              },
               {
                checked: true,
                id: 6,
                label: "Japanese Bobtail sdsadsdCa",
              },
            ],
          },
        ],
      },
      {
        id: 6,
        label: "People",
        checked: true,
      },
    ]);
    const searchText = ref("");
    const onNodeExpanded = (node, state) => {

    };

    const onUpdate = (nodes) => {
      //data return
        // onNodeClick()
    };

    const onNodeClick = (node) => {

    };

    return {
      data,
      searchText,
      onNodeExpanded,
      onUpdate,
      onNodeClick,
    };
  },
};
</script>

<style lang="scss">

input[type='checkbox'] {
  width: 17px;
  height: 17px;
}

</style>