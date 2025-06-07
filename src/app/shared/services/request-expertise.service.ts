import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DefaultResponse} from '../../../types/default-response.type';
import {environment} from '../../../environments/environment';
import {RequestDataType} from '../../../types/request-data.type';

@Injectable({
  providedIn: 'root'
})
export class RequestExpertiseService {

  constructor(private http: HttpClient) { }

  requestExpertise(data: RequestDataType): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(environment.api + "requests", data)

  }

}
