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
        // Guardar los datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
  
        const rol = res.usuario.rol;
        if (rol === 'Paciente') {
          this.router.navigate(['/paciente']);
        } else if (rol === 'Consultorio') {
          this.router.navigate(['/consultorio']);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Correo o contraseña inválidos.');
      }
    });
  }
}
