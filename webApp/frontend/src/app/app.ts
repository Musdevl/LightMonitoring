import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MetricService} from './services/metric-service';
import {timer } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy{
  protected title = 'frontend';

  metrics: any = {};

  constructor(private metricService : MetricService) {}

  ngOnInit() {
    // Création d'un intervalle qui émet toutes les 1500 ms
    timer(0, 10000).subscribe(val => {
      this.metricService.getMetrics().subscribe({
        next: data => {
          this.metrics = data;
          console.log("Données mises à jour", data);
        },
        error: err => {
          this.metrics = null;
          console.error("Erreur de récupération des métriques :", err);
        }
      });
    });
  }

  ngOnDestroy() {

  }


}
