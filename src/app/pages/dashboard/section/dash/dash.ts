import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { RealtimePortfolioService } from '../../../../services/realtime-portfolio.service';
import { RealtimeServicesService } from '../../../../services/realtime-services.service';
import { RealtimeBlogService } from '../../../../services/realtime-blog.service';
import { RouterOutlet } from '@angular/router';
import { RealtimeTestimonialsService } from '../../../../services/realtime-testimonial.service';
import { RealtimeTeamsService } from '../../../../services/realtime-team.service';
import { RealtimeWorksService } from '../../../../services/realtime-work.service';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dash.html',
  styleUrl: './dash.scss',
})
export class Dash implements OnInit, OnDestroy {
  showDashboardContent = true;
  adminName = 'Administrador';
  adminRole = 'admin';

  totalPortfolio = 0;
  totalServices = 0;
  totalBlog = 0;
  totalTestimonials = 0;
  totalTeams = 0;
  totalWorks = 0;

  loadingPortfolio = false;
  loadingServices = false;
  loadingBlog = false;
  loadingTestimonials = false;
  loadingTeams = false;
  loadingWorks = false;

  private sub?: Subscription;

  constructor(
    public router: Router,
    public realtimePortfolioService: RealtimePortfolioService,
    public realtimeServicesService: RealtimeServicesService,
    public realtimeBlogService: RealtimeBlogService,
    public realtimeTestimonialsService: RealtimeTestimonialsService,
    public realtimeTeamsService: RealtimeTeamsService,
    public realtimeWorksService: RealtimeWorksService
  ) { }

  ngOnInit(): void {
    this.loadCounts();

    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        this.showDashboardContent = currentUrl === '/admin' || currentUrl === '/admin/dashboard';
      });
    const role = localStorage.getItem('admin_role') || 'admin';
    this.adminRole = role;

    if (role === 'engineer') {
      this.adminName = 'Ingeniero';
    } else {
      this.adminName = 'Administrador';
    }
  }

  async loadCounts(): Promise<void> {
    await Promise.all([
      this.loadPortfolioCount(),
      this.loadServicesCount(),
      this.loadBlogCount(),
      this.loadTestimonialsCount(),
      this.loadTeamsCount(),
      this.loadWorksCount()
    ]);
  }

  async loadPortfolioCount(): Promise<void> {
    try {
      this.loadingPortfolio = true;
      await this.realtimePortfolioService.loadPortfolio();
      this.totalPortfolio = this.realtimePortfolioService.portfolioList.length;
    } catch (error) {
      console.error('Error cargando portafolio:', error);
    } finally {
      this.loadingPortfolio = false;
    }
  }

  async loadServicesCount(): Promise<void> {
    try {
      this.loadingServices = true;
      await this.realtimeServicesService.loadServices();
      this.totalServices = this.realtimeServicesService.servicesList.length;
    } catch (error) {
      console.error('Error cargando servicios:', error);
    } finally {
      this.loadingServices = false;
    }
  }

  async loadBlogCount(): Promise<void> {
    try {
      this.loadingBlog = true;
      await this.realtimeBlogService.loadBlog();
      this.totalBlog = this.realtimeBlogService.blogList.length;
    } catch (error) {
      console.error('Error cargando blog:', error);
    } finally {
      this.loadingBlog = false;
    }
  }

  async loadTestimonialsCount(): Promise<void> {
    try {
      this.loadingTestimonials = true;
      await this.realtimeTestimonialsService.loadTestimonials();
      this.totalTestimonials = this.realtimeTestimonialsService.testimonialsList.length;
    } catch (error) {
      console.error('Error cargando testimonios:', error);
    } finally {
      this.loadingTestimonials = false;
    }
  }

  async loadTeamsCount(): Promise<void> {
    try {
      this.loadingTeams = true;
      await this.realtimeTeamsService.loadTeams();
      this.totalTeams = this.realtimeTeamsService.teamsList.length;
    } catch (error) {
      console.error('Error cargando equipos:', error);
    } finally {
      this.loadingTeams = false;
    }
  }

  async loadWorksCount(): Promise<void> {
    try {
      this.loadingWorks = true;
      await this.realtimeWorksService.loadWorks();
      this.totalWorks = this.realtimeWorksService.worksList.length;
    } catch (error) {
      console.error('Error cargando trabajos:', error);
    } finally {
      this.loadingWorks = false;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get isAdmin(): boolean {
  return this.adminRole === 'admin';
}

get isEngineer(): boolean {
  return this.adminRole === 'engineer';
}
  logout(): void {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_role');
    this.router.navigate(['/login']);
  }
}