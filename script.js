const makeGETRequest = (url) => {
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
};
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


class GoodsItem {
    constructor(product_name, price) {
        this.product_name = product_name;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><img src="http://placehold.it/120x120"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];

    }
    fetchGoods(resolve) {
        makeGETRequest(`${API_URL}/catalogData.json`)
            .then((goods) => {
                this.goods = JSON.parse(goods);
                resolve();
            })
            .catch((error) => {
                console.log(error);
            });

    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    summary() {
        let totalSum = 0;
        this.goods.forEach(good => {
            totalSum += good.price
        });
        return totalSum;
    }
}


const list = new GoodsList();
list.fetchGoods(() => {
    list.render();
});



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
