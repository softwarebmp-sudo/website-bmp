import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
import { TeamModel } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class RealtimeTeamsService {
  private pb = new PocketBase('https://db.bmpsoftware.site:8015');
  private collectionName = 'teams_bmp';

  private teamsSubject = new BehaviorSubject<TeamModel[]>([]);
  teams$ = this.teamsSubject.asObservable();

  teamsList: TeamModel[] = [];

  async loadTeams(): Promise<void> {
    const records = await this.pb.collection(this.collectionName).getFullList({
      sort: 'orderIndex,-created'
    });

    this.teamsList = records as unknown as TeamModel[];
    this.teamsSubject.next(this.teamsList);
  }

  async getTeamById(id: string): Promise<TeamModel> {
    const record = await this.pb.collection(this.collectionName).getOne(id);
    return record as unknown as TeamModel;
  }

  async createTeam(data: any): Promise<void> {
    await this.pb.collection(this.collectionName).create(data);
    await this.loadTeams();
  }

  async updateTeam(id: string, data: any): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, data);
    await this.loadTeams();
  }

  async clearImage(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).update(id, {
      image: null
    });
  }

  async deleteTeam(id: string): Promise<void> {
    await this.pb.collection(this.collectionName).delete(id);
    await this.loadTeams();
  }

  getFileUrl(record: any, fileName: string): string {
    return this.pb.files.getURL(record, fileName);
  }
}