'use strict';

const id = new URLSearchParams(window.location.search).get('id')
const getTeddy = () => {
    return fetch(`http://localhost:3000/api/teddies/${id}`)
    .then((response) =>  response.json())
    .then((product) => product)
    .catch(function(error) {
        alert(error)
    })
}

const displayTeddy = (ted) => {
    const templateElement = document.querySelector('#templateTeddy')
    const cloneElement = document.importNode(templateElement.content, true)
    const colorsList = ted.colors
    
    document.title = `Teddies -  ${ted.name}` // changer le title dynamiquement
    cloneElement.querySelector('.productName').textContent = ted.name
    cloneElement.querySelector('.imageTed').src = ted.imageUrl
    cloneElement.querySelector('.price').textContent = `${ted.price/100},00`
    cloneElement.querySelector('.description').textContent = ted.description

    //afficher les couleurs dans un menu déroulant 
    colorsList.forEach(color => {
        cloneElement.querySelector('.colorsList').innerHTML += `<option value="${color}">${color}</option>}`
    })

    document.querySelector('.main').appendChild(cloneElement)
}

(async  () => {
    const teddy = await getTeddy()
    displayTeddy(teddy);
}) ()

/*********************** Ajout les produits au panier *************************/

const btnAddToCart = document.querySelector('.add-to-cart')
btnAddToCart.addEventListener('click', async () => {
    const teddy = await getTeddy()
    let selectedTeddy = {
        id: teddy._id,
        name: teddy.name,
        price: teddy.price,
        image: teddy.imageUrl,
        quantity: 0
    }
    cartNumbers(selectedTeddy)
    totalCost (selectedTeddy)
    //popupConfirmation(selectedTeddy)
})

//compter et afficher le nombre de produits stockés dans le localStorage
let cartNumbers =  (ted) => {
    let productNumbers = parseInt(localStorage.getItem('cartNumbers'))
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1)
        document.querySelector('.cartIcone').textContent = productNumbers + 1
    } else {
        localStorage.setItem('cartNumbers', 1)
        document.querySelector('.cartIcone').textContent = 1
    }
    setItems(ted)
}
//stocker les produits cliqués dans le storage et actualiser leurs quantités
let setItems= (ted) => {
    let cartItems = JSON.parse(localStorage.getItem('productInCart'));
    if( cartItems != null) {
        if(cartItems[ted.id] == undefined) {
            cartItems = {
                ...cartItems,
                [ted.id] : ted
            }
        }
        cartItems[ted.id].quantity += 1; //on incrémente la quantité à chaque fois qu'on ajoute le produit au panier 
    } else {
        ted.quantity = 1
        cartItems = {
            [ted.id] : ted
        }
    }
    localStorage.setItem('productInCart', JSON.stringify(cartItems))
}

//calculer le prix total et le stocker dans le localStorage
let totalCost = (ted) => {
    let cartCost = localStorage.getItem('totalCost')
   
    if(cartCost != null) {
        cartCost = parseInt(cartCost)
        localStorage.setItem('totalCost', cartCost + ted.price)
    } else {
        localStorage.setItem('totalCost', ted.price)
    }

}
