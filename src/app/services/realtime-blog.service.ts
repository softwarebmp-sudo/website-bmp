import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { BlogModel } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class RealtimeBlogService {
  private pb = new PocketBase('https://db.bmpsoftware.site:8090');
  private blogSubject = new BehaviorSubject<BlogModel[]>([]);
  blog$ = this.blogSubject.asObservable();

  blogList: BlogModel[] = [];

  async loadPosts(): Promise<void> {
    const records = await this.pb.collection('blog_bmp').getFullList({
      sort: '-publishDate,-created'
    });

    this.blogList = records as unknown as BlogModel[];
    this.blogSubject.next(this.blogList);
  }

  async deletePost(id: string): Promise<void> {
    await this.pb.collection('blog_bmp').delete(id);
    await this.loadPosts();
  }
}