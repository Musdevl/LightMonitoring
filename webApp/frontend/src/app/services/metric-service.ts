import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Agent} from '../model/agent.model';


@Injectable({
  providedIn: 'root'
})
export class MetricService {

  private apiUrl : string= "http://localhost:9000";

  constructor(private http : HttpClient) {
  }

  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl + "/agent");
  }


}
