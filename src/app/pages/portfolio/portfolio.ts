import { Component } from '@angular/core';
import { PortfolioModel } from '../../models/portfolio.model';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { RealtimePortfolioService } from '../../services/realtime-portfolio.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {

  portfolioList: PortfolioModel[] = [];
  filteredPortfolioList: PortfolioModel[] = [];

  portfolioTypes: string[] = [];
  activeFilter = 'all';

  loadingPortfolio = false;

  constructor(
    private ngZone: NgZone,
    public router: Router,
    private cdr: ChangeDetectorRef,
    public realtimePortfolioService: RealtimePortfolioService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadPortfolio();
  }

  async loadPortfolio(): Promise<void> {
    try {
      this.loadingPortfolio = true;

      await this.realtimePortfolioService.loadPortfolio();

      this.realtimePortfolioService.portfolio$.subscribe(data => {
        this.portfolioList = (data || [])
          .filter(item => item.status === 'publicado')
          .sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

        this.filteredPortfolioList = [...this.portfolioList];

        this.portfolioTypes = [
          ...new Set(
            this.portfolioList
              .map((item: any) => item.type)
              .filter(Boolean)
          )
        ];

        this.cdr.detectChanges();
      });

    } catch (error) {
      console.error('Error cargando portfolio:', error);
    } finally {
      this.loadingPortfolio = false;
    }
  }

  filterPortfolio(type: string): void {
    this.activeFilter = type;

    if (type === 'all') {
      this.filteredPortfolioList = [...this.portfolioList];
      return;
    }

    this.filteredPortfolioList = this.portfolioList.filter(
      (item: any) => item.type === type
    );
  }

  getPortfolioCoverUrl(item: any): string {
    if (!item?.cover) return 'assets/img/project/default-project.jpg';
    return this.realtimePortfolioService.getFileUrl(item, item.cover);
  }

  formatFilterName(value: string): string {
    if (!value) return '';

    return value
      .replaceAll('-', ' ')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }
}
