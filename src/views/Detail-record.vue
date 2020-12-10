<template>
  <div>
  <Loader v-if="loading"/>
  <div v-else-if="record">
    <div class="breadcrumb-wrap">
      <router-link to="/history" class="breadcrumb">{{'History' | localize}}</router-link>
      <a @click.prevent class="breadcrumb">
        {{ linkClass }}
      </a>
    </div>
    <div class="row">
      <div class="col s12 m6">
        <div
          class="card"
          :class="{
            'red': record.type === 'outcome',
            'green': record.type === 'income'
          }"
        >
          <div class="card-content white-text">
            <p>{{'Descr' | localize}}: {{record.description}}</p>
            <p>{{'Amount' | localize}}: {{record.amount | currency('RUB')}}</p>
            <p>{{'Category' | localize}}: {{record.categoryName}}</p>

            <small>{{record.date | date('datetime')}}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p class="center" v-else>Запись с id={{$route.params.id}} не найдена</p>
</div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter';

export default {
  name: 'detail-record',
  metaInfo() {
    return {
      title: this.$title('Detail_Title'),
    };
  },
  data() {
    return {
      record: null,
      loading: true,
      linkClass: '',
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    const record = await this.$store.dispatch('fetchRecordById', id);
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId);
    console.log(category);

    this.record = {
      ...record,
      categoryName: category.title,
    };

    this.linkClass = this.record.type === 'income' ? localizeFilter('Income') : localizeFilter('Outcome');

    this.loading = false;
  },
};
</script>
