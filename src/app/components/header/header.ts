import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @HostListener('document:click')
  closeDropdown() {
    this.isLangOpen = false;
  }
  isLangOpen = false;
  currentLang = 'es';
  currentFlag = 'https://flagcdn.com/w20/co.png';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');

    const savedLang = localStorage.getItem('lang') || 'es';
    this.setLang(savedLang);
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
}
