'use strict';

/*------------- récupérer les données avec fetch-------------*/
const getTeddies = () => {
    return fetch(`${apiUrl}/api/teddies`)
    .then((response) =>  {
       return  response.json() 
    }) 
    .then((products) => products)
    .catch( function (error)  {
        alert(error)
    })
}

// fonction anonyme, auto-invoquée qui affiche tous les produits dans la page d'accueil
    //Le mot clef await permet de mettre en pause l’exécution du code tant qu’une promesse
    // (ici: la réponse de la fonction getTeddies) n’est pas consommée, 
    //puis retourne ensuite le résultat de la promesse
(async  () => {
    const teddies = await getTeddies()
   for(const teddy of teddies){
        displayTeddies(teddy)
    }
}) ()

//cette fonction permet d'afficher les détails d'un produit sur la page d'accueil
const displayTeddies = (ted) => {
    const templateElement = document.querySelector('#templateTeddies') // on cible la template
    const cloneElement = document.importNode(templateElement.content, true) // on duplique la template avec la methode importNode
   //on injecte les données récuppérer de l'API dans la template dupliquée
    cloneElement.querySelector('.card-title').textContent = ted.name
    cloneElement.querySelector('.card-img-top').src = ted.imageUrl
    cloneElement.querySelector('.price').textContent = `${ted.price/100},00 €`
    cloneElement.querySelector('.url').href= `frontend/product.html?id=${ted._id}`
    // on créer la copie dans la div parent (.main)
    document.querySelector('.main').appendChild(cloneElement)
}
