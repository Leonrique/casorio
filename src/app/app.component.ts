import { Component, ElementRef, ViewChild  } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Item } from '../app/models/Item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  items: any[];
  suggestions: any[];
  db: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<Item>;
  
  item: Item ={
    id: '', who: '', item: ''
  }
  @ViewChild('main-ul') nameUL: ElementRef;
  
  constructor(db: AngularFirestore){
    
    this.itemsCollection = db.collection('items');

    db.collection('items').snapshotChanges()
      .subscribe(items => {
        this.items = items.map(v => {
          const data = v.payload.doc.data() as Item;
          data.id = v.payload.doc.id;
          console.log(data);
          return data;
        });
      });

      db.collection('suggestions').valueChanges()
      .subscribe(suggestions => {
        this.suggestions = suggestions;
        console.log(this.suggestions);
      });
  }

  saveData(){
    if(this.item.who == undefined || this.item.who == ""){
      alert("Informe quem vai presentear.");
      return;
    }

    if(document.querySelectorAll("li.selected").length == 0){
      alert("Nâo foi selecionado nenhum presente, tá certo isso?");
      return;
    }

    //const gifts = document.querySelectorAll("li.selected");
    
    for (let i = 0; i < document.querySelectorAll("li.selected").length; i++) {
      const gift = <HTMLInputElement>document.querySelectorAll("li.selected")[i]

      this.item.item = gift.innerText;
  
      this.itemsCollection.add(this.item);
    };

    //console.log(this.itemsCollection.doc('Sso2eaEvSk8QQTpe31wp').delete().then(x => {console.log("deu certo")}).catch(o => {console.log("deu bo")}));
  }

  SetBorder(value){
    // console.log(value);
    value.srcElement.classList.toggle('selected')
    // document.querySelector("#main-ul").classList.add('selected');
  }

  ngOnInit(): void {
    const cbox = document.querySelectorAll("li");

    for (let i = 0; i < cbox.length; i++) {
        cbox[i].addEventListener("click", this.SetBorder);
    }
  }
}
