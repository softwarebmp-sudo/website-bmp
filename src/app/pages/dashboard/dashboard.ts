import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
standalone: true,
  imports: [CommonModule, RouterOutlet],
    templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
private router = inject(Router);

  isLoginRoute = false;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginRoute = event.urlAfterRedirects === '/admin/login';
      });

    this.isLoginRoute = this.router.url === '/admin/login';
  }
}
