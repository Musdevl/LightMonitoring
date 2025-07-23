import { Injectable } from '@angular/core';
import {MetricService} from './metric-service';
import { BehaviorSubject } from 'rxjs';
import {Agent} from '../model/agent.model';


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  public agents$ = new BehaviorSubject<Agent[]>([]);
  private TAG : string = "[Agent-Service] - ";

  constructor(private metricService : MetricService) {
  }

  updateAgents() {

    this.metricService.getAllAgents().subscribe({
      next: (data: Agent[]) => {
        this.agents$.next(data);
        console.log(this.TAG + "All agents updated : ", data);
      },
      error: (err: any) => {
        console.log(this.TAG + "Error while getting all agents");
        console.error(err);
      }
    });

  }

  getAgentByName(hostname : string) : Agent | null {

    /*
    If there is multiple agent with the same name, the first in the list order will be picked
     */

    return this.agents$.value.find((agent: Agent) => agent.hostname === hostname) || null;
  }


}
