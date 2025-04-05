import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { MedicosService } from '../../services/medicos.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  citas: any[] = [];
  especialidades: any[] = [];
  medicos: any[] = [];
  filtros = {
    especialidad: '',
    medico: '',
    fecha: '',
    estado: ''
  };
  totalCitas: number = 0;
  paginaActual: number = 1;
  citasPorPagina: number = 10;

  // Array de especialidades predefinidas
  especialidadesPredefinidas = [
    { _id: '67efd113e43170c990002001', especialidad: 'Cardiología', descripcion: 'Trastornos del corazón y el sistema circulatorio.' },
    { _id: '67efd113e43170c990002002', especialidad: 'Dermatología', descripcion: 'Tratamiento de enfermedades de la piel.' },
    { _id: '67efd113e43170c990002003', especialidad: 'Pediatría', descripcion: 'Atención médica de niños y adolescentes.' },
    { _id: '67efd113e43170c990002004', especialidad: 'Ginecología', descripcion: 'Salud reproductiva femenina.' },
    { _id: '67efd113e43170c990002005', especialidad: 'Oftalmología', descripcion: 'Cuidado de los ojos y la visión.' },
    { _id: '67efd113e43170c990002006', especialidad: 'Neurología', descripcion: 'Trastornos del sistema nervioso.' },
    { _id: '67efd113e43170c990002007', especialidad: 'Urología', descripcion: 'Trastornos del sistema urinario y reproductor masculino.' }
  ];

  constructor(
    private citasService: CitasService,
    private especialidadesService: EspecialidadesService,
    private medicosService: MedicosService
  ) {}

  ngOnInit() {
    this.obtenerMedicos();
    this.obtenerCitas();
  }

  obtenerMedicos() {
    this.medicosService.obtenerMedicos().subscribe((medicos) => {
      this.medicos = medicos;
    });
  }

  obtenerCitas() {
    const filtrosApli = this.filtros.especialidad || this.filtros.medico || this.filtros.fecha || this.filtros.estado ? this.filtros : {};

    this.citasService.obtenerCitasFiltradas({
      ...filtrosApli,
      pagina: this.paginaActual,
      porPagina: this.citasPorPagina
    }).subscribe((res) => {
      console.log('Citas obtenidas:', res);  // Agregado para depuración
      if (res && res.citas) {
        this.citas = res.citas;
        this.totalCitas = res.total || 0; // Asegúrate de que la respuesta contiene 'total'
      }
    }, (error) => {
      console.error('Error al obtener las citas:', error); // Agregado para manejo de errores
    });
  }

  aplicarFiltros() {
    this.paginaActual = 1; // Resetear la página al aplicar filtros
    this.obtenerCitas();
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > Math.ceil(this.totalCitas / this.citasPorPagina)) {
      return;  // Validación para evitar páginas fuera de rango
    }
    this.paginaActual = pagina;
    this.obtenerCitas();
  }
}
