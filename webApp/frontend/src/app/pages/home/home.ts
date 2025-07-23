import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {AgentService} from '../../services/agent-service';
import {SocketService} from '../../services/socket-service';
import {Agent} from '../../model/agent.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  agents: Agent[] = [];

  constructor(private agentService: AgentService, private router : Router, private socketService : SocketService) {
    this.agentService.agents$.subscribe({
      next: (data: Agent[]) => {
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

  goToAgentDetail(agent : Agent) {
    this.router.navigate(['/agent', agent.hostname]);}
}
