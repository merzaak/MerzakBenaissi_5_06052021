'use strict';

const getTeddies = () => {
    return fetch(`${apiUrl}/api/teddies`)
    .then((response) =>  response.json())
    .then((products) => products)
    .catch(function(error) {
        alert(error)
    })
}

(async  () => {
    const teddies = await getTeddies()
    for(const teddy of teddies){
        displayTeddies(teddy)
    }
}) ()

const displayTeddies = (ted) => {
    const templateElement = document.querySelector('#templateTeddies')
    const cloneElement = document.importNode(templateElement.content, true)
   
    cloneElement.querySelector('.card-title').textContent = ted.name
    cloneElement.querySelector('.card-img-top').src = ted.imageUrl
    cloneElement.querySelector('.price').textContent = `${ted.price/100},00 €`
    cloneElement.querySelector('.url').href= `frontend/product.html?id=${ted._id}`

    document.querySelector('.main').appendChild(cloneElement)
}

//cette fonction récupère le nombre de produits stockés dans le localStorage quand on raffraichi notre page
let onloadCartNumbers = () => {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cartIcone').textContent = productNumbers
        
    }
}
onloadCartNumbers();
