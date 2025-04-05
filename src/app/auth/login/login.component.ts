import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MedicoModule } from '../../medico/medico.module';

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
        console.log('Respuesta del servidor:', res);

        // Guardar los datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
      const medicoId = res.usuario._id;    
      console.log('ID del usuario:',medicoId);
      localStorage.setItem('medicoId', medicoId); 
   
        
  
        const rol = res.usuario.rol;
        if (rol === 'Paciente') {
          this.router.navigate(['/paciente']);
        } else if (rol === 'Consultorio') {
          this.router.navigate(['/consultorio']);
        } else if (rol === 'Medico') {
          localStorage.setItem('medicoId', medicoId);
          this.router.navigate(['/medico']);
        } else {
          alert('Rol no reconocido.');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Correo o contraseña inválidos.');
      }
    });
  }    
}