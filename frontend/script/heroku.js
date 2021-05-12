//ternaire pour choisir l'api à utiliser
let apiUrl = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "http://localhost:3000" // local
: "https://merzak-p5-oc.herokuapp.com" //installer sur heroku