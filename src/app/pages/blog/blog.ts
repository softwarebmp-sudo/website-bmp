import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { RealtimeBlogService } from '../../services/realtime-blog.service';
import { BlogModel } from '../../models/blog.model';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  blogList: BlogModel[] = [];
  loadingBlog = false;
  constructor(
    public realtimeBlogService: RealtimeBlogService,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadBlog();
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
getBlogExcerpt(content: string | undefined, limit: number = 120): string {
  if (!content) return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const plainText = (tempDiv.textContent || tempDiv.innerText || '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= limit) {
    return plainText;
  }

  return plainText.slice(0, limit).trim() + '...';
}
}
