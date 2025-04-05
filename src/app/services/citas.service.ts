import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  // Método actualizado para obtener citas por usuario
  // citas.service.ts
  obtenerCitasPorUsuario(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Resto de métodos manteniendo consistencia en los nombres
  obtenerCitas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  crearCita(cita: any): Observable<any> {
    return this.http.post(this.apiUrl, cita);
  }

  editarCita(id: string, datos: any) {
    return this.http.put<any>(`http://localhost:3000/api/citas/${id}`, datos);
  }
  

  eliminarCita(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEspecialidades(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/especialidades`);
  }

  getMedicos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/medicos`);
  }

  // Métodos adicionales si son necesarios
  actualizarEstadoCita(id: string, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/estado/${id}`, { estado });
  }
   // Método corregido
   actualizarCita(id: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }
  agendarCita(cita: any): Observable<any> {
    return this.crearCita(cita);
  }

  obtenerCitasPendientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pendientes`);
  }

  // Ejemplo de implementación en el servicio de CitasService
obtenerCitasFiltradas(filtros: any) {
  return this.http.get<any[]>('/api/citas', { params: filtros });
}

}