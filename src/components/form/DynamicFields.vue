<template>
    

  <!-- Requried Fields -->
  <template v-if="true">
    <template v-for="field in required_fields" :key="field">
      <template v-if="object_fields[field.id].type == 'text'">
        <v-col cols="6" sm="6" md="6">
          <v-text-field
            :label="object_fields[field.id].title + ' Arabic'"
            v-model="object_fields[field.id].value.ar"
            required
            :error-messages="errors[field.id].ar"
            variant="outlined"
          ></v-text-field>
          <!--  
            small
            density="compact" 
          -->
        </v-col>
        <v-col cols="6" sm="6" md="6">
          <v-text-field
            :label="object_fields[field.id].title + ' English'"
            v-model="object_fields[field.id].value.en"
            required
            :error-messages="errors[field.id].en"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </template>
      <template v-else-if="object_fields[field.id].type == 'textarea'">
        <v-col cols="6" sm="6" md="6">
          <v-textarea
            filled
            :error-messages="errors[field.id]"

            auto-grow
            :label="object_fields[field.id].title + ' Arabic'"
            v-model="object_fields[field.id].value.ar"
            rows="2"
            row-height="20"
            required
            variant="outlined"
          ></v-textarea>
        </v-col>
        <v-col cols="6" sm="6" md="6">
          <v-textarea
            filled
            auto-grow
            :error-messages="errors[field.id]"

            :label="object_fields[field.id].title + ' English'"
            v-model="object_fields[field.id].value.en"
            rows="2"
            row-height="20"
            required
            variant="outlined"
          ></v-textarea>
        </v-col>
      </template>
      <template v-else-if="object_fields[field.id].type == 'select' || object_fields[field.id].type =='multi-select'">
        <v-col cols="12" sm="12" md="12">
          <v-select
            v-model="object_fields[field.id].value"
            :items="object_fields[field.id].select_options"
            chips
            :error-messages="errors[field.id]"
            :label="object_fields[field.id].title"
            item-title="value"
            item-value="id"
            :multiple="object_fields[field.id].type =='multi-select'"
            variant="outlined"
          ></v-select>
        </v-col>
      </template>
      <template v-else-if="object_fields[field.id].type == 'checkbox'">
        <v-col cols="12" sm="12" md="12">
          <v-checkbox
            v-model="object_fields[field.id].value"
            :label="object_fields[field.id].title"
            required
          ></v-checkbox>
        </v-col>
      </template>
      <template v-else-if="object_fields[field.id].type == 'date'">
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            type="date"
            :error-messages="errors[field.id]"

            :label="object_fields[field.id].title"
            v-model="object_fields[field.id].value"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
      </template>
    </template>
  </template>

  <!-- Unrequired Fields -->
  <v-col v-if="unrequired_fields.length" cols="12" sm="12" md="12">
    <v-select
      v-model="fields"
      :items="unrequired_fields"
      chips
      item-title="title"
      item-value="id"
      label="Unrequiered Fields"
      multiple
      variant="outlined"
    ></v-select>
  </v-col>

  <template v-if="fields.length > 0">
    <template v-for="field in fields" :key="field">
      <template v-if="object_fields[field].type == 'text'">
        <v-col cols="6" sm="6" md="6">
          <v-text-field
            :label="object_fields[field].title + ' Arabic'"
            v-model="object_fields[field].value.ar"
            required
            variant="outlined"
          ></v-text-field>
          <!--  
            small
            density="compact" 
          -->
        </v-col>
        <v-col cols="6" sm="6" md="6">
          <v-text-field
            :label="object_fields[field].title + ' English'"
            v-model="object_fields[field].value.en"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
      </template>
      <template v-else-if="object_fields[field].type == 'textarea'">
        <v-col cols="6" sm="6" md="6">
          <v-textarea
            filled
            auto-grow
            :label="object_fields[field].title + ' Arabic'"
            v-model="object_fields[field].value.ar"
            rows="2"
            row-height="20"
            required
            variant="outlined"
          ></v-textarea>
        </v-col>
        <v-col cols="6" sm="6" md="6">
          <v-textarea
            filled
            auto-grow
            :label="object_fields[field].title + ' English'"
            v-model="object_fields[field].value.en"
            rows="2"
            row-height="20"
            required
            variant="outlined"
          ></v-textarea>
        </v-col>
      </template>
      <template v-else-if="object_fields[field].type == 'select' || object_fields[field].type == 'multi-select' ">
        <v-col cols="12" sm="12" md="12">
          <v-select
            v-model="object_fields[field].value"
            :items="object_fields[field].select_options"
            chips
            :label="object_fields[field].title"
            item-title="value"
            item-value="id"
            :multiple="object_fields[field].type == 'multi-select'"
            variant="outlined"
          ></v-select>
        </v-col>
      </template>
      <template v-else-if="object_fields[field].type == 'checkbox'">
        <v-col cols="12" sm="12" md="12">
          <v-checkbox
            v-model="object_fields[field].value"
            :label="object_fields[field].title"
            required
          ></v-checkbox>
        </v-col>
      </template>
      <template v-else-if="object_fields[field].type == 'date'">
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            type="date"
            :label="object_fields[field].title"
            v-model="object_fields[field].value"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
      </template>
    </template>
  </template>
</template>
<script>
export default  {
    name:'DynamicFields',
  props: {
    required_fields: [],
    object_fields: [],
    unrequired_fields: [],
    errors:[],
    fields: [],
  },
  watch:{
    "fields":{
      handler:function(val){
      this.$emit('UpdateFields',this.fields)}
    }
  }
};
</script>
