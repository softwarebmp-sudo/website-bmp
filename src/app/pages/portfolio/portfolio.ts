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
loadingPortfolio = false;

constructor(private ngZone: NgZone, public router: Router,
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
        .slice(0, 3);

      this.cdr.detectChanges();
    });
  } catch (error) {
    console.error('Error cargando portfolio en home:', error);
  } finally {
    this.loadingPortfolio = false;
  }
}
getPortfolioCoverUrl(item: any): string | null {
  if (!item?.cover) return null;
  return this.realtimePortfolioService.getFileUrl(item, item.cover);
}

}
