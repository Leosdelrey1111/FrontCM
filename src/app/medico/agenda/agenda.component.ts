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

  // Modales de confirmación/cancelación
  showSuccessModal: boolean = false;
  showCancelModal: boolean = false;
Math: any;

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    this.medicoId = localStorage.getItem('medicoId') || '';
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
        this.citasPendientes = data.citas
          .slice()
          .sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
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
        // Filtra las citas para eliminar la cita actual
        this.citasPendientes = this.citasPendientes.filter(c => c._id !== _id);
  
        // Mostrar el modal correspondiente
        if (nuevoEstado === 'Confirmada') {
          this.showModalConfirmada();
        } else if (nuevoEstado === 'Cancelada') {
          this.showModalCancelada();
        }
      },
      (error) => {
        console.error('Error al actualizar el estado:', error);
      }
    );
  }
  

  showModalConfirmada() {
    this.showSuccessModal = true;
    setTimeout(() => this.closeModals(), 3000);
  }

  showModalCancelada() {
    this.showCancelModal = true;
    setTimeout(() => this.closeModals(), 3000);
  }

  closeModals() {
    this.showSuccessModal = false;
    this.showCancelModal = false;
  }
}
