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
  medicoId: string = '';

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
        console.log('Citas recibidas:', data.citas);
        // Ordenamos por fecha ascendente (antiguas primero)
        this.citasPendientes = data.citas
          .slice() // para no mutar el array original
          .sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => {
            const dateA = new Date(a.fecha).getTime();
            const dateB = new Date(b.fecha).getTime();
            return dateA - dateB;
          });
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
      }
    });
  }

  cambiarEstado(_id: string, nuevoEstado: string): void {
    this.citasService.actualizarEstadoCita(_id, nuevoEstado).subscribe(
      (response) => {
        console.log('Estado actualizado:', response);
        const cita = this.citasPendientes.find(c => c._id === _id);
        if (cita) {
          cita.estado = nuevoEstado;
        }
      },
      (error) => {
        console.error('Error al actualizar el estado:', error);
      }
    );
  }
}
