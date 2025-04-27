import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-layout-component',
  templateUrl: './paciente-layout-component.component.html',
  styleUrls: ['./paciente-layout-component.component.css']
})
export class PacienteLayoutComponentComponent implements OnInit {
  usuarioNombre: string = 'Paciente';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.usuarioNombre = usuario.nombreCompleto || 'Paciente';
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
 