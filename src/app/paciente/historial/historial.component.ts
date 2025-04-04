import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];
  filtrosForm: FormGroup;
  medicos: any[] = [];
  especialidades: any[] = [];

  constructor(
    private citasService: CitasService,
    private fb: FormBuilder
  ) {
    this.filtrosForm = this.fb.group({
      fecha: [''],
      medico: [''],
      especialidad: ['']
    });
  }

  ngOnInit() {
    const pacienteId = '...'; // Obtén este ID de algún servicio de autenticación
  this.obtenerCitas(pacienteId);
  this.obtenerMedicos();
  this.obtenerEspecialidades();
  }

  obtenerCitas(pacienteId: string) {
    this.citasService.getMisCitas(pacienteId).subscribe({
      next: (citas) => {
        this.historial = citas;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerMedicos() {
    this.citasService.getMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerEspecialidades() {
    this.citasService.getEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  filtrarCitas() {
    const filtros = this.filtrosForm.value;
    this.citasService.obtenerCitasFiltradas(filtros).subscribe({
      next: (citas) => {
        this.historial = citas;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  editarCita(citaId: string) {
    console.log('Editar cita con ID:', citaId);
    // Aquí podrías navegar a un formulario o abrir un modal
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
}
