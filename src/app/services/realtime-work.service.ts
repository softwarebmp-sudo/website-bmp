import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { WorkModel } from '../models/work.model';

@Injectable({
  providedIn: 'root'
})
export class RealtimeWorksService {
  private pb = new PocketBase('https://db.bmpsoftware.site:8015');
  private collectionName = 'works_bmp';

  private worksSubject = new BehaviorSubject<WorkModel[]>([]);
  works$ = this.worksSubject.asObservable();

  worksList: WorkModel[] = [];

  async loadWorks(): Promise<void> {
    const records = await this.pb.collection(this.collectionName).getFullList({
      sort: 'orderIndex,-created'
    });

    this.worksList = records as unknown as WorkModel[];
    this.worksSubject.next(this.worksList);
  }

  async getWorkById(id: string): Promise<WorkModel> {
    const record = await this.pb.collection(this.collectionName).getOne(id);
    return record as unknown as WorkModel;
  }

  async createWork(data: any): Promise<void> {
    await this.pb.collection(this.collectionName).create(data);
    await this.loadWorks();
  }

  async updateWork(id: string, data: any): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, data);
    await this.loadWorks();
  }

  async appendPhotos(id: string, files: File[]): Promise<void> {
    if (!files.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append('photos', file);
    }

    await this.pb.collection(this.collectionName).update(id, formData);
  }

  async removePhotos(id: string, fileNames: string[]): Promise<void> {
    if (!fileNames.length) return;

    await this.pb.collection(this.collectionName).update(id, {
      'photos-': fileNames
    });
  }

  async deleteWork(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).delete(id);
    await this.loadWorks();
  }

  getFileUrl(record: any, fileName: string): string {
    return this.pb.files.getURL(record, fileName);
  }
}