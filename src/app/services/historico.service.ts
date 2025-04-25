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

  // Obtener historial completo
  obtenerHistorico(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener historial por paciente
  obtenerHistorialPorPaciente(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/${id}`);
  }
  
  // Obtener historial por usuario
  obtenerHistoricoPorUsuario(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }
}
