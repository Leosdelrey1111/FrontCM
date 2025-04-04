import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html'
})
export class AgendaComponent implements OnInit {
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
  errorMessage: string = '';

  constructor(private citasService: CitasService, private router: Router) {}

  ngOnInit() {
    this.cargarDatosIniciales();
    this.obtenerUsuarioActual();
  }

  cargarDatosIniciales() {
    this.citasService.getEspecialidades().subscribe({
      next: (data) => this.especialidades = data,
      error: (err) => {
        console.error('Error cargando especialidades:', err);
        this.errorMessage = 'Error al cargar especialidades';
      }
    });

    this.citasService.getMedicos().subscribe({
      next: (data) => this.todosLosMedicos = data,
      error: (err) => {
        console.error('Error cargando médicos:', err);
        this.errorMessage = 'Error al cargar médicos';
      }
    });
  }

  obtenerUsuarioActual() {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.pacienteId = user?._id || '';
    this.nombreUsuario = user?.nombreCompleto || '';
    
    if (!this.pacienteId) {
      this.errorMessage = 'Error: No se encontró información del usuario. Por favor inicie sesión nuevamente.';
      // Opcionalmente redireccionar a login
      // this.router.navigate(['/login']);
    }
  }

  seleccionarEspecialidad(especialidad: string) {
    this.resetearCampos();
    this.especialidad = especialidad;
    this.medicosFiltrados = this.todosLosMedicos.filter(m => m.especialidad === especialidad);
  }

  seleccionarMedico(medicoId: string) {
    this.medicoId = medicoId;
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
    this.medico = null;
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
                             .replace(/[\u0300-\u036f]/g, "");

    if (!diasSemana.hasOwnProperty(diaNormalizado)) {
      throw new Error(`Día no válido: ${dia} => ${diaNormalizado}`);
    }

    const diaDeseado = diasSemana[diaNormalizado];
    const diaHoy = hoy.getDay(); // Usar getDay() en lugar de getUTCDay()

    let diferenciaDias = diaDeseado - diaHoy;
    if (diferenciaDias <= 0) diferenciaDias += 7; // Siempre programar para la próxima semana si es hoy o antes
    
    const fechaCita = new Date(hoy);
    fechaCita.setDate(hoy.getDate() + diferenciaDias);
    fechaCita.setHours(0, 0, 0, 0);
    
    return fechaCita.toISOString();
  }

  confirmarCita() {
    this.errorMessage = '';
    
    try {
      if (!this.validarCampos()) {
        alert('Complete todos los campos requeridos');
        return;
      }

      const citaData = this.construirDatosCita();
      console.log('Datos de la cita a enviar:', citaData);
      this.guardarCita(citaData);
    } catch (error: any) {
      console.error('Error en confirmación:', error);
      this.errorMessage = `Error al procesar la solicitud: ${error.message || 'Error desconocido'}`;
      alert(this.errorMessage);
    }
  }

  private validarCampos(): boolean {
    if (!this.pacienteId) {
      this.errorMessage = 'Error: No se encontró información del usuario';
      return false;
    }
    
    return !!this.especialidad && !!this.medicoId && !!this.diaSeleccionado && !!this.hora;
  }

  private construirDatosCita() {
    return {
      paciente: this.pacienteId,
      especialidad: this.especialidad,
      medico: this.medicoId,
      fecha: this.obtenerFechaCompleta(this.diaSeleccionado),
      hora: this.hora,
      motivo: this.motivo || 'Consulta general',
      estado: this.estado
    };
  }

  private guardarCita(citaData: any) {
    this.citasService.agendarCita(citaData).subscribe({
      next: (respuesta) => {
        console.log('Respuesta del servidor:', respuesta);
        alert('Cita agendada con éxito');
        this.router.navigate(['/historial']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al agendar cita:', err);
        const mensaje = err.error?.mensaje || err.message || 'Error desconocido';
        this.errorMessage = `Error: ${mensaje}`;
        alert(this.errorMessage);
      }
    });
  }
}