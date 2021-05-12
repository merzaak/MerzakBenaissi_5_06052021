'use strict';
/*------------- récupérer les données avec fetch-------------*/

const id = new URLSearchParams(window.location.search).get('id')
const getTeddy = async () => {
    try {
        const response = await fetch(`${apiUrl}/api/teddies/${id}`);
        const product = await response.json();
        return product;
    } catch (error) {
        alert(error);
    }
}

//cette fonction permet d'afficher les détails d'un produit sur la page du navigateur
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

// fonction anonyme, auto-invoquée qui affiche le produit  concerné dans la pages d'accueil
(async  () => {
    const teddy = await getTeddy()
    displayTeddy(teddy);
}) ()

/*********************** Ajout des produits au panier *************************/
// quand on clique sur le button 'ajouter au pannier', on excéute les fonctions 
    //cartNumbers(selectedTeddy)
    //totalCost (selectedTeddy)
// qui permettent de stocker les détails du produits dans le localStorage
const btnAddToCart = document.querySelector('.add-to-cart')
btnAddToCart.addEventListener('click', async () => {
    const teddy = await getTeddy()
    let selectedTeddy = {
        id: teddy._id,
        name: teddy.name,
        price: teddy.price,
        image: teddy.imageUrl,
        quantity: 1
    }
    cartNumbers(selectedTeddy)
    totalCost (selectedTeddy)
    popupConfirmation(selectedTeddy)
})

//stocké le nombre de produits ajoutés dans le localStorage et l'afficher 
let cartNumbers =  (ted) => {
    let productNumbers = parseInt(localStorage.getItem('cartNumbers')) 
    //si des produits exsiste déjà dans le localStorage, alors on incrémente la valeur de la clé "cartNumbers" par 1
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1)
        document.querySelector('.cartIcone').textContent = productNumbers + 1
        //sinon, on crée la clé "cartNumbers" avec la valeur 1
    } else {
        localStorage.setItem('cartNumbers', 1)
        document.querySelector('.cartIcone').textContent = 1
    }
    setItems(ted)
}

//stocker les produits cliqués dans le storage et actualiser leurs quantités
let setItems= (ted) => {
    let cartItems = JSON.parse(localStorage.getItem('productInCart'));
    //si il y a des produits dans le localStorage ==>
    if( cartItems != null) {
        //== et si le produits qu'on a ajouté n'est pas le même que celui stocké dans le localStorage
        //alors on ajoute le produit au localStorage et à l'objet cartItems
        if(cartItems[ted.id] == undefined) {
            cartItems = {
                ...cartItems,
                [ted.id] : ted
            }
        } else {
            //sinon : et on incrémente la quantité du produit existant dans le localStorage
            cartItems[ted.id].quantity += 1; 
        }
    //et si le produit ajouté n'exsiste pas dans le localStorage, alors on l'ajoute 
    } else {
        cartItems = {
            [ted.id] : ted
        }
    }
    localStorage.setItem('productInCart', JSON.stringify(cartItems))
}

//calculer le prix total et le stocker dans le localStorage
let totalCost = (ted) => {
    let cartCost = localStorage.getItem('totalCost')
    //s'il y a des produits dans le localStorage, 
    //alors on additionne le prix du produit ajouté à la valeur
    //de la clé 'totalCost' après l'avoir converti à un nombre
    if(cartCost != null) {
        cartCost = parseInt(cartCost)
        localStorage.setItem('totalCost', cartCost + ted.price)
    } else {
        //sinon on crée la clé "totalCost" avec en valeur le prix du produit ajouté
        localStorage.setItem('totalCost', ted.price)
    }
}

//function de redirection pour aller à la page panier quand on ajoute un produit 
let popupConfirmation = (ted) => {
    if(window.confirm(`${ted.name} a bien été ajouté à votre panier.
    Cliquer sur OK pour aller au panier 
    ou sur ANNULER pour revenir à la page d'accueil`)) {
      window.location.href = "basket.html"
    } else {
      window.location.href = "../index.html"
    }
}