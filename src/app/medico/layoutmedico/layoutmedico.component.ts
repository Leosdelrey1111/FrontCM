import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layoutmedico',
  templateUrl: './layoutmedico.component.html',
  styleUrls: ['./layoutmedico.component.css']
})
export class LayoutmedicoComponent {
  usuarioNombre: string = 'Usuario'; // Obtener el nombre del médico desde el servicio de autenticación

  constructor(private authService: AuthService) {}

 
}
