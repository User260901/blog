import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BestArticlesType} from '../../../types/best-articles.type';
import {Observable} from 'rxjs';
import {DefaultResponse} from '../../../types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getBestArticles(): Observable<BestArticlesType[] | DefaultResponse> {
    return this.http.get<BestArticlesType[] | DefaultResponse>(environment.api + "articles/top")
  }

}
