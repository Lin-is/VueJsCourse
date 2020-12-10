<template>
  <div>
    <div class="page-title">
      <h3>{{'Categories'| localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading"/>
      <div v-else class="row">
        <CategoryCreate @created="addNewCategory"/>
        <CategoryEdit
          v-if="categories.length"
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
        />
        <p v-else class="center">{{'Message_NoCategories' | localize}}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate.vue';
import CategoryEdit from '@/components/CategoryEdit.vue';

export default {
  name: 'categories',
  metaInfo() {
    return {
      title: this.$title('Categories'),
    };
  },
  data() {
    return {
      categories: [],
      loading: true,
      updateCount: 0,
    };
  },
  components: {
    CategoryCreate, CategoryEdit,
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
      console.log(this.categories);
    },
    updateCategories(category) {
      const index = this.categories.findIndex((c) => c.id === category.id);
      this.categories[index].title = category.title;
      this.categories[index].limit = category.limit;
      this.updateCount += 1;
    },
  },
};
</script>
