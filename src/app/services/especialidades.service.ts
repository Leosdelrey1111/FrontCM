import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  private apiUrl = `${environment.apiUrl}/especialidades`;

  constructor(private http: HttpClient) {}

  obtenerEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
