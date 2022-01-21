/*const makeGETRequest = (url) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            setTimeout(() => {
                if (xhr.readyState === 4) {
                    resolve(xhr.responseText)
                }
                else {
                    reject(`Error`);
                }

            }, 200);
        };
        xhr.open('GET', url, true);
        xhr.send();
    });
};*/
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
class List {
    constructor(url, container = ".products", list = ListContent) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }
    getJson(url) {
        return fetch(url ? url : `${API_URL + this.url}`)
            .then(result => result.json())
            .catch(error => { console.log(error) })
    }
    handleData(data) {
        this.goods = data;
        this.render();
    }
    calcSum() { }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            console.log(this.constructor.name);
            //   const productObj = new this.list[this.constructor.name](product);
            let productObj = null;
            if (this.constructor.name === 'ProductsList') productObj = new ProductItem(product);
            if (this.constructor.name === 'Cart') productObj = new CartItem(product);
            if (!productObj) return;

            console.log(productObj);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
    filter(value) {
        const regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
        this.allProducts.forEach(el => {
            const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
            if (!this.filtered.includes(el)) {
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }
    _init() {
        return false
    }
}
class Item {
    constructor(el, foto = "https://placehold.it/120x80") {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = foto;
    }
    render() {
        return ``;
    }
}
class ProductsList extends List {
    constructor(cart, container = '.products', url = "/catalogData.json") {
        super(url, container);
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data));
    }
    _init() {
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                this.cart.addProduct(e.target);
            }
        });
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            this.filter(document.querySelector('.search-field').value)
        })
    }
}
class ProductItem extends Item {
    constructor(product_name, price, id_product, foto = 'http://placehold.it/120x80') {
        super(product_name, price, id_product)
        this.foto = foto;
    }
    render() {
        return `<div class="product-item" data-id="${this.id_product}">
            <img src="${this.foto}" alt="Some img"></img>
            <div class="desc">
                <h3>${this.product_name}</h3>
                <p>${this.price}P</p>
                <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>

            </div>
        </div>`;
    }
}
class Cart extends List {
    constructor(container = ".cart-block", url = "/getBasket.json") {
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents);
            });

    }
    addProduct(element) {
        this.getJson(`${API_URL}/addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];

                    let find = this.allProducts.find(product => product.id_product === productId);

                    if (find) {
                        find.quantity++;
                        console.log(find);
                        this._updateCart(find);
                    }
                    else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1,
                        };
                        this.goods = [product];
                        this.render();
                        console.log(product);
                    }
                } else {
                    alert('error');
                }
            }
            );
    }
    removeProduct(element) {
        this.getJson(`${API_URL}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('error')
                }
            })
    }
    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Количество:${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price}P`;

    }
    _init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('del-btn')) {
                this.removeProduct(e.target);
            }
        })
    }
}
class CartItem extends Item {
    constructor(product_name, price, id_product, foto = 'http://placehold.it/120x80') {
        super(product_name, price, id_product)
        this.foto = foto;

    }
    render() {
        return `<div class = "cart-item" data-id = "${this.id_product}">
                        <h3>${this.product_name}</h3>
                        <img src = "${this.foto}" alt = "img ${this.id_product}">
                        <p>${this.price} \u20bd</p>
                        <div class="product-quantity"></div>
                        <p class="product-price"></p>
                        <button class = "buy_btn__del" > Удалить из корзины </button>
                </div>`;
    }
}
const ListContent = {
    ProductsList: ProductItem,
    Cart: CartItem
};
let cart = new Cart();
let products = new ProductsList(cart);
