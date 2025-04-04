import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { MedicosService } from '../../services/medicos.service'; // Asegúrate de tener este servicio

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

  constructor(
    private citasService: CitasService,
    private especialidadesService: EspecialidadesService,
    private medicosService: MedicosService
  ) {}

  ngOnInit() {
  //  this.cargarCitas();
    this.obtenerEspecialidades();
    this.obtenerMedicos();
  }

//   cargarCitas() {
//     this.citasService.obtenerCitas().subscribe((citas) => {
//       this.citas = citas;
//     });
//   }

  obtenerEspecialidades() {
    this.especialidadesService.obtenerEspecialidades().subscribe((especialidades) => {
      this.especialidades = especialidades;
    });
  }

  obtenerMedicos() {
    this.medicosService.obtenerMedicos().subscribe((medicos) => {
      this.medicos = medicos;
    });
  }

  aplicarFiltros() {
    const filtro = {
      especialidad: this.filtros.especialidad,
      medico: this.filtros.medico,
      fecha: this.filtros.fecha,
      estado: this.filtros.estado
    };
    this.citasService.obtenerCitasFiltradas(filtro).subscribe((citas) => {
      this.citas = citas;
    });
  }
}
