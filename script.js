class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 },
        ];
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    summary() {
        let totalSum = 0;
        this.goods.forEach(good => {
            totalSum += good.price
        });
        console.log(totalSum)
    }
}


const list = new GoodsList();
list.fetchGoods();
list.render();
list.summary();


class Cart {
    constructor() {
        this.CartItem = [];
    }
    render() {
        return `<ul class="cart">${this.cartItem}</ul>`;

    }
}

class CartItem extends GoodsItem {
    constructor(Count, TotalSum) {
        super(title, price);
        this.Count = Count;
        this.TotalSum = TotalSum;
    }
    render() {
        return `<li class="cart-item">
            <h3 class="cart-item-h">${this.title}</h3>
            <p class="cart-item-price">${this.price}</p>
            <p class="cart-item-count">${this.Count}</p>
            <p class="cart-item-sum">${this.TotalSum}</p>
        </li>`
    }
    GetCountItem() {


    }
    GetTotalSum() {

    }
}
