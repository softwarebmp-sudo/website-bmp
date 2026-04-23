import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { PortfolioModel } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class RealtimePortfolioService {
  private pb = new PocketBase('https://db.bmpsoftware.site:8090');
  private collectionName = 'portfolio_bmp';

  public portfolioSubject = new BehaviorSubject<PortfolioModel[]>([]);
  portfolio$ = this.portfolioSubject.asObservable();

  portfolioList: PortfolioModel[] = [];

  async loadPortfolio(): Promise<void> {
    const records = await this.pb.collection(this.collectionName).getFullList({
      sort: '-created'
    });

    this.portfolioList = records as unknown as PortfolioModel[];
    this.portfolioSubject.next(this.portfolioList);
  }

  async getPortfolioById(id: string): Promise<PortfolioModel> {
    const record = await this.pb.collection(this.collectionName).getOne(id);
    return record as unknown as PortfolioModel;
  }

  async createPortfolio(data: FormData | Partial<PortfolioModel>): Promise<void> {
    await this.pb.collection(this.collectionName).create(data);
    await this.loadPortfolio();
  }


async updatePortfolio(id: string, data: any): Promise<void> {
  await this.pb.collection(this.collectionName).update(id, data);
  await this.loadPortfolio();
}
  async deletePortfolio(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).delete(id);
    await this.loadPortfolio();
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
  async appendGalleryFiles(id: string, files: File[]): Promise<void> {
  if (!files.length) return;

  const formData = new FormData();

  for (const file of files) {
    formData.append('gallery', file);
  }

  await this.pb.collection(this.collectionName).update(id, formData);
}
}