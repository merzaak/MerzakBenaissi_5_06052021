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

/**************************** actualiser les quantités **********************************/
let actualiseQuantity = () => {
    let btnsPlus = document.querySelectorAll(".bi-plus-circle-fill")
    let btnsMinus = document.querySelectorAll(".bi-dash-circle-fill")
    let currentQuantity
    let currentProduct
    let productNumbers = parseInt(localStorage.getItem('cartNumbers'))
    let cartCost = parseInt(localStorage.getItem('totalCost'))

    for ( let j =0; j < btnsPlus.length; j++) {
        let btnPlus = btnsPlus[j]
        btnPlus.addEventListener('click', () => {
            currentQuantity = btnPlus.parentElement.querySelector('span').textContent.trim()
            currentProduct = btnPlus.parentElement.previousElementSibling.previousElementSibling.textContent.trim()
            localStorage.setItem('cartNumbers', productNumbers + 1)
            localStorage.setItem('totalCost', cartCost + cartItems[currentProduct].price)
            cartItems[currentProduct].quantity = cartItems[currentProduct].quantity  + 1
            localStorage.setItem('productInCart', JSON.stringify(cartItems))
            document.querySelector('.cartIcone').textContent = productNumbers +1
            document.querySelector('.quantity span').textContent = productNumbers 
            document.getElementById('totalProduct').innerText = productNumbers 
            displayCart()  
            onloadCartNumbers();
            location.reload()
            
        })
    }

    for ( let j =0; j < btnsMinus.length; j++) {
        let btnMinus = btnsMinus[j]
        btnMinus.addEventListener('click', () => {
            currentQuantity = btnMinus.parentElement.querySelector('span').textContent.trim()
            currentProduct = btnMinus.parentElement.previousElementSibling.previousElementSibling.textContent.trim()
            
            if( cartItems[currentProduct].quantity > 1){
                cartItems[currentProduct].quantity = cartItems[currentProduct].quantity  - 1
                localStorage.setItem('productInCart', JSON.stringify(cartItems))
                
                localStorage.setItem('cartNumbers', productNumbers - 1)
                document.querySelector('.cartIcone').textContent = productNumbers -1
                document.querySelector('.quantity span').textContent = productNumbers -1
                document.getElementById('totalProduct').innerText = productNumbers -1
                localStorage.setItem('totalCost', cartCost - cartItems[currentProduct].price)
                displayCart()  
                onloadCartNumbers();
                location.reload()
            }
        })
    }
}

/****************************supprimer un article du panier ********************/
let removeItem = () => {
    let btnsDelete = document.querySelectorAll(".btn-delete")
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers')
    let cartCost = localStorage.getItem('totalCost')
    for (let j=0; j < btnsDelete.length; j++){
        let btnDelete = btnsDelete[j] 
        btnDelete.addEventListener('click', async () => {
            productName = btnDelete.parentElement.previousElementSibling.previousElementSibling.textContent.trim()// pour que le bouton 'suprimer' cible l'article qui est son parent 
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].quantity)
            localStorage.setItem('totalCost', cartCost - (cartItems[i].price * cartItems[i].quantity))
            delete cartItems[i]
            localStorage.setItem('productInCart', JSON.stringify(cartItems))
            displayCart()  
            onloadCartNumbers();
            location.reload()
        })
    }
    if(totalCost == 0) {
        localStorage.clear()
        location.reload()
    }
}

/*****************************Vider completement le panier***********************/
let popupClearCart = () => {
    const btnRemove = document.getElementById('clearCart')
    btnRemove.addEventListener('click', () => {
        if(window.confirm(`Vous êtes sûr de vouloir vider votre panier?`)) {
            localStorage.clear()
            window.location.href = "basket.html"
        } else {
            window.location.href = "basket.html"
        }
        
    })
}

//cette fonction  récupère le nombre de produits stockés dans le localStorage quand on raffraichi notre page
let onloadCartNumbers = () => {
    productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cartIcone').textContent = productNumbers
    }
}

onloadCartNumbers();
displayCart()
