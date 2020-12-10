<template>
  <div>
  <div class="page-title">
    <h3>{{'RecordHistory' | localize}}</h3>
  </div>

  <div class="history-chart">
    <canvas ref="canvas"></canvas>
  </div>

  <Loader v-if="loading"/>

  <p v-else-if="!records.length" class="center">{{'Message_NoRecords' | localize}}.
    <router-link to="/record"> {{'AddRecord' | localize}}</router-link>
  </p>

  <section v-else>
    <HistoryTable :records="items"/>
    <Paginate
      v-model="page"
      :page-count="pageCount"
      :click-handler="pageChangeHandler"
      :prev-text="'Prev' | localize"
      :next-text="'Next' | localize"
      :container-class="'pagination'"
      :page-class="'waves-effect'"
    />
    </section>
</div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin';
import HistoryTable from '@/components/HistoryTable.vue';
import localizeFilter from '@/filters/localize.filter';
import { Pie } from 'vue-chartjs';

export default {
  name: 'history',
  extends: Pie,
  mixins: [paginationMixin],
  metaInfo() {
    return {
      title: this.$title('History'),
    };
  },
  data() {
    return {
      loading: true,
      records: [],
    };
  },
  async mounted() {
    const categories = await this.$store.dispatch('fetchCategories');
    this.records = await this.$store.dispatch('fetchRecords');
    this.setup(categories);
    this.loading = false;
  },
  methods: {
    setup(categories) {
      // eslint-disable-next-line arrow-body-style
      this.setupPagination(this.records.map((record) => {
        return {
          ...record,
          categoryName: categories.find((c) => c.id === record.categoryId).title,
          typeClass: record.type === 'income' ? 'green' : 'red',
          typeText: record.type === 'income' ? localizeFilter('Income') : localizeFilter('Outcome'),
        };
      }));

      this.renderChart({
        labels: categories.map((c) => c.title),
        datasets: [{
          label: localizeFilter('ExpensesByCategory'),
          // eslint-disable-next-line arrow-body-style
          data: categories.map((c) => {
            return this.records.reduce((total, r) => {
              if (r.categoryId === c.id && r.type === 'outcome') {
                // eslint-disable-next-line no-param-reassign
                total += +r.amount;
              }
              return total;
            }, 0);
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        }],
      });
    },
  },
  components: {
    HistoryTable,
  },
};
</script>
