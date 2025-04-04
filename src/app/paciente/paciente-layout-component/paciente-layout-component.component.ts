import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-paciente-layout-component',
  templateUrl: './paciente-layout-component.component.html',
  styleUrl: './paciente-layout-component.component.css'
})
export class PacienteLayoutComponentComponent {
  usuarioNombre: string = 'Usuario'; // Debes obtenerlo del servicio de autenticación

  constructor(private authService: AuthService) {}

  // logout() {
  //   this.authService.logout();
  // }
}
