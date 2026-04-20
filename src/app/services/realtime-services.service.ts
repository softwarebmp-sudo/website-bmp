import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { ServiceModel } from '../models/services.model';

@Injectable({
  providedIn: 'root'
})
export class RealtimeServicesService {
  private pb = new PocketBase('https://db.bmpsoftware.site:8090');
  private collectionName = 'services_bmp';

  private servicesSubject = new BehaviorSubject<ServiceModel[]>([]);
  services$ = this.servicesSubject.asObservable();

  servicesList: ServiceModel[] = [];

  async loadServices(): Promise<void> {
    const records = await this.pb.collection(this.collectionName).getFullList({
      sort: '-created'
    });

    this.servicesList = records as unknown as ServiceModel[];
    this.servicesSubject.next(this.servicesList);
  }

  async getServiceById(id: string): Promise<ServiceModel> {
    const record = await this.pb.collection(this.collectionName).getOne(id);
    return record as unknown as ServiceModel;
  }

  async createService(data: any): Promise<void> {
    await this.pb.collection(this.collectionName).create(data);
    await this.loadServices();
  }

  async updateService(id: string, data: any): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, data);
    await this.loadServices();
  }

  async appendGalleryFiles(id: string, files: File[]): Promise<void> {
    if (!files.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append('gallery', file);
    }

    await this.pb.collection(this.collectionName).update(id, formData);
  }

  async removeGalleryFiles(id: string, fileNames: string[]): Promise<void> {
    if (!fileNames.length) return;

    await this.pb.collection(this.collectionName).update(id, {
      'gallery-': fileNames
    });
  }

  async clearCover(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, {
      cover: null
    });
  }

  async deleteService(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).delete(id);
    await this.loadServices();
  }

  getFileUrl(record: any, fileName: string): string {
    return this.pb.files.getURL(record, fileName);
  }

  buildSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
}