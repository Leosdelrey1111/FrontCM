import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-cita-aceptada',
  templateUrl: './cita-aceptada.component.html',
  styleUrls: ['./cita-aceptada.component.css']
})
export class CitaAceptadaComponent implements OnInit {
  historialOriginal: any[] = [];
  citasPendientes: any[] = [];

  // Filtros
  filtroPaciente = '';
  pacientesConfirmados: string[] = [];
  filtroMes = '';
  filtroSemana: { start: Date, end: Date } | null = null;

  medicoId = '';

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    this.medicoId = localStorage.getItem('medicoId') || '';
    if (!this.medicoId) {
      console.error('ID de médico no encontrado');
      return;
    }
    this.obtenerCitasPorMedicoAceptada(this.medicoId);
  }

  obtenerCitasPorMedicoAceptada(medicoId: string) {
    this.citasService.obtenerCitasPorMedicoAceptada(medicoId).subscribe({
      next: data => {
        // Solo confirmadas
        this.historialOriginal = data.citas.filter((c: { estado: string; }) => c.estado === 'Confirmada');
        this.citasPendientes = [...this.historialOriginal];

        // Lista única de pacientes confirmados
        this.pacientesConfirmados = Array.from(
          new Set(this.historialOriginal.map(c => c.pacienteNombre))
        );
      },
      error: err => console.error('Error al obtener citas:', err)
    });
  }

  cambiarEstado(_id: string, nuevoEstado: string): void {
    this.citasService.actualizarEstadoCita(_id, nuevoEstado).subscribe({
      next: () => {
        // Remover la cita de la lista al marcarla como atendida
        this.historialOriginal = this.historialOriginal.filter(cita => cita._id !== _id);
        this.citasPendientes = this.citasPendientes.filter(cita => cita._id !== _id);
      },
      error: err => console.error('Error al actualizar estado:', err)
    });
  }
  
  seleccionarSemana() {
    const hoy = new Date();
    const start = new Date(hoy);
    start.setDate(hoy.getDate() - hoy.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    this.filtroSemana = { start, end };
    this.filtroMes = '';
  }

  limpiarFiltros() {
    this.filtroPaciente = '';
    this.filtroMes = '';
    this.filtroSemana = null;
    this.citasPendientes = [...this.historialOriginal];
  }

  get filteredCitas() {
    return this.historialOriginal.filter(cita => {
      const fecha = new Date(cita.fecha);

      // Paciente
      const pacienteMatch = this.filtroPaciente
        ? cita.pacienteNombre === this.filtroPaciente
        : true;

      // Mes
      const mesMatch = this.filtroMes
        ? fecha.getFullYear() === +this.filtroMes.split('-')[0]
          && fecha.getMonth() === +this.filtroMes.split('-')[1] - 1
        : true;

      // Semana
      const semanaMatch = this.filtroSemana
        ? fecha >= this.filtroSemana.start && fecha <= this.filtroSemana.end
        : true;

      return pacienteMatch && mesMatch && semanaMatch;
    });
  }
}
