import { Component } from '@angular/core';

import { SauvegardeService } from './service/sauvegarde.service';
import { DataRepository } from './service/data.repository';

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent {

  constructor(private sauvegardeService: SauvegardeService, private dataRepository: DataRepository) { }

  get donneesChargees() {
    return this.dataRepository.isFichierCharge();
  }
}
