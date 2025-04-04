import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  private apiUrl = `${environment.apiUrl}/historico`;

  constructor(private http: HttpClient) {}

  obtenerHistorico(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerHistorialPorPaciente(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/${id}`);
  }
  
}
