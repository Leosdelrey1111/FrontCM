import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router) { }

  // Navegar a la página de login
  goToLogin(): void {
    this.router.navigate(['/login']);  // Asegúrate de tener configurada la ruta '/login'
  }
}
