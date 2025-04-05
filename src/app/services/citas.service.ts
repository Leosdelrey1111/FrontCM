import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private apiUrl = `${environment.apiUrl}/citas`;  // Corrección: interpolación con backticks

  constructor(private http: HttpClient) {}

  obtenerCitas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerCitasFiltradas(filtro: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/filtrar`, filtro);  // Corrección: interpolación con backticks
  }

  crearCita(cita: any): Observable<any> {
    return this.http.post(this.apiUrl, cita);
  }

  agendarCita(cita: any): Observable<any> {
    return this.crearCita(cita);
  }

  editarCita(id: string, cita: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cita);  // Corrección: interpolación con backticks
  }

  eliminarCita(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);  // Corrección: interpolación con backticks
  }

  getEspecialidades(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/especialidades`);  // Corrección: interpolación con backticks
  }

  getMedicos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/medicos`);  // Corrección: interpolación con backticks
  }
  
  obtenerCitasPendientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pendientes`);
  }

  actualizarEstadoCita(id: string, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/estado/${id}`, { estado });
  }

  obtenerCitasPorMedico(medicoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/citasmedico/${medicoId}`);
  } 
  obtenerCitasPorMedicoAceptada(medicoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/citasmedicoa/${medicoId}`);
  }   



}
