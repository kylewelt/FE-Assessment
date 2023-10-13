import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hospital } from './hospital';


@Injectable({ providedIn: 'root' })
export class HospitalService {

  private hospitalsUrl = 'api/hospitals';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  /** GET hospitals from the server */
  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.hospitalsUrl)
      .pipe(
        tap(_ => console.log('fetched hospitals', _)),
        catchError(this.handleError<Hospital[]>('getHospitals', []))
      );
  }

  /** GET hospital by id. Return `undefined` when id not found */
  getHospitalNo404<Data>(id: number): Observable<Hospital> {
    const url = `${this.hospitalsUrl}/?id=${id}`;
    return this.http.get<Hospital[]>(url)
      .pipe(
        map(hospitals => hospitals[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          console.log(`${outcome} hospital id=${id}`);
        }),
        catchError(this.handleError<Hospital>(`getHospital id=${id}`))
      );
  }

  /** GET hospital by id. Will 404 if id not found */
  getHospital(id: number): Observable<Hospital> {
    const url = `${this.hospitalsUrl}/${id}`;
    return this.http.get<Hospital>(url).pipe(
      tap(_ => console.log(`fetched hospital id=${id}`)),
      catchError(this.handleError<Hospital>(`getHospital id=${id}`))
    );
  }

  /* GET hospitals whose name contains search term */
  searchHospitals(term: string): Observable<Hospital[]> {
    if (!term.trim()) {
      // if not search term, return empty hospital array.
      return of([]);
    }
    return this.http.get<Hospital[]>(`${this.hospitalsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         console.log(`found hospitals matching "${term}"`) :
         console.log(`no hospitals matching "${term}"`)),
      catchError(this.handleError<Hospital[]>('searchHospitals', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hospital to the server */
  addHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.post<Hospital>(this.hospitalsUrl, hospital, this.httpOptions).pipe(
      tap((newHospital: Hospital) => console.log(`added hospital w/ id=${newHospital.id}`)),
      catchError(this.handleError<Hospital>('addHospital'))
    );
  }

  /** DELETE: delete the hospital from the server */
  deleteHospital(id: number): Observable<Hospital> {
    const url = `${this.hospitalsUrl}/${id}`;

    return this.http.delete<Hospital>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted hospital id=${id}`)),
      catchError(this.handleError<Hospital>('deleteHospital'))
    );
  }

  /** PUT: update the hospital on the server */
  updateHospital(hospital: Hospital): Observable<any> {
    return this.http.put(this.hospitalsUrl, hospital, this.httpOptions).pipe(
      tap(_ => console.log(`updated hospital id=${hospital.id}`)),
      catchError(this.handleError<any>('updateHospital'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
