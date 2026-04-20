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

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dash.html',
  styleUrl: './dash.scss',
})
export class Dash implements OnInit, OnDestroy {
  adminName = 'Administrador';
  showDashboardContent = true;

  totalPortfolio = 0;
  totalServices = 0;
  totalBlog = 0;

  loadingPortfolio = false;
  loadingServices = false;
  loadingBlog = false;

  private sub?: Subscription;

  constructor(
    public router: Router,
    public realtimePortfolioService: RealtimePortfolioService,
    public realtimeServicesService: RealtimeServicesService,
    public realtimeBlogService: RealtimeBlogService
  ) {}

  ngOnInit(): void {
    this.loadCounts();

    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        this.showDashboardContent = currentUrl === '/admin' || currentUrl === '/admin/dashboard';
      });
  }

  async loadCounts(): Promise<void> {
    await Promise.all([
      this.loadPortfolioCount(),
      this.loadServicesCount(),
      this.loadBlogCount(),
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}