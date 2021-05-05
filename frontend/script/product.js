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

