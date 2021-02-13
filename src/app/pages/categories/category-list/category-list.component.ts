import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public resultado: number;

  constructor() { }

  ngOnInit(): void {
  }

  alert(value) {
    alert(value);
  }

  soma1() {
    var n1:number;
    var n2: number;

    n1 = 5;
    n2 = 15;

    this.resultado = n1 + n2;
    alert(this.resultado)
  }
}
