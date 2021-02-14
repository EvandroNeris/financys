import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private readonly url: string = 'api/entries';

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Entry[]> {
    return this.http.get(this.url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    );
  }

  public getById(id: number): Observable<Entry> {
    const url = `${this.url}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    );
  }

  public create(entry: Entry): Observable<Entry> {
    return this.http.post(this.url, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    );
  }

  public update(entry: Entry): Observable<Entry> {
    const url = `${this.url}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    );
  }

  public delete(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(element as Entry));
    return  entries;
  }

  private jsonDataToCategorie(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
