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
  medicos: any[] = []; // Para almacenar médicos
  especialidades: any[] = []; // Para almacenar especialidades

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
    this.obtenerCitas();
    this.obtenerMedicos();
    this.obtenerEspecialidades();
  }

  // Obtener todas las citas
  obtenerCitas() {
    this.citasService.obtenerCitas().subscribe({
      next: (citas) => {
        this.historial = citas;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Obtener médicos
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

  // Obtener especialidades
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

  // Filtrar citas
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

  // Editar cita
  editarCita(citaId: string) {
    // Lógica para editar cita
    console.log('Editar cita con ID:', citaId);
  }

  // Eliminar cita
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
