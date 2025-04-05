import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  iniciarSesion(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // citas.service.ts
  obtenerCitasPorUsuario(usuarioId: string): Observable<any> {
    // Verifica que la URL sea correcta
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`);
  }
  
  obtenerUsuarioId(): string {
    return localStorage.getItem('userId') || '';
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('userId');
  }

  cerrarSesion() {
    localStorage.clear();
  }
}
