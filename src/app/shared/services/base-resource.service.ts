import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


import { BaseResourceModel } from "../models/base-resource.model";

export abstract class BaseResourceService<T extends BaseResourceModel> {
  protected http: HttpClient;

  constructor(
    protected url: string,
    protected injector: Injector
  ) {
    this.http = injector.get(HttpClient)
  }

  public getAll(): Observable<T[]> {
    return this.http.get(this.url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources)
    );
  }

  public getById(id: number): Observable<T> {
    const url = `${this.url}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  public create(resource: T): Observable<T> {
    return this.http.post(this.url, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  public update(resource: T): Observable<T> {
    const url = `${this.url}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  public delete(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(element as T));
    return  resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
