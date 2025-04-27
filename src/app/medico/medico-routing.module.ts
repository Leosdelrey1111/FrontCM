import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { LayoutmedicoComponent } from './layoutmedico/layoutmedico.component';
import { CitaAceptadaComponent } from './cita-aceptada/cita-aceptada.component';
import { PerfilComponent } from './perfil/perfil.component';


const routes: Routes = [
  { 
    path: '', // Ruta base: /paciente
    component: LayoutmedicoComponent,
    children: [
      { path: 'agenda', component: AgendaComponent },
      { path: 'aceptar', component: CitaAceptadaComponent },
      { path: 'medico-perfil', component: PerfilComponent },
      { path: '', redirectTo: 'agendar', pathMatch: 'full' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }
