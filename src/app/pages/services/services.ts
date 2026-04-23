import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RealtimeServicesService } from '../../services/realtime-services.service';
import { ServiceModel } from '../../models/services.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  servicesList: ServiceModel[] = [];
  loadingServices = false;
    constructor(
    private translate: TranslateService,
    public router: Router,
    public realtimeServicesService: RealtimeServicesService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadServices();
  }

  async loadServices(): Promise<void> {
    try {
      this.loadingServices = true;

      await this.realtimeServicesService.loadServices();

      this.realtimeServicesService.services$.subscribe(data => {
        this.servicesList = data || [];
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error cargando servicios en home:', error);
    } finally {
      this.loadingServices = false;
    }
  }

}
