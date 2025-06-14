import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CommentsType} from '../../../types/comments.type';
import {DefaultResponse} from '../../../types/default-response.type';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AllActionsType} from '../../../types/all-actions.type';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getArticleComments(offset: number, articleId: string):Observable<CommentsType | DefaultResponse>{
    let params = new HttpParams()
      .set('article', articleId)
      .set('offset', offset)
    return this.http.get<CommentsType | DefaultResponse>(environment.api + "comments", {params})
  }

  getActionForComments(id:string):Observable<AllActionsType | DefaultResponse>{
    const param = {articleId: id}
    return this.http.get<AllActionsType | DefaultResponse>(environment.api + 'comments/article-comment-actions', {
      params: param
    })
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
