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
  correoInvalido = false;
  contraseniaInvalida = false;

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.correoInvalido = false;
    this.contraseniaInvalida = false;

    if (!this.correo || !this.contrasenia) {
      if (!this.correo) this.correoInvalido = true;
      if (!this.contrasenia) this.contraseniaInvalida = true;
      return;
    }

    this.authService.iniciarSesion({ correo: this.correo, contraseña: this.contrasenia }).subscribe({
      next: (res) => {
        const usuario = res.usuario;
        console.log('Respuesta del servidor:', usuario);

        // Guardar los datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario.rol === 'Medico' || usuario.rol === 'Médico') {
          localStorage.setItem('medicoId', usuario._id);
        }

        switch (usuario.rol) {
          case 'Paciente':
            this.router.navigate(['/paciente']);
            break;
          case 'Consultorio':
            this.router.navigate(['/consultorio']);
            break;
          case 'Medico':
          case 'Médico':
            this.router.navigate(['/medico']);
            break;
          default:
            alert('Rol no reconocido.');
            break;
        }
      },
      error: (err) => {
        console.error(err);
        this.correoInvalido = true;
        this.contraseniaInvalida = true;
      }
    });
  }
}
