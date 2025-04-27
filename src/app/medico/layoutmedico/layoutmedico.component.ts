import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layoutmedico',
  templateUrl: './layoutmedico.component.html',
  styleUrls: ['./layoutmedico.component.css']
})
export class LayoutmedicoComponent {
  usuarioNombre: string = '';

  constructor(private authService: AuthService, private router: Router) {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      this.usuarioNombre = usuarioData.nombreCompleto || 'Doctor';
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
