import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];

  constructor(
    private categoryServices: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryServices.getAll().subscribe(categories => {
      this.categories = categories;
    }, error => {
      console.error(error);
      alert('Erro ao carregar a lista');
    });
  }

  deleteCategory(category: Category): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.categoryServices.delete(category.id).subscribe(() => {
        this.categories = this.categories.filter(element => element != category);
      }, error => {
        console.error(error);
        alert('Erro ao tentar excluir');
      });
    }
  }

}
