import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly url: string = 'api/categories';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Category[]> {
    return this.http.get(this.url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    );
  }

  public getById(id: number): Observable<Category> {
    const url = `${this.url}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    );
  }

  public create(category: Category): Observable<Category> {
    return this.http.post(this.url, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    );
  }

  public update(category: Category): Observable<Category> {
    const url = `${this.url}/${category.id}`;
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    );
  }

  public delete(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return  categories;
  }

  private jsonDataToCategorie(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
