import { Component, OnInit } from '@angular/core';
import { TeamModel } from '../../models/team.model';
import { CommonModule } from '@angular/common';
import { RealtimeTeamsService } from '../../services/realtime-team.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {

  teams: TeamModel[] = [];

  constructor(public teamsService: RealtimeTeamsService) {}

  async ngOnInit(): Promise<void> {
    await this.teamsService.loadTeams();

    this.teamsService.teams$.subscribe({
      next: (teams) => {
        this.teams = teams || [];
      },
      error: (err) => console.error('Error cargando equipo', err)
    });
  }

  getTeamImage(team: any): string {
    if (!team?.image) {
      return 'assets/img/team/default-team.jpg';
    }

    return this.teamsService.getFileUrl(team, team.image);
  }

  scrollTeam(direction: 'left' | 'right'): void {
    const carousel = document.querySelector('.bmp-team-carousel') as HTMLElement;

    if (!carousel) return;

    carousel.scrollBy({
      left: direction === 'right' ? 360 : -360,
      behavior: 'smooth'
    });
  }
}
