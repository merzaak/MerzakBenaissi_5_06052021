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
        clearCart()
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
    let productId;
    let productNumbers = localStorage.getItem('cartNumbers')
    let cartCost = localStorage.getItem('totalCost')
    for (let j=0; j < btnsDelete.length; j++){
        let btnDelete = btnsDelete[j] 
        btnDelete.addEventListener('click', async () => {
            productId = btnDelete.parentElement.previousElementSibling.previousElementSibling.textContent.trim()// pour que le bouton 'suprimer' cible l'article qui est son parent 
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productId].quantity)
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
let clearCart = () => {
    const btnRemove = document.getElementById('clearCart')
    btnRemove.addEventListener('click', () => {
        if(window.confirm(`Êtes-vous sûr de vouloir vider votre panier?`)) {
            // on vide tout le localStorage sauf les données du formulaire
            localStorage.removeItem("productInCart")
            localStorage.removeItem("totalCost")
            localStorage.removeItem("cartNumbers")
            localStorage.removeItem("responseId")
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

/*/////////////////////////// FORMULAIRE/////////////////////////////////////////////////*/
//AddEvenListner
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
   let invalidFeedBack = (errorId) =>{
        document.getElementById(`${errorId}`).textContent = `Veuillez bien remplir ce champ SVP` 
    }
    //fonction pour changer les borders quand la value de l'input est valid
    let validFeedBack = (border, errorId) => {
        border.classList.add('border-success')
        document.getElementById(`${errorId}`).textContent = ""
    }
    // on stocke les regEx des champs Nom, Prénom et ville dans une fonction
    let regExText = (value) => {
       return  /^[A-Za-zéèàê\-\/]{3,20}$/.test(value)
    }
    //on stocke les regEx du champ email dans une fonction
    let regExEmail = (value) => {
        return  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
     } 
    //on stocke les regEx du champaddresse postale dans une fonction
    let regExaddress = (value) => {
        return  /^[A-Za-zéèàê0-9\s]{10,50}$/.test(value)
     }

    //fonction pour valider le Nom
    let firstNameCheck = () => {
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
    let lastNameCheck = () => {
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
    let cityCheck = () => {
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
    //fonction pour valider l'email
    let emailCheck = () => {
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
   
     //fonction pour valider l'adresse postale
     let addressCheck = () => {
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
    
    // si toutes les conditions sont respectées, on envoie le formulaires, sinon on prévient l'utilisateur
    let checkForm = () => {
        if (firstNameCheck() && lastNameCheck() && cityCheck() && addressCheck() && emailCheck()) {
            localStorage.setItem('formValues', JSON.stringify(formValues))
            
            //mettre les valeur  du formlaire et les produits du pannier dans un objet pour les envoyer au serveur
            let products = Object.keys(cartItems) // récupérer les ID des produits dans le localStorage dans un array
            const contact = JSON.parse(localStorage.getItem('formValues'))
            const toSendToServer = {
                products,
                contact
            }
            
            let promisePost = fetch(`${apiUrl}/api/teddies/order`, {
                method : "post",
                body: JSON.stringify(toSendToServer),
                headers : {
                    "Content-Type": "application/json"
                },
            })
            promisePost.then(async(response) =>{
                try{
                    const contenu = await response.json()
                    if(response.ok) {
                        //récuperer l'id de la response et le mettre dans le storage
                        localStorage.setItem('responseId', contenu.orderId )
                        // redirection vers la page confirmation
                        window.location.href = "confirmation.html"
                    } else {
                        Alert(`résultat response serveur ${response.status}`);
                    }
                }
                catch(e){
                    alert(`erreur du catch ${e}`)
                }
            })
        } else {
            alert("Votre formulaire n'est pas valide, veuillez bien remplir tous les champs")
            document.querySelector('#invalidForm').textContent = `votre formulaire n'est pas valide`
        }
    }
    checkForm()
    
})

/*-------------------mettre le contenu du localstorage dans le formulaire automatiquement------------------- */

let fillOutTheForm = (value) => {
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