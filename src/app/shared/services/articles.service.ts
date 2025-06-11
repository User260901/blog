import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, Observable} from 'rxjs';
import {DefaultResponse} from '../../../types/default-response.type';
import {ArticlesType} from '../../../types/articles.type';
import {BlogActiveParamsType} from '../../../types/blog-activeParams.type';
import {FilterCategories} from '../../../types/filter-categories.type';
import {ArticleType} from '../../../types/article.type';
import {ArticlePreviewType} from '../../../types/articlePreview.type ';
import {CommentsType} from '../../../types/comments.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getBestArticles(): Observable<ArticlePreviewType[] | DefaultResponse> {
    return this.http.get<ArticlePreviewType[] | DefaultResponse>(environment.api + "articles/top")
  }

  getArticles(params:BlogActiveParamsType): Observable<ArticlesType | DefaultResponse> {
    return this.http.get<ArticlesType | DefaultResponse>(environment.api + "articles", {
      params: params
    })
  }

  getRelatedArticles(url:string): Observable<ArticlePreviewType[]> {
    return this.http.get<ArticlePreviewType[]>(environment.api + "articles/related/" + url)
  }

  getArticle(url:string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + "articles/" + url)
      .pipe(
        map(article => ({
          ...article,
          text: this.sanitizeLinks(article.text)
        }))
      )
  }

  sanitizeLinks(text: string): string {
    const regex = /(\d+\.\s*)([^\n<]+?)\s+(https?:\/\/[^\s<]+)/g;
    return text.replace(regex, (match, number, name, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${number} ${name}</a>`;
    });
  }

  getArticleCategories():Observable<FilterCategories[] | DefaultResponse>{
    return this.http.get<FilterCategories[] | DefaultResponse>(environment.api + "categories")
  }

}
