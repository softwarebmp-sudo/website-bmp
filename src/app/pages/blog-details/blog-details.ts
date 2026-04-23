import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RealtimeBlogService } from '../../services/realtime-blog.service';
import { BlogModel } from '../../models/blog.model';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.scss',
})
export class BlogDetails implements OnInit {
  blogId: string = '';
  blog: BlogModel | null = null;
  loadingBlog = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public realtimeBlogService: RealtimeBlogService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadBlogDetail();
  }

  async loadBlogDetail(): Promise<void> {
    if (!this.blogId) return;

    try {
      this.loadingBlog = true;

      const data = await this.realtimeBlogService.getBlogById(this.blogId);

      if (data && data.status === 'publicado') {
        this.blog = data;
      } else {
        this.blog = null;
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando detalle del blog:', error);
      this.blog = null;
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

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}