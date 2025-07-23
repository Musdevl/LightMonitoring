import { Component, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SocketService} from '../../services/socket-service';
import {AgentService} from '../../services/agent-service';
import {Agent} from '../../model/agent.model'

@Component({
  selector: 'app-agent-detail',
  imports: [],
  templateUrl: './agent-detail.html',
  styleUrl: './agent-detail.scss'
})
export class AgentDetail implements OnDestroy{

  hostname : string;
  agent? : Agent;

  constructor(private route : ActivatedRoute, private socketService : SocketService, private agentService : AgentService) {
    this.hostname = this.route.snapshot.paramMap.get('hostname') ?? '';
    console.log("Detail for agent : " + this.hostname + "");

    const foundAgent = this.agentService.getAgentByName(this.hostname);

    if (!foundAgent) {
      console.error("Error when creating AgentDetail: No agent found");
    } else {
      this.agent = foundAgent;
      this.socketService.watchAgent(this.agent);
    }


  }

  ngOnDestroy() {
    if(this.agent){
      this.socketService.unwatchAgent(this.agent);
    }
  }
}
