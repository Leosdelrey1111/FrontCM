import { Component, OnInit } from '@angular/core';
import { CitasService, Disponibilidad } from '../../services/citas.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html'
})
export class AgendarCitaComponent implements OnInit {
  pacienteId          = '';
  nombreUsuario       = '';

  especialidad        = '';
  medicoId            = '';
  medico: any         = null;

  disponibilidad: Disponibilidad[] = [];
  fechaSeleccionadaIso = '';
  horasDisponibles     : string[] = [];

  hora    = '';
  motivo  = '';
  estado  = 'Pendiente';

  especialidades: any[] = [];
  todosLosMedicos: any[] = [];
  medicosFiltrados: any[] = [];

  constructor(
    private citasService: CitasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatosIniciales();
    this.obtenerUsuarioActual();
  }

  private cargarDatosIniciales() {
    this.citasService.getEspecialidades().subscribe({
      next: data => this.especialidades = data,
      error: err => console.error(err)
    });
    this.citasService.getMedicos().subscribe({
      next: data => this.todosLosMedicos = data,
      error: err => console.error(err)
    });
  }

  private obtenerUsuarioActual() {
    const raw = localStorage.getItem('usuario') || '{}';
    const user = JSON.parse(raw);
    this.pacienteId    = user._id || '';
    this.nombreUsuario = user.nombreCompleto || '';
  }

  seleccionarEspecialidad(esp: string) {
    this.especialidad         = esp;
    this.medicoId             = '';
    this.medico               = null;
    this.disponibilidad       = [];
    this.fechaSeleccionadaIso = '';
    this.horasDisponibles     = [];

    this.medicosFiltrados = this.todosLosMedicos
      .filter(m => m.especialidad === esp);
  }

  seleccionarMedico(id: string) {
    this.medicoId             = id;
    this.medico               = this.medicosFiltrados.find(m => m._id === id);
    this.disponibilidad       = [];
    this.fechaSeleccionadaIso = '';
    this.horasDisponibles     = [];

    if (!this.medico) return;

    this.citasService.obtenerDisponibilidad(id).subscribe({
      next: resp => this.disponibilidad = resp.disponibilidad,
      error: err => {
        console.error(err);
        alert('Error cargando disponibilidad');
      }
    });
  }

  onFechaChange() {
    this.hora = '';
    const entry = this.disponibilidad.find(d => d.fecha === this.fechaSeleccionadaIso);
    this.horasDisponibles = entry?.slots || [];
  }

  confirmarCita() {
    if (!this.especialidad
      || !this.medicoId
      || !this.fechaSeleccionadaIso
      || !this.hora
    ) {
      alert('Complete todos los campos');
      return;
    }

    const citaData = {
      paciente:     this.pacienteId,
      especialidad: this.especialidad,
      medico:       this.medicoId,
      fecha:        this.fechaSeleccionadaIso,
      hora:         this.hora,
      motivo:       this.motivo,
      estado:       this.estado
    };

    this.citasService.crearCita(citaData).subscribe({
      next: () => {
        alert('Cita agendada con éxito');
        this.router.navigate(['/paciente/historial']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        alert(err.error.mensaje || 'Error al agendar cita');
      }
    });
  }
}
