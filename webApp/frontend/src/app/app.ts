import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MetricService} from './services/metric-service';
import {interval } from 'rxjs';

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

  getMetric(){
    return this.metricService.getMetrics();
  }


  ngOnInit() {
    // Création d'un intervalle qui émet toutes les 1500 ms
    this.intervalSub = interval(1500).subscribe(() => {
      this.metricService.getMetrics().subscribe({
        next: data => {
          this.metrics = data;
          console.log("Données mises à jour", data);
        },
        error: err => {
          console.error("Erreur de récupération des métriques :", err);
        }
      });
    });
  }

  ngOnDestroy() {
    // Important pour éviter les fuites de mémoire
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }


}
