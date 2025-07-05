import { Routes } from '@angular/router';
import {AgentDetail} from './pages/agent-detail/agent-detail';
import {Home} from './pages/home/home';

export const routes: Routes = [
  {path:'agent/:hostname', component: AgentDetail},
  {path:'', component: Home}
];
