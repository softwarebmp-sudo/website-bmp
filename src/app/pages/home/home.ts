import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RealtimeServicesService } from '../../services/realtime-services.service';
import { ServiceModel } from '../../models/services.model';
import { PortfolioModel } from '../../models/portfolio.model';
import { RealtimePortfolioService } from '../../services/realtime-portfolio.service';
import { BlogModel } from '../../models/blog.model';
import { RealtimeBlogService } from '../../services/realtime-blog.service';

declare var Swiper: any;
declare var WOW: any;
declare var $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private offerSwiper: any;
  private portfolioSwiper: any;
  private testimonialSwiper: any;
  private heroSwiper: any;
  servicesList: ServiceModel[] = [];
  loadingServices = false;
  portfolioList: PortfolioModel[] = [];
  loadingPortfolio = false;
  blogList: BlogModel[] = [];
loadingBlog = false;
  constructor(private ngZone: NgZone, public router: Router,
    public realtimeServicesService: RealtimeServicesService,
    private cdr: ChangeDetectorRef,
    public realtimePortfolioService: RealtimePortfolioService,
    public realtimeBlogService: RealtimeBlogService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadServices();
    await this.loadPortfolio();
    await this.loadBlog();
  }

  async loadServices(): Promise<void> {
    try {
      this.loadingServices = true;

      await this.realtimeServicesService.loadServices();

      this.realtimeServicesService.services$.subscribe(data => {
        this.servicesList = data || [];
        this.cdr.detectChanges();

        setTimeout(() => {
          this.initOfferSlider();
        }, 200);
      });
    } catch (error) {
      console.error('Error cargando servicios en home:', error);
    } finally {
      this.loadingServices = false;
    }
  }
  async loadPortfolio(): Promise<void> {
    try {
      this.loadingPortfolio = true;

      await this.realtimePortfolioService.loadPortfolio();

      this.realtimePortfolioService.portfolio$.subscribe(data => {
        this.portfolioList = (data || []).filter(item => item.status === 'publicado');
        this.cdr.detectChanges();

        setTimeout(() => {
          this.initPortfolioSlider();
        }, 200);
      });
    } catch (error) {
      console.error('Error cargando portfolio en home:', error);
    } finally {
      this.loadingPortfolio = false;
    }
  }
  async loadBlog(): Promise<void> {
  try {
    this.loadingBlog = true;

    await this.realtimeBlogService.loadBlog();

    this.realtimeBlogService.blog$.subscribe(data => {
      this.blogList = (data || [])
        .filter(item => item.status === 'publicado')
        .slice(0, 3);

      this.cdr.detectChanges();
    });
  } catch (error) {
    console.error('Error cargando blog en home:', error);
  } finally {
    this.loadingBlog = false;
  }
}
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.waitForImages().then(() => {
            this.initHomeScripts();
            this.initHoverEffect();
          });
        }, 200);
      });
    });
  }
  private initHomeScripts(): void {
    this.destroySwipers();

    this.initHeroSlider();
    this.initOfferSlider();
    this.initPortfolioSlider();
    this.initTestimonialSlider();
    this.initWow();
  }
  private initHeroSlider(): void {
    const el = document.querySelector('#showcase-slider');
    if (!el) return;

    this.heroSwiper = new Swiper('#showcase-slider', {
      loop: false,
      speed: 1000,
      slidesPerView: 1,
      allowTouchMove: false,
      navigation: {
        nextEl: '.hero-3-next',
        prevEl: '.hero-3-prev',
      },
      pagination: {
        el: '.tp-slider-dot',
        clickable: true,
      },
      observer: true,
      observeParents: true,
      watchOverflow: true,
    });
  }
  private initHoverEffect(): void {
    const elements = document.querySelectorAll('.tp-hover-distort');

    elements.forEach((el: any) => {
      const front = el.querySelector('.front')?.getAttribute('src');
      const back = el.querySelector('.back')?.getAttribute('src');
      const displacement = el.getAttribute('data-displacementImage');

      if (!front || !back || !displacement) return;

      new (window as any).hoverEffect({
        parent: el,
        intensity: 0.3,
        image1: front,
        image2: back,
        displacementImage: displacement
      });
    });
  }
  private initOfferSlider(): void {
    const el = document.querySelector('.tp-offer-active');
    if (!el) return;

    this.offerSwiper = new Swiper('.tp-offer-active', {
      loop: true,
      speed: 1000,
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: '.tp-offer-next',
        prevEl: '.tp-offer-prev',
      },
      pagination: {
        el: '.tp-offer-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        }
      },
      observer: true,
      observeParents: true,
      watchOverflow: true,
    });
  }

    private initPortfolioSlider(): void {
  const el = document.querySelector('.tp-portfolio-active');
  if (!el) return;

  if (this.portfolioSwiper) {
    this.portfolioSwiper.destroy(true, true);
    this.portfolioSwiper = null;
  }

  this.portfolioSwiper = new Swiper('.tp-portfolio-active', {
    loop: this.portfolioList.length > 1,
    speed: 1000,
    slidesPerView: 1.2,
    spaceBetween: 20,
    centeredSlides: false,
    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 3.2,
        spaceBetween: 30,
      }
    },
    observer: true,
    observeParents: true,
    watchOverflow: true,
  });
}
  private initTestimonialSlider(): void {
    const el = document.querySelector('.tp-testimonial-active');
    if (!el) return;

    this.testimonialSwiper = new Swiper('.tp-testimonial-active', {
      loop: true,
      speed: 900,
      slidesPerView: 1,
      spaceBetween: 30,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        }
      },
      observer: true,
      observeParents: true,
      watchOverflow: true,
    });
  }

  private initWow(): void {
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }
  }

  private destroySwipers(): void {
    if (this.heroSwiper) {
      this.heroSwiper.destroy(true, true);
      this.heroSwiper = null;
    }

    if (this.offerSwiper) {
      this.offerSwiper.destroy(true, true);
      this.offerSwiper = null;
    }

    if (this.portfolioSwiper) {
      this.portfolioSwiper.destroy(true, true);
      this.portfolioSwiper = null;
    }

    if (this.testimonialSwiper) {
      this.testimonialSwiper.destroy(true, true);
      this.testimonialSwiper = null;
    }
  }

  ngOnDestroy(): void {
    this.destroySwipers();
  }
  private waitForImages(): Promise<void> {
    const images = Array.from(document.images);

    const pending = images.filter(img => !img.complete);

    if (!pending.length) return Promise.resolve();

    return Promise.all(
      pending.map(img => new Promise<void>(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }))
    ).then(() => undefined);
  }

  getCoverUrl(item: any): string | null {
    if (!item?.cover) return null;
    return this.realtimeServicesService.getFileUrl(item, item.cover);
  }
  getPortfolioCoverUrl(item: any): string | null {
  if (!item?.cover) return null;
  return this.realtimePortfolioService.getFileUrl(item, item.cover);
}
getBlogCoverUrl(item: any): string | null {
  if (!item?.cover) return null;
  return this.realtimeBlogService.getFileUrl(item, item.cover);
}
formatBlogDate(dateValue: string | undefined): string {
  if (!dateValue) return '';

  return new Date(dateValue).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
}