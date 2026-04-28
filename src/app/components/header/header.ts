import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  @Output() searchClick = new EventEmitter<void>();
  @Output() cartClick = new EventEmitter<void>();
  @Output() offcanvasClick = new EventEmitter<void>();

  isLangOpen = false;
  currentLang = 'es';
  currentFlag = 'https://flagcdn.com/w20/co.png';
  isOffcanvasOpen = false;

  isLoggedIn = false;
  adminRole: string | null = null;

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('es');

    const savedLang = localStorage.getItem('lang') || 'es';
    this.setLang(savedLang);
  }

  ngOnInit(): void {
    this.checkSession();
  }

  checkSession(): void {
    this.isLoggedIn = localStorage.getItem('admin_session') === 'true';
    this.adminRole = localStorage.getItem('admin_role');
  }

  goToAdmin(): void {
    this.checkSession();

    if (this.isLoggedIn) {
      this.router.navigate(['/admin/panel']);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  logout(): void {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_role');

    this.isLoggedIn = false;
    this.adminRole = null;

    this.router.navigate(['/admin/login']);
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isLangOpen = false;
  }

  toggleLang(event: Event) {
    event.stopPropagation();
    this.isLangOpen = !this.isLangOpen;
  }

  changeLang(lang: string) {
    this.setLang(lang);
    this.isLangOpen = false;
  }

  setLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);

    this.currentFlag = lang === 'es'
      ? 'https://flagcdn.com/w20/co.png'
      : 'https://flagcdn.com/w20/us.png';
  }

  openSearch() {
    this.searchClick.emit();
  }

  openCart() {
    this.cartClick.emit();
  }

  openOffcanvas() {
    this.isOffcanvasOpen = true;
    this.offcanvasClick.emit();
  }

  closeOffcanvas() {
    this.isOffcanvasOpen = false;
  }
}