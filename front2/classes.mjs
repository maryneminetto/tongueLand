// Creation de la class

export class Chaussure {
  constructor(categorie, pointure, couleur, id){
    this.categorie = categorie;
    this.pointure = pointure; 
    this.couleur = couleur;
    this.id = Math.floor(Math.random() * 100);
  }
}







