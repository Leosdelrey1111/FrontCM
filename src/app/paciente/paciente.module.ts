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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    PerfilComponent,
    AgendarCitaComponent,
    HistorialComponent,
    PacienteLayoutComponentComponent,
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDatepicker,
    MatDatepickerModule,
    MatNativeDateModule,
    

  ]
})
export class PacienteModule { }
