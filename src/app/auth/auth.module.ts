import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component'; // <-- Importar FormsModule
import { AuthRoutingModule } from './auth-routing.module';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    MatIcon,
    MatCard,
    MatToolbar,
    MatInputModule
    
    
  ]
})
export class AuthModule { }
