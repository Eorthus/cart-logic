Vue.component('find', {
    data() {
        return {
            searchLine: '',

        }
    },
    props: ['filteredProducts', 'products'],
    methods: {
        filtered() {
            let products = this.$root.$refs.products.products;
            let search = this.searchLine.toUpperCase().trim();

            if (search === '') {
                this.$root.$refs.products.filteredProducts = products;
            } else {
                this.$root.$refs.products.filteredProducts = products.filter((el) => {
                    return el.product_name.toUpperCase().includes(search);
                });
            }
        },
    },
    mounted() {
        console.log(this);
    },
    template: `
        <div>
        <form action="#" class="search-form">
        <input type="text" class="search-field" v-model="searchLine">
      <buttonfind @filtered="filtered"></buttonfind>
    </form>
        </div>`
});

Vue.component('buttonfind', {
    props: [],
    template: `
    
   
    <button class="btn-search" @click="$emit('filtered')" type="submit">
    <i class="fas fa-search"></i>
</button>
   `
});
