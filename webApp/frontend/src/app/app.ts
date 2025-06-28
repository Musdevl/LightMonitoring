import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AgentService} from './services/agent-service';
import {SocketService} from './services/socket-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'frontend';
  agents: any[] = [];

  constructor(private agentService: AgentService, socketService: SocketService) {
    this.agentService.agents$.subscribe({
      next: (data: any[]) => {
        this.agents = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });

    this.agentService.updateAgents();
  }

  refreshAgents() {
    this.agentService.updateAgents();
  }
}
