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
  citaEditando: any = null;
  formularioEdicion: FormGroup;
  medicos: any[] = [];
  especialidades: any[] = [];

  constructor(
    private citasService: CitasService,
    private medicosService: MedicosService,
    private especialidadesService: EspecialidadesService,
    private fb: FormBuilder
  ) {
    this.formularioEdicion = this.fb.group({
      medico: [''],
      especialidad: [''],
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

    this.obtenerMedicos();
    this.obtenerEspecialidades();
  }

  obtenerCitas(usuarioId: string) {
    this.citasService.obtenerCitasPorUsuario(usuarioId).subscribe({
      next: (citas) => {
        this.historial = citas;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerMedicos() {
    this.medicosService.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
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

  editarCita(cita: any) {
    this.citaEditando = cita;
    this.formularioEdicion.patchValue({
      medico: cita.medicoInfo?._id || '',
      especialidad: cita.especialidadInfo?._id || '',
      fecha: cita.fecha?.substring(0, 10) || '',
      hora: cita.hora || '',
      motivo: cita.motivo || ''
    });
  }

  guardarEdicion() {
    if (!this.citaEditando) return;

    const datosActualizados = this.formularioEdicion.value;
    this.citasService.editarCita(this.citaEditando._id, datosActualizados).subscribe({
      next: (actualizada) => {
        const index = this.historial.findIndex(c => c._id === this.citaEditando._id);
        if (index !== -1) {
          this.historial[index] = actualizada;
        }
        alert('Cita actualizada correctamente.');
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar la cita.');
      }
    });
  }

  cancelarEdicion() {
    this.citaEditando = null;
    this.formularioEdicion.reset();
  }

  eliminarCita(citaId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.citasService.eliminarCita(citaId).subscribe({
        next: () => {
          this.historial = this.historial.filter(cita => cita._id !== citaId);
          alert('Cita eliminada con éxito.');
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar la cita.');
        }
      });
    }
  }

  idCitaParaEliminar: string | null = null;

abrirConfirmacion(citaId: string) {
  this.idCitaParaEliminar = citaId;
}

cancelarEliminar() {
  this.idCitaParaEliminar = null;
}

confirmarEliminar() {
  if (!this.idCitaParaEliminar) return;

  this.citasService.eliminarCita(this.idCitaParaEliminar).subscribe({
    next: () => {
      this.historial = this.historial.filter(c => c._id !== this.idCitaParaEliminar);
      this.idCitaParaEliminar = null;
    },
    error: (err) => {
      console.error(err);
      this.idCitaParaEliminar = null;
    }
  });
}

}
