import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { TestimonialModel } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root'
})
export class RealtimeTestimonialsService {
  private pb = new PocketBase('https://db.bmpsoftware.site:8015');
  private collectionName = 'testimonials_bmp';

  private testimonialsSubject = new BehaviorSubject<TestimonialModel[]>([]);
  testimonials$ = this.testimonialsSubject.asObservable();

  testimonialsList: TestimonialModel[] = [];

  async loadTestimonials(): Promise<void> {
    const records = await this.pb.collection(this.collectionName).getFullList({
      sort: 'orderIndex,-created'
    });

    this.testimonialsList = records as unknown as TestimonialModel[];
    this.testimonialsSubject.next(this.testimonialsList);
  }

  async getTestimonialById(id: string): Promise<TestimonialModel> {
    const record = await this.pb.collection(this.collectionName).getOne(id);
    return record as unknown as TestimonialModel;
  }

  async createTestimonial(data: any): Promise<void> {
    await this.pb.collection(this.collectionName).create(data);
    await this.loadTestimonials();
  }

  async updateTestimonial(id: string, data: any): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, data);
    await this.loadTestimonials();
  }

  async clearAvatar(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, {
      avatar: null
    });
  }

  async deleteTestimonial(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).delete(id);
    await this.loadTestimonials();
  }

  getFileUrl(record: any, fileName: string): string {
    return this.pb.files.getURL(record, fileName);
  }
}