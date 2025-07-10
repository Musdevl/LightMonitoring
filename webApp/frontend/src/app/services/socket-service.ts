import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {AgentService} from './agent-service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private TAG : string = "[Socket-Service]  - ";

  constructor(private agentService : AgentService) {
    this.socket = io('http://localhost:9000');

    this.socket.on('connect', () => {
      console.log('Socket connecté avec id:', this.socket.id);
    });

    this.socket.on('new_agent', () => {
      console.log(this.TAG + " New agent, update agents");
      this.agentService.updateAgents();
    })

    this.socket.on('delete_agent', () => {
      console.log(this.TAG + " Delete agent, update agents");
      this.agentService.updateAgents();
    })

  }
}
