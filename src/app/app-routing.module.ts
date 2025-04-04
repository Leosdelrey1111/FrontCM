import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404pageComponent } from './shared/pages/error404page/error404page.component';

const routes: Routes = [
  { 
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { 
    path: 'paciente',
    loadChildren: () => import('./paciente/paciente.module').then(m => m.PacienteModule) 
  },
  { 
    path: 'consultorio',
    loadChildren: () => import('./consultorio/consultorio.module').then(m => m.ConsultorioModule) 
  },
  { 
    path: 'medico',
    loadChildren: () => import('./medico/medico.module').then(m => m.MedicoModule) 
  },   
  // Manejo de errores
  { path: '404', component: Error404pageComponent },
  { path: '**', redirectTo: '404' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
