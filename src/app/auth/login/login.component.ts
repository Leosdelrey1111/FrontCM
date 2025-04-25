import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  correo = '';
  contrasenia = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.authService.iniciarSesion({ correo: this.correo, contraseña: this.contrasenia }).subscribe({
      next: (res) => {
        const usuario = res.usuario;
        console.log('Respuesta del servidor:', usuario);

        // Guardar los datos del usuario (incluye nombreCompleto) en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Guardar ID del médico si aplica
        if (usuario.rol === 'Medico') {
          localStorage.setItem('medicoId', usuario._id);
        }

        // Navegar según el rol
        switch (usuario.rol) {
          case 'Paciente':
            this.router.navigate(['/paciente']);
            break;
          case 'Consultorio':
            this.router.navigate(['/consultorio']);
            break;
          case 'Medico':
            this.router.navigate(['/medico']);
            break;
          default:
            alert('Rol no reconocido.');
            break;
        }
      },
      error: (err) => {
        console.error(err);
        alert('Correo o contraseña inválidos.');
      }
    });
  }
}
