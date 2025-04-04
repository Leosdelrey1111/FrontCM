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

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    this.obtenerCitasPendientes();
  }

  // Obtener citas pendientes
  obtenerCitasPendientes() {
    this.citasService.obtenerCitasPendientes().subscribe((data) => {
      this.citasPendientes = data.citas;
    });
  }

  // Aceptar cita
  aceptarCita(citaId: string) {
    this.citasService.actualizarEstadoCita(citaId, 'Confirmada').subscribe(() => {
      this.obtenerCitasPendientes();
    });
  }

  // Atender cita
  atenderCita(citaId: string) {
    this.citasService.actualizarEstadoCita(citaId, 'Atendida').subscribe(() => {
      this.obtenerCitasPendientes();
    });
  }
}
