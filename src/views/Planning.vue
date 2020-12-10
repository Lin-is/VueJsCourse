<template>
  <div>
    <div class="page-title">
      <h3>{{'Planning' | localize}}</h3>
      <h4>{{info.bill | currency('RUB')}}</h4>
    </div>

    <Loader v-if="loading"/>

    <p v-else-if="!categories.length" class="center">{{'Message_NoCategories' | localize}}.
      <router-link to="/categories"> {{'AddCategory' | localize}}</router-link>
    </p>

    <section v-else>
      <div v-for="cat of categories"
      :key="cat.id"
      >
        <p>
          <strong>{{cat.title}}:</strong>
          {{cat.spend | currency('RUB')}} {{'Of' | localize}} {{cat.limit | currency('RUB')}}
        </p>
        <div class="progress" v-tooltip.noloc="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{width: cat.progressPercent + '%'}"
          >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import currencyFilter from '@/filters/currency.filter';
import localizeFilter from '@/filters/localize.filter';

export default {
  name: 'planning',
  metaInfo() {
    return {
      title: this.$title('Planning'),
    };
  },
  data() {
    return {
      loading: true,
      categories: [],
    };
  },
  computed: {
    ...mapGetters(['info']),
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');

    this.categories = categories.map((cat) => {
      const spend = records
        .filter((r) => r.categoryId === cat.id)
        .filter((r) => r.type === 'outcome')
        .reduce((total, record) => {
          // eslint-disable-next-line no-param-reassign
          total += +record.amount;
          return total;
        }, 0);

      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      // eslint-disable-next-line no-nested-ternary
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red';
      const tooltipValue = cat.limit - spend;
      const tooltip = `${tooltipValue < 0 ? localizeFilter('ExcessBy') : localizeFilter('Remain')} ${currencyFilter(Math.abs(tooltipValue))}`;
      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip,
      };
    });

    this.loading = false;
  },
};
</script>
