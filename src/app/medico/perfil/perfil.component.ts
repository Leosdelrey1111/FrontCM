import { Component, OnInit } from '@angular/core';
import { MedicosService } from '../../services/medicos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  medico: any;

  constructor(
    private medicosService: MedicosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Leer el ID del médico que guardó el LoginComponent
    const medicoId = localStorage.getItem('medicoId');
    if (!medicoId) {
      console.error('No hay médico logueado, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }

    // Llamar al endpoint GET /api/medicos/:id
    this.medicosService.obtenerMedicoPorId(medicoId).subscribe({
      next: perfil => this.medico = perfil,
      error: err => console.error('Error al obtener el perfil', err)
    });
  }
}
