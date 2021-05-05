"use strict"

// récupérer le id stocké dans le localStorage
const responseId = localStorage.getItem('responseId')
document.querySelector('.responseId').textContent = `${responseId}`

// récupération du prix total de la commande 
const totalCost = parseInt(localStorage.getItem('totalCost'))
document.querySelector('.totalCost').textContent = `${totalCost/100}`