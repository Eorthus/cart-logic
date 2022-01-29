Vue.component('cart', {
    data() {
        return {
            imgCart: 'http://placehold.it/100x75',
            cartUrl: '/getBasket.json',
            CartProducts: [],
            showCart: false,
        }
    },
    methods: {
        addProduct(product) {
            let find = this.CartProducts.find(el => el.id_product === product.id_product);
            if (find) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, { quantity: 1 });
                find.quantity++;
            } else {
                let prod = Object.assign({ quantity: 1 }, product);
                this.$parent.postJson('/api/cart', prod)
                    .then(data => {
                        if (data.result === 1) {
                            this.CartProducts.push(prod);
                        }
                    });
            }
        },
        remove(item) {
            if (item.quantity > 1) {
                this.$parent.putJson(`/api/cart/${item.id_product}`, { quantity: -1 })
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--;
                        }
                    });
            } else {
                this.$parent.deleteJson(`/api/cart/${item.id_product}`)
                    .then(data => {
                        if (data.result === 1) {
                            this.CartProducts.splice(this.CartProducts.indexOf(item), 1);
                        }
                    });
            }
        },
    },
    mounted() {
        this.$parent.getJson('/api/cart')
            .then(data => {
                for (let el of data.contents) {
                    this.CartProducts.push(el);
                }
            });
    },
    template: `
        <div>
            <button class="btn-cart" type="button" @click="showCart = !showCart">Корзина</button>
            <div class="cart-block" v-show="showCart">
                <p v-if="!CartProducts.length">Корзина пуста</p>
                <cart-item class="cart-item" 
                v-for="product of CartProducts" 
                :key="product.id_product"
                :CartProduct="product" 
                :img="imgCart"
                @remove="remove">
                </cart-item>
            </div>
        </div>`
});

Vue.component('cart-item', {
    props: ['CartProduct', 'img'],
    template: `
                <div class="cart-item">
               
                    <img :src="img" alt="someimg">
                    <p class="product-title">{{CartProduct.product_name}}</p>
                    <p class="product-quantity">Количество: {{CartProduct.quantity}}</p>
                    <p class="product-price">{{CartProduct.quantity * CartProduct.price}} Р</p>
                    <button class="del-btn" @click="$emit('remove', CartProduct)">Удалить из корзины</button>
                </div>`
});