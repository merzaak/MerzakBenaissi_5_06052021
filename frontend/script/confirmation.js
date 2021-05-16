"use strict"

// récupérer le id stocké dans le localStorage
const responseId = localStorage.getItem('responseId')
document.querySelector('.responseId').textContent = `${responseId}`

// récupération du prix total de la commande 
const totalCost = parseInt(localStorage.getItem('totalCost'))
document.querySelector('.totalCost').textContent = `${totalCost/100}`

 // vider le localStorage sauf les données du formulaire
const removeItemLocalStorage = (key) => {
    localStorage.removeItem(key)
}
removeItemLocalStorage("productInCart")
removeItemLocalStorage("totalCost")
removeItemLocalStorage("cartNumbers")
removeItemLocalStorage("responseId")