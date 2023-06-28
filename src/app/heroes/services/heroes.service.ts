import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { Hero } from '../interfaces/hero.interface';

@Injectable({providedIn: 'root'})
export class HeroesService {
  private baseUrl: string = environments.baseUrl;
  constructor(private http: HttpClient) { }


  getHeroes():Observable<Hero[]> {

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)

  }


  getHeroById(id:string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
  }
}
