//cette fonction récupère le nombre de produits stockés dans le localStorage quand on raffraichi notre page
let onloadCartNumbers = () => {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cartIcone').textContent = productNumbers
        
    }
}
onloadCartNumbers();