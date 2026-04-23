import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RealtimePortfolioService } from '../../services/realtime-portfolio.service';
import { PortfolioModel } from '../../models/portfolio.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails implements OnInit {
  projectId: string = '';
  project: PortfolioModel | null = null;
  loading = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public realtimePortfolioService: RealtimePortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadProject();
    this.cdr.detectChanges();
  }

  async loadProject(): Promise<void> {
    try {
      this.loading = true;

      await this.realtimePortfolioService.loadPortfolio();

      const portfolioList = this.realtimePortfolioService.portfolioSubject?.value || [];

      this.project =
        portfolioList.find((item: PortfolioModel) => item.id === this.projectId && item.status === 'publicado') || null;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando detalle del proyecto:', error);
    } finally {
      this.loading = false;
    }
  }

  getProjectCoverUrl(): string {
    if (!this.project?.cover) return 'assets/img/project/project-placeholder.jpg';
    return this.realtimePortfolioService.getFileUrl(this.project, this.project.cover);
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }
}