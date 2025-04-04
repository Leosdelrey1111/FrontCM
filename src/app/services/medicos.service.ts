import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicosService {
  private apiUrl = `${environment.apiUrl}/medicos`;

  constructor(private http: HttpClient) {}

  obtenerMedicos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
