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
    who: '', item: ''
  }
  @ViewChild('main-ul') nameUL: ElementRef;
  
  constructor(db: AngularFirestore){
    
    this.itemsCollection = db.collection('items');

    db.collection('items').snapshotChanges()
      .subscribe(items => {
        this.items = items.map(v => {
          const data = v.payload.doc.data();
          return data;
        });
        console.log(this.items);
      });

      db.collection('suggestions').valueChanges()
      .subscribe(suggestions => {
        this.suggestions = suggestions;
        console.log(this.suggestions);
      });
  }

  saveData(){
    this.itemsCollection  .add({item: 'novo', who: 'leon2'});
    console.log(this.itemsCollection);
    console.log(this.item);
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
