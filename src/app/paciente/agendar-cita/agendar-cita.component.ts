import { Component, OnInit } from '@angular/core';
import { CitasService, Disponibilidad } from '../../services/citas.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css']
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
  camposCompletos: boolean = false;

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

  verificarCamposCompletos() {
    this.camposCompletos = !!(this.especialidad && this.medicoId && this.fechaSeleccionadaIso && this.hora);
  }

  onCampoChange() {
    this.verificarCamposCompletos();
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
    this.medicosFiltrados = this.todosLosMedicos.filter(m => m.especialidad === esp);
  }

  seleccionarMedico(id: string) {
    this.medicoId = id;
    this.medico = this.medicosFiltrados.find(m => m._id === id);
    this.disponibilidad = [];
    this.horasDisponibles = [];
    
    if (!this.medico) return;
  
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];
  
    this.citasService.obtenerDisponibilidad(id, startDate, endDate).subscribe({
      next: resp => {
        this.disponibilidad = resp.disponibilidad;
        this.resaltarDiasDisponiblesEnCalendario();
      },
      error: err => {
        console.error(err);
        alert('Error cargando disponibilidad');
      }
    });
  }

  confirmarCita() {
    if (!this.especialidad || !this.medicoId || !this.fechaSeleccionadaIso || !this.hora) {
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

  fechaSeleccionada: Date | null = null;
  minDate: Date = new Date(); // Para que no puedan elegir fechas pasadas

  filtrarFechasDisponibles = (fecha: Date | null): boolean => {
    if (!fecha) return false;

    // Filtrar solo las fechas de hoy en adelante
    const fechaHoy = new Date();
    const fechaStr = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
    if (fecha < fechaHoy) return false; // Solo mostrar fechas hoy o en adelante

    const entry = this.disponibilidad.find(d => d.fecha === fechaStr);
    if (entry) {
      const availableSlots = entry.slots.length;
      if (availableSlots > 3) {
        this.setDateColor(fechaStr, 'green');
      } else if (availableSlots >= 1 && availableSlots <= 2) {
        this.setDateColor(fechaStr, 'yellow');
      } else {
        this.setDateColor(fechaStr, 'red');
      }
    }

    return this.disponibilidad.some(d => d.fecha === fechaStr);
  };

  setDateColor(fecha: string, color: string) {
    const dateElements = document.querySelectorAll(`.mat-calendar-body-cell[aria-label='${fecha}']`);
    dateElements.forEach((el) => {
      el.classList.remove('green', 'yellow', 'red'); // Eliminar colores anteriores
      el.classList.add(color); // Aplicar el color correspondiente
    });
  }

  onFechaChange() {
    this.hora = '';
    if (!this.fechaSeleccionada) return;

    const fechaStr = this.fechaSeleccionada.toISOString().split('T')[0];
    this.fechaSeleccionadaIso = fechaStr;
    const entry = this.disponibilidad.find(d => d.fecha === fechaStr);

    // Filtrar horas solo si la fecha seleccionada es hoy
    if (entry) {
      if (new Date(fechaStr).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
        // Solo horas posteriores a la hora actual
        const currentHour = new Date().getHours();
        this.horasDisponibles = entry.slots.filter((hora: string) => {
          const horaInt = parseInt(hora.split(':')[0], 10);
          return horaInt >= currentHour;
        });
      } else {
        this.horasDisponibles = entry.slots; // Para fechas futuras, se muestran todas las horas
      }
    } else {
      this.horasDisponibles = [];
    }
  }

  onDatepickerOpened(picker: any) {
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
  cambiarMes(fechaMes: Date) {
    if (!this.medicoId) return;
    
    const startDate = new Date(fechaMes.getFullYear(), fechaMes.getMonth(), 1);
    const endDate = new Date(fechaMes.getFullYear(), fechaMes.getMonth() + 1, 0);
  
    this.citasService.obtenerDisponibilidad(
      this.medicoId, 
      startDate.toISOString().split('T')[0], 
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: resp => {
        this.disponibilidad = [...this.disponibilidad, ...resp.disponibilidad];
        this.resaltarDiasDisponiblesEnCalendario();
      },
      error: err => console.error(err)
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
}
