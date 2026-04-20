import { Component, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ScriptLoaderService } from './services/script-loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('bmpsite');
  isSearchOpen = false;
  isCartOpen = false;
  isOffcanvasOpen = false;

  constructor(private scriptLoader: ScriptLoaderService) {}

  async ngAfterViewInit() {
    await this.loadVendorScripts();
  }

  async loadVendorScripts() {
    try {
      await this.scriptLoader.loadAll([
        { src: 'assets/js/vendor/jquery.js', attr: { defer: 'true' } },
        { src: 'assets/js/bootstrap-bundle.js', attr: { defer: 'true' } },
        { src: 'assets/js/three.js', attr: { defer: 'true' } },
        { src: 'assets/js/gsap.js', attr: { defer: 'true' } },
        { src: 'assets/js/webgl.js', attr: { defer: 'true' } },
        { src: 'assets/js/hover-effect.umd.js', attr: { defer: 'true' } },
        { src: 'assets/js/swiper-bundle.js', attr: { defer: 'true' } },
        { src: 'assets/js/magnific-popup.js', attr: { defer: 'true' } },
        { src: 'assets/js/tilt.jquery.min.js', attr: { defer: 'true' } },
        { src: 'assets/js/purecounter.js', attr: { defer: 'true' } },
        { src: 'assets/js/imagesloaded-pkgd.js', attr: { defer: 'true' } },
        { src: 'assets/js/isotope-pkgd.js', attr: { defer: 'true' } },
        { src: 'assets/js/nice-select.js', attr: { defer: 'true' } },
        { src: 'assets/js/countdown.js', attr: { defer: 'true' } },
        { src: 'assets/js/wow.js', attr: { defer: 'true' } },
        { src: 'assets/js/ajax-form.js', attr: { defer: 'true' } }
      ]);

      (window as any).SVGInject?.(document.querySelectorAll('img.injectable'));
    } catch (err) {
      console.error('Error cargando scripts', err);
    }
  }

  openSearch() {
    this.isSearchOpen = true;
    this.isCartOpen = false;
    this.isOffcanvasOpen = false;
  }

  openCart() {
    this.isCartOpen = true;
    this.isSearchOpen = false;
    this.isOffcanvasOpen = false;
  }

  openOffcanvas() {
    this.isOffcanvasOpen = true;
    this.isSearchOpen = false;
    this.isCartOpen = false;
  }

  closeAll() {
    this.isSearchOpen = false;
    this.isCartOpen = false;
    this.isOffcanvasOpen = false;
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  closeCart() {
    this.isCartOpen = false;
  }

  closeOffcanvas() {
    this.isOffcanvasOpen = false;
  }
}