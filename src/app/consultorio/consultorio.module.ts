import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultorioRoutingModule } from './consultorio-routing.module';
import { PanelComponent } from './panel/panel.component';
import { LayoutComponent } from './layout/layout.component';
import { AgendaComponent } from '../medico/agenda/agenda.component'; // Asegúrate de que la ruta esté correcta
import { HistorialComponent } from '../paciente/historial/historial.component'; // Asegúrate de que la ruta esté correcta
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PanelComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ConsultorioRoutingModule,
    MatIcon,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
    
  ]
})
export class ConsultorioModule { }
