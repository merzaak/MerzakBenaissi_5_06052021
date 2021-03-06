"use strict"

// récuperer les données stockées dans le storage
let cartItems = JSON.parse(localStorage.getItem('productInCart'))
let productNumbers = parseInt(localStorage.getItem('cartNumbers'))
let totalCost = parseInt(localStorage.getItem('totalCost'))



/**********************AFFICHER LA PAGE DU panier***************************************/
const displayCart = () => {
    // si le panier est vide afficher "Votre panier est vide" et cacher le formulaire et le total
    const cartElement = document.querySelector('#cartElement')
    if( cartItems === null) {
        cartElement.innerHTML = `<div class="col-12  alert-success alert-dismissible fade show"><p>Votre panier est vide</p></div>`;
        document.querySelector('.total').hidden = true
        document.querySelector('.form').hidden = true
    } 
    // sinon afficher les articles du panier, la partie total et le formulaire
    else {
        let displayCartItems =  []
        for ( let teddy in cartItems ) {
            let subTotal = cartItems[teddy].quantity*cartItems[teddy].price
            displayCartItems += ` 
                <div class="card productCard mb-3 p-0">
                    <div class="row">
                        <div class="col-4 image">
                        <a href="product.html?id=${cartItems[teddy].id}" class="stretched-link"><img src="${cartItems[teddy].image}" alt="${cartItems[teddy].name}" class="w-100"></a>
                        </div>
                        <div class="col-8 p-0">
                            <div class="card-body">
                                <p class="name font-weight-bold m-0"> ${cartItems[teddy].name}<span class="card-title productName h5"></span> </p>
                                <p class="hidden" hidden>${cartItems[teddy].id}</p>
                                <p class="price m-0">Prix unitaire : <span class="font-weight-bold">${cartItems[teddy].price/100},00</span>€</p>
                                <p class="quantity m-0">Quantité : <i class="bi bi-dash-circle-fill text-primary  btn pl-2"></i> <span class="card-text productQty h5 px-2">${cartItems[teddy].quantity}</span> <i class="bi bi-plus-circle-fill text-primary btn"></i>  <button class="btn btn-danger btn-sm  btn-delete ml-2"><i class="bi bi-trash-fill"></i></button></p>
                                <div class="qty mt-5 text-right m-0">
                                    <p class="m-0">Sous-Total : <span class="card-text subTotal text-right font-weight-bold h6">${subTotal/100},00</span> €</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ` 
        }
        cartElement.innerHTML = displayCartItems
        //afficher le formulaire et la partie total quand le panier n'est pas vide
        document.querySelector('.total').hidden = false;
        document.querySelector('.form').hidden = false;
        document.getElementById('totalProduct').innerText = productNumbers
        document.querySelector('.totalAPayer').innerText = `${totalCost/100},00`
        updateQuantity()
        removeItem()
        clearCart()
    }     
} 

/**************************** actualiser les quantités des produits déjà dans le panier **********************************/
const updateQuantity = () => {
    //cibler les boutons  plus et moins
    let btnsPlus = document.querySelectorAll(".bi-plus-circle-fill")
    let btnsMinus = document.querySelectorAll(".bi-dash-circle-fill")
    let currentQuantity
    let currentProductId
    let productNumbers = parseInt(localStorage.getItem('cartNumbers'))
    let cartCost = parseInt(localStorage.getItem('totalCost'))

    //pour augmenter la quantité
    for (let j =0; j < btnsPlus.length; j++) {
        let btnPlus = btnsPlus[j]
        btnPlus.addEventListener('click', () => {
            // on récupére la quantité qui corresponde à l'élement parent du bouton "plus"
            currentQuantity = btnPlus.parentElement.querySelector('span').textContent.trim()
            // on récupère le ID du produit qui correspond au bouton "plus"
            currentProductId = btnPlus.parentElement.previousElementSibling.previousElementSibling.textContent.trim()
            // on actualise le nombre de produits et le total dans le localStorage
            localStorage.setItem('cartNumbers', productNumbers + 1)
            localStorage.setItem('totalCost', cartCost + cartItems[currentProductId].price)
            //on actualise la quantité du produit concerné dans le localStorage
            cartItems[currentProductId].quantity = cartItems[currentProductId].quantity  + 1
            localStorage.setItem('productInCart', JSON.stringify(cartItems))
            //on actualise les informations dans le DOM
            document.querySelector('.cartIcone').textContent = productNumbers + 1
            document.querySelector('.quantity span').textContent = productNumbers + 1
            document.getElementById('totalProduct').textContent = productNumbers + 1
            displayCart()  
            onloadCartNumbers()
            location.reload() 
        })
    }

    //pour diminuer la quantité, on fait la même chose 
    for ( let j =0; j < btnsMinus.length; j++) {
        let btnMinus = btnsMinus[j]
        btnMinus.addEventListener('click', () => {
            currentQuantity = btnMinus.parentElement.querySelector('span').textContent.trim()
            currentProductId = btnMinus.parentElement.previousElementSibling.previousElementSibling.textContent.trim()
            //si la quantité du produit et de 1 alors on pourra pas diminuer la quantité
            if( cartItems[currentProductId].quantity > 1){
                cartItems[currentProductId].quantity = cartItems[currentProductId].quantity  - 1
                localStorage.setItem('productInCart', JSON.stringify(cartItems))
                localStorage.setItem('cartNumbers', productNumbers - 1)
                localStorage.setItem('totalCost', cartCost - cartItems[currentProductId].price)
                document.querySelector('.cartIcone').textContent = productNumbers -1
                document.querySelector('.quantity span').textContent = productNumbers -1
                document.getElementById('totalProduct').innerText = productNumbers -1
                displayCart()  
                onloadCartNumbers()
                location.reload()
            }
        })
    }
}

