const vm = new Vue({
    el: "#app",
    data: {
        products: [],
        product: false,
        cart: [],
        cartActive: false,
        alertMessage: "item added",
        alertActive: false
    },
    computed: {
        cartTotal() {
            let total = 0;
            if(this.cart.length) {
                this.cart.forEach(item => {
                    total += item.price;
                })
            }
            return total;
        }
    },
    methods: {
        fetchProducts() {
            fetch("./api/products.json")
              .then(r => r.json())
              .then(r => {
                this.products = r;
              })
        },
        fetchProduct(id) {
            fetch(`./api/products/${id}/data.json`)
            .then (r => r.json())
            .then(r => {
                this.product = r;
            })
        },
        openModal(id) {
            this.fetchProduct(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        closeModal({target, currentTarget}) {
            if(target === currentTarget)
            this.product = false;
        },
        addItem() {
            this.product.stock--;
            const { id, name, price } = this.product;
            this.cart.push({ id, name, price });
            this.alert(`${name} has been added to cart.`);
        },
        removeItem(index) {
            this.cart.splice(index, 1);
        },
        checkLocalStorage() {
            if(window.localStorage.cart) {
                this.cart = JSON.parse(window.localStorage.cart);
            }
        },
        alert(message) {
            this.alertMessage = message;
            this.alertActive = true;
            setTimeout(() => {
                this.alertActive = false;
            }, 1500);
        },
        router() {
            const hash = document.location.hash;
            if(hash) {
                this.fetchProduct(hash.replace("#", ""));
            }
        },
        clickOutsideCart({target, currentTarget}) {
            if(target === currentTarget)
            this.cartActive = false;
        },
        compareStock() {
            const items = this.cart.filter(({ id }) => id === this.product.id);
            this.product.stock -= items.length;
        }
    },
    watch: {
        cart() {
            window.localStorage.cart = JSON.stringify(this.cart);
        },
        product() {
            document.title = this.product.name || "Techno";
            const hash = this.product.id || "";
            history.pushState(null, null, `#${hash}`);
            if(this.product) {
                this.compareStock();
            }
        }
    },
    created() {
        this.fetchProducts();
        this.router();
        this.checkLocalStorage();
    },
    filters: {
        numberPrice(price) {
            return price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        }
    },
})