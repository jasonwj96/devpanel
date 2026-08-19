import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardMetrics, PageResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  search(search: string, page: number, size: number): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('search', search ?? '')
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<User>>(`${environment.apiBaseUrl}/users`, { params });
  }

  metrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${environment.apiBaseUrl}/dashboard/metrics`);
  }
}
