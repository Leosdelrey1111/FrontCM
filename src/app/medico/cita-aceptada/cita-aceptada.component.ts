import { Component,OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-cita-aceptada',
  templateUrl: './cita-aceptada.component.html',
  styleUrl: './cita-aceptada.component.css'
})
export class CitaAceptadaComponent  implements OnInit {
  citasPendientes: any[] = [];
  todosLosMedicos: any[] = [];  // Lista de médicos
  medicoId: string = '';  // Definir la variable medicoId

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Obtener el ID del médico desde el localStorage
    this.medicoId = localStorage.getItem('medicoId') || '';  

    // Si se encuentra el ID del médico, obtener sus citas
    if (this.medicoId) {
      this.obtenerCitasPorMedicoAceptada(this.medicoId);
    } else {
      console.error('ID de médico no encontrado');
    }
  }


  obtenerCitasPorMedicoAceptada(medicoId: string) {
    this.citasService.obtenerCitasPorMedicoAceptada(medicoId).subscribe({
      next: (data) => {
        console.log('Citas recibidas:', data.citas);
        this.citasPendientes = data.citas;
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
        const cita = this.citasPendientes.find((cita) => cita._id === _id);
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
