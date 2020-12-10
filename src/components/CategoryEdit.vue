<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit' | localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field" >
          <select v-model="current" ref="select">
            <option
            v-for="c of categories"
            :key="c.id"
            :value="c.id"
            >{{c.title}}
            </option>
          </select>
          <label>{{'SelectCat' | localize}}</label>
        </div>

        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model="title"
              :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          >
          <label for="name">{{'CategoryName' | localize}}</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
          >{{'Message_EnterCatName' | localize}}</span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model.number="limit"
              :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          >
          <label for="limit">{{'Limit' | localize}}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
          >{{'Message_MinValue' | localize}} {{ $v.limit.$params.minValue.min }}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Update' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';
import M from 'materialize-css';

export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: '',
      limit: 100,
      select: null,
      current: null,
    };
  },
  validations: {
    title: { required },
    limit: { minValue: minValue(100) },
  },
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find((c) => c.id === catId);
      this.title = title;
      this.limit = limit;
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit,
        };
        await this.$store.dispatch('updateCategory', categoryData);
        this.$message('Категория успешно обновлена');
        this.$emit('updated', categoryData);
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  mounted() {
    M.updateTextFields();
    this.select = M.FormSelect.init(this.$refs.select);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
};
</script>
