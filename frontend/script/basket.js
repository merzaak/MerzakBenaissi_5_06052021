"use strict"

// récuperer les données stockées dans le storage
let cartItems = JSON.parse(localStorage.getItem('productInCart'))
let productNumbers = parseInt(localStorage.getItem('cartNumbers'))
let totalCost = parseInt(localStorage.getItem('totalCost'))
let i = 0


/**********************AFFICHER LA PAGE DU panier***************************************/
let displayCart = () => {
        // si le panier est vide afficher "Votre panier est vide" et cacher le formulaire et le total
    const cartElement = document.querySelector('#cartElement')
    if( cartItems === null) {
        cartElement.innerHTML = `<div class="col-12  alert-success alert-dismissible fade show"><p>Votre panier est vide</p></div>`;
        document.querySelector('.total').hidden = true
        document.querySelector('.form').hidden = true
    } 
    // sinon afficher les articles du panier, la partie total et le formulaire
    else {
        let structurepanier =  [];
        for ( i in cartItems ) {
            let subTotal = cartItems[i].quantity*cartItems[i].price/100;
            structurepanier = structurepanier +` 
                <div class="card productCard mb-3 p-0">
                    <div class="row">
                        <div class="col-4 image">
                        <a href="product.html?id=${cartItems[i].id}" class="stretched-link"><img src="${cartItems[i].image}" alt="${cartItems[i].name}" class="w-100"></a>
                        </div>
                        <div class="col-8 p-0">
                            <div class="card-body">
                                <p class="name font-weight-bold m-0"> ${cartItems[i].name}<span class="card-title productName h5"></span> </p>
                                <p class="hidden" hidden>${cartItems[i].id}</p>
                                <p class="price m-0">Prix unitaire : <span class="font-weight-bold">${cartItems[i].price/100},00</span>€</p>
                                <p class="quantity m-0">Quantité : <i class="bi bi-dash-circle-fill text-primary  btn pl-2"></i> <span class="card-text productQty h5 px-2">${cartItems[i].quantity}</span> <i class="bi bi-plus-circle-fill text-primary btn"></i>  <button class="btn btn-danger btn-sm  btn-delete ml-2"><i class="bi bi-trash-fill"></i></button></p>
                                <div class="qty mt-5 text-right m-0">
                                    <p class="m-0">Sous-Total : <span class="card-text subTotal text-right font-weight-bold h6">${subTotal},00</span> €</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;   
        }
        //afficher le formulaire et la partie total quand le panier n'est pas vide
        document.querySelector('.total').hidden = false;
        document.querySelector('.form').hidden = false;
        document.getElementById('totalProduct').innerText = productNumbers
        document.querySelector('.totalAPayer').innerText = `${totalCost/100},00`
        cartElement.innerHTML = structurepanier
        actualiseQuantity()
        removeItem()
        popupClearCart()
    }     
} 

