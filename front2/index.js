//Import modules
import { Chaussure } from "./classes.mjs";

//Initialization
document.getElementById("monForm").innerHTML = `

<form action="#">
<input type="text" id="categorie" placeholder="Catégorie">
<input type="number" id="pointure" min=0 placeholder="Pointure">
<select name="couleur" id="couleur">
    <option value="noir">noir</option>
    <option value="bleu">bleu</option>
    <option value="rouge">rouge</option>
    <option value="vert">vert</option>
</select>
<div class="div-btn">
<input class="btn" type="submit" id="submit" placeholder="Submit">
</div>
</form>
<button class="btn2" id="envoyerModif"> Envoyer modification </button>
<button id="post"> POST </button>
`;
let categorie = document.querySelector("#categorie");
let pointure = document.querySelector("#pointure");
let couleur = document.querySelector("#couleur");
let form = document.querySelector("form");
let envoyerModif = document.querySelector("#envoyerModif");

let mesChaussures = document.getElementById("mesChaussures");

let arrChaussures = [];
let tongue = new Chaussure("Tongues irlandaises", 42, "rouge");
arrChaussures.push(tongue);
let tongue2 = new Chaussure("Tongues niçoises", 36, "bleu");
arrChaussures.push(tongue2);

envoyerModif.setAttribute("disabled", true);

//Functions initialization

// Function create shoes
function createChaussure(categorie, pointure, couleur) {
  let newChaussure = new Chaussure(categorie, pointure, couleur);
  arrChaussures.push(newChaussure);
}

// Display shoes
function afficherChaussures() {
  let affi = "";
  fetch("http://localhost:3000/chaussure")
    .then((res) => res.json())
    .then((chaussures) => {
      console.log("Retour serveur");
      for (let c of chaussures) {
        createChaussure(c.categorie, c.pointure, c.couleur);
        affi += `
      <div class="shoes">
      <p>${c.categorie}</p>
      <p>${c.pointure}</p>
      <p>${c.couleur}</p>
      <div class="div-btn">
      <button class="supp" data-class="${c._id}"> Supprimer </button>
      <button class="edit" data-class="${c._id}"> Editer </button>
      </div>
      </div>`;
      }
      //afficherChaussures(arrChaussures);
      mesChaussures.innerHTML = affi;
      getNodes();
      //afficherChaussures();
    });
}

// Delete shoes
function getNodes() {
  let supp = document.querySelectorAll(".supp");
  let edit = document.querySelectorAll(".edit");

  supp.forEach((btn) => {
    btn.addEventListener("click", () => {
      /*arrChaussures.forEach(chaussure => {
        if(btn.dataset.class == chaussure.id)
        arrChaussures.splice(arrChaussures.indexOf(chaussure),1); 
        console.log(arrChaussures); 
        afficherChaussures(arrChaussures);
      })*/
      function traiterSuccesFetch(res) {
        //1. Vérifie que tout s'est bien passé
        if (res.status === 200) {
          afficherChaussures();
          console.log("afficher chaussure");
        }
      }

      function traiterErreurFetch(err) {
        console.error(err);
      }

      let opts = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch("http://localhost:3000/chaussure/" + btn.dataset.class, opts).then(
        traiterSuccesFetch,
        traiterErreurFetch
      );
    });
  });

  edit.forEach((btn) => {
    btn.addEventListener("click", () => {
      /*arrChaussures.forEach(chaussure => {
        if(btn.dataset.class == chaussure.id){
          categorie.value = chaussure.categorie;
          pointure.value = chaussure.pointure;
          couleur.value = chaussure.couleur; 
          envoyerModif.removeAttribute("disabled");
          envoyerModif.addEventListener('click', () => {
            chaussure.categorie = categorie.value;
            chaussure.pointure = pointure.value;
            chaussure.couleur = couleur.value;
            afficherChaussures(arrChaussures);
            envoyerModif.setAttribute("disabled", true);
        })
        }
      })*/

      fetch("http://localhost:3000/chaussure/" + btn.dataset.class)
        .then((res) => res.json())
        .then((chaussures) => {
          categorie.value = chaussures.categorie;
          pointure.value = chaussures.pointure;
          couleur.value = chaussures.couleur;
        });
      envoyerModif.removeAttribute("disabled");
      envoyerModif.addEventListener("click", () => {
        function traiterSuccesFetch(res) {
          //1. Vérifie que tout s'est bien passé
          if (res.status === 200) {
            afficherChaussures();
            console.log("afficher chaussure");
          }
        }

        function traiterErreurFetch(err) {
          console.error(err);
        }

        let opts = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categorie: categorie.value,
            pointure: pointure.value,
            couleur: couleur.value,
          }),
        };

        fetch(
          "http://localhost:3000/chaussure/" + btn.dataset.class,
          opts
        ).then(traiterSuccesFetch, traiterErreurFetch);
        envoyerModif.setAttribute("disabled", true);
      });
    });
  });
}

afficherChaussures(arrChaussures);

// Event on submit -> Creation array shoes

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!categorie.value || !pointure.value || !couleur.value) {
    console.log("Veuillez entrer une valeur");
  } else {
    createChaussure(categorie.value, pointure.value, couleur.value);
    categorie.value = "";
    pointure.value = "";
    // Display array shoes
    console.log(arrChaussures);
    afficherChaussures(arrChaussures);
  }
});

// Requete POST

let post = document.querySelector("#post");

post.addEventListener("click", () => {
  function traiterSuccesFetch(res) {
    //1. Vérifie que tout s'est bien passé
    if (res.status === 200) {
      //2. récupérer la voiture créée
      res.json().then(function (createChaussure) {
        console.log(createChaussure);
        afficherChaussures();
      });
    }
  }

  function traiterErreurFetch(err) {
    console.error(err);
  }

  let opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      categorie: categorie.value,
      pointure: pointure.value,
      couleur: couleur.value,
    }),
  };

  fetch("http://localhost:3000/chaussure/", opts).then(
    traiterSuccesFetch,
    traiterErreurFetch
  );
});
