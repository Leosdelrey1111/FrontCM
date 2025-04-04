import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { HistorialComponent } from './historial/historial.component';
import { PacienteLayoutComponentComponent } from './paciente-layout-component/paciente-layout-component.component';

const routes: Routes = [
  { 
    path: '', // Ruta base: /paciente
    component: PacienteLayoutComponentComponent,
    children: [
      { path: 'agendar', component: AgendarCitaComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'perfil', component: PerfilComponent },
      
      { path: '', redirectTo: 'agendar', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})  

export class PacienteRoutingModule { }
