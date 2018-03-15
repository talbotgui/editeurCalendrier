import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DialogChargementComponent } from './dialog-chargement.component';
import { DataRepository } from '../service/data.repository';
import { SauvegardeService } from '../service/sauvegarde.service';

@Component({ selector: 'div-sauvegarde', templateUrl: './div-sauvegarde.component.html', styleUrls: ['./div-sauvegarde.component.css'] })
export class DivSauvegardeComponent {

  constructor(private dialog: MatDialog, private dataRepository: DataRepository, private sauvegardeService: SauvegardeService) { }

  // A la demande de chargement d'un fichier
  ouvreDialogChargement() {
    this.dialog.open(DialogChargementComponent, { height: '120px', width: '300px' });
  }

  // A la demande de sauvegarde par téléchargement d'un fichier local
  sauvegardeLesDonnees() {
    this.sauvegardeService.sauvegardeParTelechargement();
  }


  // Condition d'affichage des boutons
  get fichierCharge() {
    return this.dataRepository.isFichierCharge();
  }
}
