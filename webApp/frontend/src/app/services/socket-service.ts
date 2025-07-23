import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {AgentService} from './agent-service';
import {Agent} from '../model/agent.model';



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

    this.socket.on('backend_error', (data) => {
      console.log(this.TAG + "Backend error : ", data);
    })
  }


  watchAgent(agent : Agent) {
    this.socket.emit('watch_agent', agent);
  }

  unwatchAgent(agent : Agent) {
    this.socket.emit('unwatch_agent', agent);
  }
}
