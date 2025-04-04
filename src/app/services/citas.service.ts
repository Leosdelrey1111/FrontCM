import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener especialidades disponibles
  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/especialidades`);
  }

  // Obtener todos los médicos
  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/medicos`);
  }

  // Agendar una nueva cita
  agendarCita(citaData: any): Observable<any> {
    console.log('Enviando datos al servidor:', citaData);
    return this.http.post<any>(`${this.apiUrl}/api/citas`, citaData);
  }

  // Obtener citas del paciente actual
  getMisCitas(pacienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/citas/paciente/${pacienteId}`);
  }

  // Obtener citas filtradas
  obtenerCitasFiltradas(filtros: any): Observable<any[]> {
    // Usamos GET con query params para mejor compatibilidad con la API
    const params = new URLSearchParams();
    
    // Añadir parámetros al querystring
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) {
        params.append(key, filtros[key]);
      }
    });
    
    return this.http.get<any[]>(`${this.apiUrl}/api/citas/filtrar?${params.toString()}`);
  }

  // Actualizar estado de una cita
  actualizarEstadoCita(citaId: string, estado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/citas/${citaId}/estado/${estado}`, {});
  }

  // Editar una cita
  editarCita(citaId: string, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/citas/${citaId}`, datos);
  }

  // Eliminar una cita
  eliminarCita(citaId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/citas/${citaId}`);
  }
}