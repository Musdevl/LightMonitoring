import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import {SocketService} from './services/socket-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'LightMonitoring';

  // On fait ça pour instancier le socketService sinon il marche pas
  constructor(private socketService : SocketService) {
  }
}
