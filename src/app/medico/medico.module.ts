import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicoRoutingModule } from './medico-routing.module';
import { AgendaComponent } from './agenda/agenda.component';
import { LayoutmedicoComponent } from './layoutmedico/layoutmedico.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CitaAceptadaComponent } from './cita-aceptada/cita-aceptada.component';

@NgModule({
  declarations: [
    AgendaComponent,
    LayoutmedicoComponent,
    CitaAceptadaComponent
  ],
  imports: [
    CommonModule,
    MedicoRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class MedicoModule { }
