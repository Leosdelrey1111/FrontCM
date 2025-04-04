import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html'
})
export class AgendarCitaComponent implements OnInit {
  // Variables corregidas y mejoradas
  pacienteId: string = '';
  especialidad: string = '';
  medicoId: string = '';
  medico: any = null;
  diaSeleccionado: string = '';
  hora: string = '';
  motivo: string = '';
  estado: string = 'Pendiente';

  especialidades: any[] = [];
  todosLosMedicos: any[] = [];
  medicosFiltrados: any[] = [];
  diasDisponibles: string[] = [];
  horasDisponibles: string[] = [];
  nombreUsuario: string = '';

  constructor(private citasService: CitasService, private router: Router) {}

  ngOnInit() {
    this.cargarDatosIniciales();
    this.obtenerUsuarioActual();
  }

  cargarDatosIniciales() {
    this.citasService.getEspecialidades().subscribe({
      next: (data) => this.especialidades = data,
      error: (err) => console.error('Error cargando especialidades:', err)
    });

    this.citasService.getMedicos().subscribe({
      next: (data) => this.todosLosMedicos = data,
      error: (err) => console.error('Error cargando médicos:', err)
    });
  }

  obtenerUsuarioActual() {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.pacienteId = user?._id || '';
    this.nombreUsuario = user?.nombreCompleto || '';
  }

  seleccionarEspecialidad(especialidad: string) {
    this.resetearCampos();
    this.especialidad = especialidad;
    this.medicosFiltrados = this.todosLosMedicos.filter(m => m.especialidad === especialidad);
  }

  seleccionarMedico(medicoId: string) {
    this.medico = this.medicosFiltrados.find(m => m._id === medicoId);
    if (this.medico) {
      this.diasDisponibles = this.medico.diasLaborales;
      if (this.diasDisponibles.length === 0) {
        alert('El médico no tiene días disponibles');
      }
    }
  }

  seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
    this.generarHorasDisponibles();
  }

  private resetearCampos() {
    this.medicoId = '';
    this.diaSeleccionado = '';
    this.hora = '';
    this.diasDisponibles = [];
    this.horasDisponibles = [];
  }

  private generarHorasDisponibles() {
    if (!this.medico || !this.medico.horario) return;
    
    try {
      const [horaInicio, minutosInicio] = this.medico.horario.inicio.split(':').map(Number);
      const [horaFin, minutosFin] = this.medico.horario.fin.split(':').map(Number);
      
      this.horasDisponibles = [];
      for (let h = horaInicio; h < horaFin; h++) {
        this.horasDisponibles.push(`${h.toString().padStart(2, '0')}:00`);
        if (h < horaFin - 1 || minutosFin >= 30) {
          this.horasDisponibles.push(`${h.toString().padStart(2, '0')}:30`);
        }
      }
    } catch (error) {
      console.error('Error generando horarios:', error);
      this.horasDisponibles = [];
    }
  }

  obtenerFechaCompleta(dia: string): string {
    const diasSemana: { [key: string]: number } = {
      'domingo': 0, 'lunes': 1, 'martes': 2, 
      'miércoles': 3, 'jueves': 4, 'viernes': 5, 
      'sábado': 6
    };

    const hoy = new Date();
    const diaNormalizado = dia.toLowerCase()
                             .normalize("NFD")
                             .replace(/[\u0300-\u036f]/g, "")
                             .replace(/^[áéíóú]/g, '');

    if (!diasSemana.hasOwnProperty(diaNormalizado)) {
      throw new Error('Día no válido');
    }

    const diaDeseado = diasSemana[diaNormalizado];
    const diaHoyUTC = hoy.getUTCDay();

    let diferenciaDias = diaDeseado - diaHoyUTC;
    if (diferenciaDias < 0) diferenciaDias += 7;
    
    if (diferenciaDias === 0 && hoy.getUTCHours() >= 18) {
      diferenciaDias = 7;
    }

    const fechaCita = new Date(hoy);
    fechaCita.setUTCDate(hoy.getUTCDate() + diferenciaDias);
    fechaCita.setUTCHours(0, 0, 0, 0);
    
    return fechaCita.toISOString();
  }

  confirmarCita() {
    try {
      if (!this.validarCampos()) {
        alert('Complete todos los campos requeridos');
        return;
      }

      const citaData = this.construirDatosCita();
      console.log('Cita Data:', citaData);
      this.verificarDisponibilidad(citaData);
    } catch (error) {
      console.error('Error en confirmación:', error);
      alert('Error al procesar la solicitud');
    }
  }

  private validarCampos(): boolean {
    return !!this.especialidad && !!this.medico && !!this.diaSeleccionado && !!this.hora;
  }

  private construirDatosCita() {
    return {
      paciente: this.pacienteId,
      especialidad: this.especialidad,
      medico: this.medico._id,
      fecha: this.obtenerFechaCompleta(this.diaSeleccionado),
      hora: this.hora,
      motivo: this.motivo,
      estado: this.estado
    };
  }

  private verificarDisponibilidad(citaData: any) {
    this.citasService.obtenerCitasFiltradas({
      medico: citaData.medico,
      fecha: citaData.fecha
    }).subscribe({
      next: (citas) => {
        if (citas.length >= this.medico.citasPorDia) {
          alert('No hay disponibilidad para ese día');
          return;
        }
        this.guardarCita(citaData);
      },
      error: (err) => {
        console.error('Error verificando disponibilidad:', err);
        alert('Error al verificar disponibilidad');
      }
    });   
  }

  private guardarCita(citaData: any) {
    this.citasService.agendarCita(citaData).subscribe({
      next: () => {
        alert('Cita agendada con éxito');
        this.router.navigate(['/historial']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error completo:', err);
        const mensaje = err.error?.mensaje || err.message || 'Error desconocido';
        alert(`Error: ${mensaje}`);
      }
    });
  }
}