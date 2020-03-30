import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = 'api/user';

  constructor(private httpClient: HttpClient) {}

  get(id: number): Observable<User> {
      return this.httpClient.get<User>(`${this.BASE_URL}/${id}`);
  }
}
