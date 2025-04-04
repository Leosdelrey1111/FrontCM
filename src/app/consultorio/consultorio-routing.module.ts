import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgendaComponent } from '../medico/agenda/agenda.component'; // Ruta correcta para AgendaComponent
import { HistorialComponent } from '../paciente/historial/historial.component'; // Ruta correcta para HistorialComponent
import { PanelComponent } from './panel/panel.component';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  { 
    path: '', // Ruta base: /paciente
    component: LayoutComponent,
    children: [
      { path: 'agenda', component: PanelComponent },
      
      { path: '', redirectTo: 'agendar', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultorioRoutingModule { }
