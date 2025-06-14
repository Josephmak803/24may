const cartOpen = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");


cartOpen.addEventListener("click", ()=> cart.classList.add("active"));
cartClose.addEventListener("click", ()=> cart.classList.remove("active"));



const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button=>{
    button.addEventListener ("click", event =>{
        const product = event.target.closest(".product");
        addToCart(product);
    })
})

const cartContent =document.querySelector(".cart-content");
const addToCart = (product)=>{
    const product_image = product.querySelector("img").src;
    const product_title = product.querySelector(".product_name").textContent;
    const product_price = product.querySelector(".price").textContent;
    const stock = parseInt(product.querySelector(".stock").textContent.trim());

    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for (let item of cartItems) {
        if (item.textContent.trim() === product_title.trim()) {
            const cartBox = item.closest(".cart-box");
            const quantitySpan = cartBox.querySelector(".number");
            let quantity = parseInt(quantitySpan.textContent);
            if (quantity >= stock){
                alert("Cannot add more. Stock limit reached.");
                return
            }
            quantitySpan.textContent = quantity + 1;
            updateTotalPrice();
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `

        <img src = "${product_image}" class ="cart-image">
                <div class ="cart-details">
                    <h2 class ="cart-product-title"> ${product_title}</h2>
                    <span class ="cart-price">${product_price}</span>
                    <div class ="cart-quantity">
                        <button class ="decrement">-</button>
                        <span class= "number">1</span>
                        <button class ="increment">+</button>

                    </div>
                </div>
                <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);


    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();

        updateTotalPrice();

        updateCartCount(-1);

    })

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const number = cartBox.querySelector(".number");
        const decrement = cartBox.querySelector(".decrement");
        const increment = cartBox.querySelector(".increment");
        let quantity = parseInt(number.textContent);

        if (event.target.classList.contains("decrement") && quantity > 1) {
            quantity--;
        } else if (event.target.classList.contains("increment")) {
            if (quantity < stock) {
                quantity++;
            } else {
                alert("Cannot add more. Stock limit reached.");
                return;
            }
        }

        number.textContent = quantity;

        updateTotalPrice();
    });

    updateCartCount(1);

    updateTotalPrice();

}

const updateTotalPrice = () =>{
    const totalprice=document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total =0;
    cartBoxes.forEach(cartBox =>{
        const price = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".number");
        const price_tag = price.textContent.replace("$","");
        const quantity = quantityElement.textContent;
        total += price_tag * quantity;
    });
    totalprice.textContent = `$${total}`;
}

let cartItemCount = 0;
const updateCartCount = change => {
    const CartItemCountShow = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0){
        CartItemCountShow.style.visibility = "visible";
        CartItemCountShow.textContent = cartItemCount;
    }else{
        CartItemCountShow.style.visibility = "hidden";
        CartItemCountShow.textContent="";
    }

}

const buynow = document.querySelector(".btn-buy");
buynow.addEventListener("click", () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0){
        alert("Your cart is empty. Please add items to your cart before purchasing");
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove());

    cartItemCount = 0;

    updateCartCount(0);

    updateTotalPrice(0);

    window.location.href = "/payment";


})



