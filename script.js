
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredProducts: [],
        CartProducts: [],
        searchLine: '',
        isVisibleCart: false,

    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error)
                })
        },
        FilterGood() {
            let search = this.searchLine.toUpperCase().trim();

            if (search === '') {
                this.filteredProducts = this.goods;
            } else {
                this.filteredProducts = this.goods.filter((el) => {
                    return el.product_name.toUpperCase().includes(search);
                });
            }
        },
        ShowCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        AddCart(element) {
            this.getJson(`${API_URL}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = element.id_product;
                        console.log(productId);
                        let find = this.CartProducts.find(product => product.id_product === productId);
                        if (find) {
                            find.quantity++;

                        } else {
                            let product = {
                                id_product: productId,
                                price: element.price,
                                product_name: element.product_name,
                                quantity: 1
                            };
                            this.CartProducts.push(product)
                        }

                    } else {
                        alert('error');
                    }
                }
                );
        },
        DeleteCart(element) {
            this.getJson(`${API_URL}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = element.id_product;
                        console.log(productId);
                        let find = this.CartProducts.find(product => product.id_product === productId);
                        if (find.quantity > 1) {
                            find.quantity--;
                            console.log(find.quantity)
                        } else {
                            this.CartProducts.splice(this.CartProducts.indexOf(find), 1);

                        }
                    } else {
                        alert('error')
                    }
                })

        }



    },
    mounted() {
        this.getJson(`${API_URL}/catalogData.json`)//подргрузка объектов в локальный массив
            .then(data => {
                for (let el of data) {
                    this.goods.push(el);
                    // this.CartProducts.push(el);
                    this.filteredProducts.push(el);

                }
            });
    },

});