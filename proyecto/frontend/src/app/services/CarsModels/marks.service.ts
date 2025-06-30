import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CarBrand {
  id: string;
  name: string;
  image: string;
}

export interface CarModel {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarApiService {
  private apiUrl = 'https://cars-database-with-image.p.rapidapi.com/api/';
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': 'dfd32ba797mshcbd9f70ef0a1c7ep1afea3jsneddff898ffca', // ← pon aquí tu clave e5ccf7ff30mshe73085b2a582d3ep138d50jsneed29b51d699
    'X-RapidAPI-Host': 'cars-database-with-image.p.rapidapi.com'
  });

  constructor(private http: HttpClient) {}

  getCarBrands(): Observable<CarBrand[]> {
    return this.http.get<{ brands: CarBrand[] }>(this.apiUrl + 'brands', { headers: this.headers })
      .pipe(map(response => response.brands));
  }
  getCarModels(brandId: string): Observable<CarModel[]> {
    return this.http.get<{ models: CarModel[] }>(`${this.apiUrl}models/${brandId}`, { headers: this.headers })
      .pipe(map(response => response.models));
  }
}
