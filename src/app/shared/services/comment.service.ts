import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CommentsType} from '../../../types/comments.type';
import {DefaultResponse} from '../../../types/default-response.type';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getArticleComments(param : {offset: number, article:string}):Observable<CommentsType | DefaultResponse>{
    const params = new HttpParams()
      .set('offset', param.offset)
      .set('article', param.article)
    return this.http.get<CommentsType | DefaultResponse>(environment.api + "comments", {params})
  }

  addComment(text:string, articleId :string): Observable<DefaultResponse>{
    return this.http.post<DefaultResponse>(environment.api + "comments", {
      text: text,
      article: articleId,
    })
  }

  doAction(id:string, value:string): Observable<DefaultResponse>{
    return this.http.post<DefaultResponse>(environment.api + "comments/" + id + '/apply-action', {
      action: value,
    })
  }
}
