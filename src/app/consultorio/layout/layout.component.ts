import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  usuarioNombre: string = 'Consultorio'; // Puedes obtenerlo desde el servicio de autenticación o el perfil de usuario

  constructor(private authService: AuthService) {}

  // logout() {
  //   this.authService.logout();
  // }
}
