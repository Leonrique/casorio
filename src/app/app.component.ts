import { Testimony } from '../app/models/Testimony';
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
  testimonies: Testimony[];
  suggestions: any[];
  db: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<Item>;
  testimoniesCollection: AngularFirestoreCollection<Testimony>;

  item: Item ={
    idLocal: 0, id: '', who: '', item: ''
  }

  testimony: Testimony ={
    idLocal: 0, id: '', content: '', who: ''
  }

  public edited: boolean = false;

  @ViewChild('main-ul') nameUL: ElementRef;
  
  constructor(db: AngularFirestore){
    
    this.itemsCollection = db.collection('items');
    this.testimoniesCollection = db.collection('testimonies');

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
    });

    db.collection('suggestions').valueChanges()
      .subscribe(suggestions => {
        this.suggestions = suggestions;
    });

    db.collection('testimonies').snapshotChanges()
      .subscribe(testimonies => {
        this.testimonies = testimonies.map(v => {
          const data = v.payload.doc.data() as Testimony;
          data.id = v.payload.doc.id;
          return data;
        });

        this.testimonies = this.testimonies.sort(function(a, b){
          return a.idLocal < b.idLocal ? -1 : a.idLocal > b.idLocal ? 1 : 0;
        })

        console.log(this.testimonies);
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

    for (let i = 0; i < document.querySelectorAll("li.selected").length; i++) {
      const gift = <HTMLInputElement>document.querySelectorAll("li.selected")[i]

      this.item.item = gift.innerText;
      this.item.idLocal = this.items.length+1

      this.itemsCollection.add(this.item);
    };
    
    this.edited = true;

    setTimeout(function() {
        this.edited = false;
    }.bind(this), 10000);

    window.scrollTo(0, document.body.scrollHeight);
    this.removeAllSelections();
  }

  saveTestimony(){
    if(this.testimony.who == undefined || this.testimony.who == ""){
      alert("Informe seu nome.");
      return;
    }

    if(this.testimony.content == undefined || this.testimony.content == ""){
      alert("Escreva sua mensagem.");
      return;
    }

    this.testimony.idLocal = this.testimonies.length+1
    this.testimoniesCollection.add(this.testimony);
    this.testimony.content = '';
    this.testimony.who = '';
  }

  dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
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

  removeAllSelections(){
    const images = document.querySelectorAll("li.selected");

    for (let i = 0; i < images.length; i++) {
      images[i].classList.remove('selected');
    }
  }

  ngOnInit(): void {
    const images = document.querySelectorAll("li");

    for (let i = 0; i < images.length; i++) {
      images[i].addEventListener("click", this.SetBorder);
    }
  }
}
