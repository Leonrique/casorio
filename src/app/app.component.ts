import { Component, ElementRef, ViewChild  } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {Item } from '../app/models/Item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  items: Item[];
  suggestions: any[];
  db: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<Item>;
  
  item: Item ={
    idLocal: 0, id: '', who: '', item: ''
  }

  public edited: boolean = false;

  @ViewChild('main-ul') nameUL: ElementRef;
  
  constructor(db: AngularFirestore){
    
    this.itemsCollection = db.collection('items');

    db.collection('items').snapshotChanges()
      .subscribe(items => {
        this.items = items.map(v => {
          const data = v.payload.doc.data() as Item;
          data.id = v.payload.doc.id;
          return data;
        });

        this.items = this.items.sort(function(a, b){
          return a.idLocal < b.idLocal ? -1 : a.idLocal > b.idLocal ? 1 : 0;
        })

        //console.log(this.items);
        //window.scrollTo(0, document.body.scrollHeight);
      });

      db.collection('suggestions').valueChanges()
      .subscribe(suggestions => {
        this.suggestions = suggestions;
      });
  }

  saveData(){
    if(this.item.who == undefined || this.item.who == ""){
      alert("Informe seu nome.");
      return;
    }

    if(document.querySelectorAll("li.selected").length == 0){
      alert("Ops, nenhum presente foi selecionado, neste caso não temos como confirmar.");
      return;
    }

    //const gifts = document.querySelectorAll("li.selected");
    
    for (let i = 0; i < document.querySelectorAll("li.selected").length; i++) {
      const gift = <HTMLInputElement>document.querySelectorAll("li.selected")[i]

      this.item.item = gift.innerText;
      this.item.idLocal = this.items.length+1

      this.itemsCollection.add(this.item);
    };
    
    this.edited = true;

    setTimeout(function() {
        this.edited = false;
        //console.log(this.edited);
    }.bind(this), 10000);

    //alert(`Muito obrigado ${ this.item.who }!`)
    window.scrollTo(0, document.body.scrollHeight);
}

  resetList(){
    this.items.forEach(item => {
      this.itemsCollection.doc(item.id)
      .delete()
      .then(x => {console.log("deu certo")})
      .catch(o => {console.log("deu bo")});
    });
  }

  SetBorder(value){
    value.srcElement.classList.toggle('selected')
  }

  ngOnInit(): void {
    const cbox = document.querySelectorAll("li");

    for (let i = 0; i < cbox.length; i++) {
        cbox[i].addEventListener("click", this.SetBorder);
    }
  }
}
