import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-agent-detail',
  imports: [],
  templateUrl: './agent-detail.html',
  styleUrl: './agent-detail.scss'
})
export class AgentDetail {

  agent : string;

  constructor(private route : ActivatedRoute) {
    this.agent = this.route.snapshot.paramMap.get('hostname') ?? '';
    console.log("Detail for agent : " + this.agent + "");
  }


}
