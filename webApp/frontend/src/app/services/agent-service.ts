import { Injectable } from '@angular/core';
import {MetricService} from './metric-service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  public agents$ = new BehaviorSubject<any[]>([]);
  private TAG : string = "[Agent-Service] - ";

  constructor(private metricService : MetricService) {
  }

  updateAgents() {

    this.metricService.getAllAgents().subscribe({
      next: (data: any[]) => {
        this.agents$.next(data);
        console.log(this.TAG + "All agents updated");
      },
      error: (err: any) => {
        console.log(this.TAG + "Error while getting all agents");
        console.error(err);
      }
    });

  }


}
