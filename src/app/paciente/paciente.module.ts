import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacienteRoutingModule } from './paciente-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { HistorialComponent } from './historial/historial.component';
import { AppModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteLayoutComponentComponent } from './paciente-layout-component/paciente-layout-component.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    PerfilComponent,
    AgendarCitaComponent,
    HistorialComponent,
    PacienteLayoutComponentComponent
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
    

  ]
})
export class PacienteModule { }
