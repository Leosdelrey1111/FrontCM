import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { MedicosService } from '../../services/medicos.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];
  historialOriginal: any[] = [];
  citaEditando: any = null;
  formularioEdicion: FormGroup;
  disponibilidad: any[] = [];
  horasDisponibles: string[] = [];
  fechaSeleccionada: Date | null = null;
  minDate: Date = new Date();
  todosLosMedicos: any[] = [];
  medicosFiltrados: any[] = [];
  especialidades: any[] = [];
  camposCompletos: boolean = false;
  idCitaParaEliminar: string | null = null;

  // Filtros
  filtroEspecialidad = '';        // <-- nuevo filtro
  filtroFecha: string = '';
  filtroMedico: string = '';
  filtroHora: string = '';
  filtroEstado: string = '';
  filtroMes: string = '';
  filtroSemana: { start: Date, end: Date } | null = null;
  estadosPosibles: string[] = ['Pendiente', 'Cancelada', 'Atendida'];
Math: any;

  constructor(
    private citasService: CitasService,
    private medicosService: MedicosService,
    private especialidadesService: EspecialidadesService,
    private fb: FormBuilder
  ) {
    this.formularioEdicion = this.fb.group({
      especialidad: [''],
      medico: [''],
      fecha: [''],
      hora: [''],
      motivo: ['']
    });
  }

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    if (usuario && usuario._id) {
      this.obtenerCitas(usuario._id);
    }

    this.obtenerTodosMedicos();
    this.obtenerEspecialidades();

    this.formularioEdicion.valueChanges.subscribe(() => {
      this.verificarCamposCompletos();
    });
  }

  verificarCamposCompletos() {
    this.camposCompletos = !!(
      this.formularioEdicion.value.especialidad &&
      this.formularioEdicion.value.medico &&
      this.formularioEdicion.value.fecha &&
      this.formularioEdicion.value.hora
    );
  }

  obtenerCitas(usuarioId: string) {
    this.citasService.obtenerCitasPorUsuario(usuarioId).subscribe({
      next: (citas) => {
        this.historialOriginal = [...citas];
        this.historial = citas;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerTodosMedicos() {
    this.medicosService.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.todosLosMedicos = medicos;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerEspecialidades() {
    this.especialidadesService.obtenerEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  seleccionarEspecialidad() {
    const especialidad = this.formularioEdicion.value.especialidad;
    this.medicosFiltrados = this.todosLosMedicos.filter(m => m.especialidad === especialidad);
    this.formularioEdicion.patchValue({ medico: '' });
    this.disponibilidad = [];
    this.horasDisponibles = [];
  }

  seleccionarMedico() {
    const medicoId = this.formularioEdicion.value.medico;
    if (!medicoId) return;

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];

    this.citasService.obtenerDisponibilidad(medicoId, startDate, endDate).subscribe({
      next: (resp: any) => {
        this.disponibilidad = resp.disponibilidad;
        this.resaltarDiasDisponiblesEnCalendario();
      },
      error: (err) => console.error(err)
    });
  }

  filtrarFechasDisponibles = (fecha: Date | null): boolean => {
    if (!fecha) return false;
    const fechaStr = fecha.toISOString().split('T')[0];
    return this.disponibilidad.some((d: any) => d.fecha === fechaStr);
  };

  onFechaChange() {
    const fecha = this.formularioEdicion.value.fecha;
    if (!fecha) return;

    const fechaStr = fecha.toISOString().split('T')[0];
    
    const entry = this.disponibilidad.find((d: any) => {
      const disponibilidadDate = new Date(d.fecha).toISOString().split('T')[0];
      return disponibilidadDate === fechaStr;
    });

    if (entry) {
      const hoy = new Date();
      if (fecha.toDateString() === hoy.toDateString()) {
        const currentHour = hoy.getHours();
        this.horasDisponibles = entry.slots.filter((h: string) => {
          const [horas] = h.split(':');
          return parseInt(horas, 10) >= currentHour;
        });
      } else {
        this.horasDisponibles = entry.slots;
      }
    } else {
      this.horasDisponibles = [];
    }

    this.formularioEdicion.patchValue({ hora: '' });
  }

  editarCita(cita: any) {
    this.citaEditando = cita;
    this.formularioEdicion.patchValue({
      especialidad: cita.especialidad,
      medico: cita.medicoInfo?._id,
      fecha: new Date(cita.fecha),
      hora: cita.hora,
      motivo: cita.motivo
    });

    this.citasService.obtenerDisponibilidad(cita.medicoInfo._id).subscribe({
      next: (resp: any) => {
        this.disponibilidad = resp.disponibilidad;
        this.medicosFiltrados = this.todosLosMedicos.filter(m => 
          m.especialidad === cita.especialidad
        );
      },
      error: (err) => console.error(err)
    });
  }

// En el método guardarEdicion()
guardarEdicion() {
  if (!this.citaEditando || !this.camposCompletos) return;

  const formValue = this.formularioEdicion.value;
  const fechaHora = new Date(formValue.fecha);
  const [hours, minutes] = formValue.hora.split(':');
  fechaHora.setHours(+hours, +minutes);

  const payload = {
    paciente: this.citaEditando.paciente?._id || this.citaEditando.paciente,
    medico: formValue.medico,
    especialidad: formValue.especialidad,
    fecha: fechaHora.toISOString().split('T')[0],
    hora: formValue.hora,
    motivo: formValue.motivo
  };

  this.citasService.editarCita(this.citaEditando._id, payload).subscribe({
    next: (respuesta) => {
      const index = this.historial.findIndex(c => c._id === this.citaEditando._id);
      if (index !== -1) {
        this.historial[index] = respuesta.cita;
      }
      this.showEditSuccess = true;
      setTimeout(() => {
        this.showEditSuccess = false;
        this.cancelarEdicion();
      }, 2500);
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.mensaje || 'Error al actualizar la cita.');
    }
  });
}


  cancelarEdicion() {
    this.citaEditando = null;
    this.formularioEdicion.reset();
    this.disponibilidad = [];
    this.horasDisponibles = [];
    this.medicosFiltrados = [];
  }

  // Filtros
  get filteredHistorial() {
    return this.historialOriginal.filter(cita => {
      const fechaCita = new Date(cita.fecha);

      // Mes
      const mesMatch = this.filtroMes
        ? fechaCita.getFullYear() === +this.filtroMes.split('-')[0]
          && fechaCita.getMonth() === (+this.filtroMes.split('-')[1] - 1)
        : true;

      // Semana
      const semanaMatch = this.filtroSemana
        ? fechaCita >= this.filtroSemana.start && fechaCita <= this.filtroSemana.end
        : true;

      // Especialidad
      const espMatch = this.filtroEspecialidad
        ? cita.especialidad === this.filtroEspecialidad
        : true;

      // Médico
      const medicoMatch = this.filtroMedico
        ? cita.medicoInfo?._id === this.filtroMedico
        : true;

      // Estado
      const estadoMatch = this.filtroEstado
        ? cita.estado === this.filtroEstado
        : true;

      return mesMatch && semanaMatch && espMatch && medicoMatch && estadoMatch;
    });
  }
  limpiarFiltros() {
    this.filtroEspecialidad = '';   // <-- reset
    this.filtroFecha = '';
    this.filtroMedico = '';
    this.filtroHora = '';
    this.filtroEstado = '';
    this.filtroMes = '';
    this.filtroSemana = null;
    this.historial = [...this.historialOriginal];
  }

  seleccionarMes(event: any) {
    this.filtroMes = event.target.value;
    this.filtroSemana = null;
  }

  seleccionarSemana() {
    const hoy = new Date();
    const start = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
    const end = new Date(hoy.setDate(hoy.getDate() + 6));
    this.filtroSemana = { start, end };
    this.filtroMes = '';
  }

  abrirConfirmacion(citaId: string) {
    this.idCitaParaEliminar = citaId;
  }
  

  cancelarEliminar() {
    this.idCitaParaEliminar = null;
  }

// En el método confirmarEliminar()
confirmarEliminar() {
  if (!this.idCitaParaEliminar) return;

  this.citasService.cancelarCita(this.idCitaParaEliminar).subscribe({
    next: () => {
      const cita = this.historial.find(c => c._id === this.idCitaParaEliminar);
      if (cita) cita.estado = 'Cancelada';
      this.showCancelSuccess = true;
      setTimeout(() => {
        this.showCancelSuccess = false;
        this.idCitaParaEliminar = null;
      }, 2500);
    },
    error: (err) => {
      console.error(err);
      this.idCitaParaEliminar = null;
    }
  });
}

  // Añade estos métodos
  onDatepickerOpened() {
    this.resaltarDiasDisponiblesEnCalendario();
  }

  private resaltarDiasDisponiblesEnCalendario() {
    setTimeout(() => {
      if (!this.disponibilidad) return;
  
      this.disponibilidad.forEach(d => {
        const availableSlots = d.slots.length;
        if (availableSlots > 3) {
          this.setDateColor(d.fecha, 'green');
        } else if (availableSlots >= 1 && availableSlots <= 3) {
          this.setDateColor(d.fecha, 'yellow');
        } else {
          this.setDateColor(d.fecha, 'red');
        }
      });
    }, 10);
  }

  private setDateColor(fecha: string, color: string) {
    const dateElements = document.querySelectorAll(`.mat-calendar-body-cell[aria-label='${fecha}']`);
    dateElements.forEach((el) => {
      el.classList.remove('green', 'yellow', 'red');
      el.classList.add(color);
    });
  }

resaltarDiasDisponibles = (fecha: Date): string => {
  const fechaStr = fecha.toISOString().split('T')[0];
  const entry = this.disponibilidad.find(d => d.fecha === fechaStr);

  if (entry) {
    const slots = entry.slots.length;
    if (slots > 3) return 'dia-verde';
    if (slots >= 1 && slots <= 2) return 'dia-amarillo';
    return 'dia-rojo';
  }
  return '';
};

cambiarMes(fechaMes: Date) {
  if (!this.formularioEdicion.value.medico) return;
  
  const startDate = new Date(fechaMes.getFullYear(), fechaMes.getMonth(), 1)
                    .toISOString().split('T')[0];
  const endDate = new Date(fechaMes.getFullYear(), fechaMes.getMonth() + 1, 0)
                  .toISOString().split('T')[0];

  this.citasService.obtenerDisponibilidad(
    this.formularioEdicion.value.medico, 
    startDate, 
    endDate
  ).subscribe({
    next: (resp: any) => {
      this.disponibilidad = [...this.disponibilidad, ...resp.disponibilidad];
      this.resaltarDiasDisponiblesEnCalendario();
    },
    error: (err) => console.error(err)
  });
}

//confirmacion

// Añade estas propiedades en el componente
showEditSuccess: boolean = false;
showCancelSuccess: boolean = false;

}