/****************************supprimer un article du panier ********************/
const removeItem = () => {
    let btnsDelete = document.querySelectorAll(".btn-delete")
    let currentProductId
    let productNumbers = localStorage.getItem('cartNumbers')
    let cartCost = localStorage.getItem('totalCost')
    for (let j=0; j < btnsDelete.length; j++){
        let btnDelete = btnsDelete[j] 
        btnDelete.addEventListener('click', async () => {
            // pour que le bouton 'suprimer' cible l'ID de l'article qui est son parent 
            currentProductId = btnDelete.parentElement.previousElementSibling.previousElementSibling.textContent.trim()
            //on actualise le nombre de produit et le total dans le localStorage
            localStorage.setItem('cartNumbers', productNumbers - cartItems[currentProductId].quantity)
            localStorage.setItem('totalCost', cartCost - (cartItems[currentProductId].price * cartItems[currentProductId].quantity))
            //on supprime le produit concerné du loclaStorage
            delete cartItems[currentProductId]
            localStorage.setItem('productInCart', JSON.stringify(cartItems))
            displayCart()  
            onloadCartNumbers()
            location.reload()
        })
    }
    //si le produit qu'on vient de suppriemr et le dernier dans le panier, alors on vide complétement le localStorage
    if(totalCost == 0) {
        localStorage.removeItem("productInCart")
        localStorage.removeItem("totalCost")
        localStorage.removeItem("cartNumbers")
        location.reload()
    }
}

/*****************************Vider completement le panier***********************/
const clearCart = () => {
    const btnRemove = document.getElementById('clearCart')
    btnRemove.addEventListener('click', () => {
        if(window.confirm(`Êtes-vous sûr de vouloir vider votre panier?`)) {
            // on vide tout le localStorage sauf les données du formulaire
            localStorage.removeItem("productInCart")
            localStorage.removeItem("totalCost")
            localStorage.removeItem("cartNumbers")
            window.location.href = "basket.html"
        } else {
            window.location.href = "basket.html"
        }
    })
}

displayCart()

