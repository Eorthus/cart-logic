Vue.component('products', {
    data() {
        return {
            catalogUrl: '/catalogData.json',
            products: [],
            filteredProducts: [],
            imgCatalog: 'http://placehold.it/200x150',
        }
    },
    methods: {

    },
    mounted() {
        this.$parent.getJson('/api/products')
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.filteredProducts.push(el);
                }
            });
    },
    template: `
        <div class="products">
            <product v-for="product of filteredProducts" :key="product.id_product" :img="imgCatalog" :prod="product" :cat="filteredProducts"></product>
        </div>
    `
});
Vue.component('product', {
    props: ['prod', 'img'],

    template: `
    <div class="product-item">
                <img :src="img" alt="Some img">
                <div class="desc">
                <h3> {{ prod.product_name }} </h3>
                <p> {{ prod.price }} </p>
                <button class="buy-btn" @click="$parent.$parent.$refs.cart.addProduct(prod)">Купить</button>
            </div>
            </div>
    `
});