import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Disponibilidad {
  horas: string[];
  fecha: string;
  dia: string;
  slots: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private apiUrl = `${environment.apiUrl}/citas`;
  eliminarCita: any;

  constructor(private http: HttpClient) {}

  obtenerCitasPorUsuario(usuarioId: string): Observable<any> {
    console.log('Obteniendo citas para el usuario: ', usuarioId);
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obtenerCitas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crearCita(cita: any): Observable<any> {
    return this.http.post(this.apiUrl, cita);
  }

  editarCita(id: string, datos: any): Observable<{ mensaje: string; cita: any }> {
    return this.http.put<{ mensaje: string; cita: any }>(`${this.apiUrl}/${id}`, datos);
  }

  obtenerDisponibilidad(
    medicoId: string,
    startDate?: string,
    endDate?: string,
    slotDuration?: number
  ): Observable<{ disponibilidad: Disponibilidad[] }> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (slotDuration) params = params.set('slotDuration', slotDuration.toString());
  
    return this.http.get<{ disponibilidad: Disponibilidad[] }>(
      `${this.apiUrl}/disponibilidad/${medicoId}`,
      { params }
    );
  }

  // eliminarCita(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }

  // Reemplazar método eliminarCita por:
cancelarCita(id: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/cancelar/${id}`, {});
}

  getEspecialidades(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/especialidades`);
  }

  getMedicos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/medicos`);
  }

  obtenerCitasPendientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pendientes`);
  }

  actualizarEstadoCita(id: string, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/estado/${id}`, { estado });
  }

  obtenerCitasPorMedico(medicoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/citasmedico/${medicoId}`);
  }

  obtenerCitasPorMedicoAceptada(medicoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/citasmedicoa/${medicoId}`);
  }

  obtenerCitasFiltradas(filtros: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filtros });
  }

  agendarCita(cita: any): Observable<any> {
    return this.crearCita(cita);
  }
}