/*/////////////////////////// FORMULAIRE/////////////////////////////////////////////////*/
const btnSubmitForm = document.querySelector('#btnSubmit') //selection du buton submit du formulaire
btnSubmitForm.addEventListener('click', () => {
    //récupération des valeurs du formulaire dans un objet pour les mettre dans le localStorage
    const formValues = {
        firstName : document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value
    }
    //****************** gestion et validation du formulaire******************************
    //fonction pour apparaitre un message en cas d'une value invalid
   const invalidFeedBack = (errorId) =>{
        document.getElementById(`${errorId}`).textContent = `Veuillez bien remplir ce champ SVP` 
    }
    //fonction pour changer les borders quand la value de l'input est valid
    const validFeedBack = (border, errorId) => {
        border.classList.add('border-success')
        document.getElementById(`${errorId}`).textContent = ""
    }
    // on stocke les regEx des champs Nom, Prénom et ville dans une fonction
    const regExText = (value) => {
       return  /^[A-Za-zéèàê\-\/]{3,20}$/.test(value)
    }
    //on stocke les regEx du champ email dans une fonction
    const regExEmail = (value) => {
        return  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
     } 
    //on stocke les regEx du champaddresse postale dans une fonction
    const regExaddress = (value) => {
        return  /^[A-Za-zéèàê0-9\s]{10,50}$/.test(value)
     }

    //fonction pour valider le Nom
    const firstNameCheck = () => {
        const firstName = formValues.firstName
        const firstNameValid = document.querySelector('#firstName')
        if(regExText(firstName)) {
            validFeedBack(firstNameValid, 'invalidFirstName')
            return true
        } else {
            invalidFeedBack('invalidFirstName')
            return false
        }
    }
   firstNameCheck()
     //fonction pour valider le Prénom
    const lastNameCheck = () => {
        const lastName = formValues.lastName
        const lastNameValid = document.querySelector('#lastName')
        if(regExText(lastName)) {
            validFeedBack(lastNameValid, 'invalidLastName')
            return true
        } else {
            invalidFeedBack('invalidLastName')
            return false
        }
    }
   lastNameCheck()
     //fonction pour valider la ville
    const cityCheck = () => {
        const city = formValues.city
        const cityValid = document.querySelector('#city')
        if(regExText(city)) {
            validFeedBack(cityValid, 'invalidCity')
            return true
        } else {
            invalidFeedBack("invalidCity")
            return false
        }
    }
   cityCheck()
    //fonction pour valider l'adresse postale
    const addressCheck = () => {
        const address = formValues.address
        const addressValid = document.querySelector('#address')
        if(regExaddress(address)) {
            validFeedBack(addressValid, 'invalidAddress')
            return true
        } else {
            invalidFeedBack('invalidAddress')
            return false
        }
    }
    addressCheck()
    //fonction pour valider l'email
    const emailCheck = () => {
        const email = formValues.email
        const emailValid = document.querySelector('#email')
        if(regExEmail(email)) {
            validFeedBack(emailValid, "invalidEmail")
            return true
        } else {
            invalidFeedBack("invalidEmail")
            return false
        }
    }
    emailCheck()
   
    const checkForm = () => {
        // si toutes les conditions sont respectées, on envoie le formulaires, sinon on prévient l'utilisateur
        if (firstNameCheck() && lastNameCheck() && cityCheck() && addressCheck() && emailCheck()) {
            //on stocke les valeurs du formualire dans le localStorage
            localStorage.setItem('formValues', JSON.stringify(formValues))
             // récupérer les ID des produits dans le localStorage dans un array
            let products = Object.keys(cartItems)
             //on récupère les valeurs du formulaire stockées dans le localStorage
            const contact = JSON.parse(localStorage.getItem('formValues'))
             //mettre les valeurs  du formlaire et les produits du pannier dans un objet pour les envoyer au serveur
            const objectToSend = {
                products,
                contact
            }
            // on envoie l'objet "objectToSend" au serveur avec la fonction sendToServer()
            sendToServer(objectToSend)
        } else {
            alert("Votre formulaire n'est pas valide, veuillez bien remplir tous les champs")
            document.querySelector('#invalidForm').textContent = `votre formulaire n'est pas valide`
        }
    }
    checkForm()
})

/* fonction pour envoyer les données au serveur */
const sendToServer = (toSend) => {
    let promisePost = fetch(`${apiUrl}/api/teddies/order`, {
        method : "post",
        body: JSON.stringify(toSend),
        headers : {
            "Content-Type": "application/json"
        }
    })
    promisePost.then(async (response) => {
        try{
            const content = await response.json()
            //récuperer l'id de la response et le mettre dans le storage
            localStorage.setItem('responseId', content.orderId)
            // redirection vers la page confirmation
            window.location.href = "confirmation.html"
           
        } catch(err) {
           alert(`une erreur est survenue : ${err}`)
        }
    })
}

/*-------------------mettre le contenu du localstorage dans le formulaire automatiquement------------------- */

const fillOutTheForm = (value) => {
    let contact = JSON.parse(localStorage.getItem('formValues'))
    if (contact !== null) {
        document.querySelector(`#${value}`).value = contact[value]
    }
}
    fillOutTheForm('firstName')
    fillOutTheForm('lastName')
    fillOutTheForm('address')
    fillOutTheForm('city')
    fillOutTheForm('email')