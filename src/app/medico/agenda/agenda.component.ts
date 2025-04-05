import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone: false
})
export class AgendaComponent implements OnInit {
  citasPendientes: any[] = [];
  todosLosMedicos: any[] = [];  // Lista de médicos
  medicoId: string = '';  // Definir la variable medicoId

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Obtener el ID del médico desde el localStorage
    this.medicoId = localStorage.getItem('medicoId') || '';  

    // Si se encuentra el ID del médico, obtener sus citas
    if (this.medicoId) {
      this.obtenerCitasPorMedico(this.medicoId);
    } else {
      console.error('ID de médico no encontrado');
    }
  }

  obtenerCitasPorMedico(medicoId: string) {
    this.citasService.obtenerCitasPorMedico(medicoId).subscribe({
      next: (data) => {
        this.citasPendientes = data.citas;
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
      }
    });
  }
}
