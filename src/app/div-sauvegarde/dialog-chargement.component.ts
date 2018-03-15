import { Component } from '@angular/core';
import { MatSnackBar, MatDialogRef } from '@angular/material';

import { SauvegardeService } from '../service/sauvegarde.service';

@Component({ selector: 'dialog-chargement', templateUrl: './dialog-chargement.component.html', styleUrls: ['./dialog-chargement.component.css'] })
export class DialogChargementComponent {

  // Données chargées depuis le chargement local
  jsonChargeDepuisFichierLocal: string;
  nomFichierLocal: string;

  // Un constructeur pour se faire injecter les dépendances
  constructor(private sauvegardeService: SauvegardeService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<DialogChargementComponent>) { }

  onSelectFichierLocal(event: any) {
    const input = event.target;

    // Lecture des données sur les navigateurs HTML5
    const fr = new FileReader();
    fr.onloadend = (e: any) => {
      this.jsonChargeDepuisFichierLocal = e.target['result'];
    };
    fr.readAsText(input.files[0]);
    this.nomFichierLocal = event.srcElement.value.substring(event.srcElement.value.lastIndexOf('/') + event.srcElement.value.lastIndexOf('\\') + 2);
  }

  // A la demande d'annulation
  onDemandeAnnulation() {
    this.dialogRef.close();
  }

  // A la demande de chargement
  onDemandeChargement() {
    // Si c'est un chargement local
    if (this.jsonChargeDepuisFichierLocal) {
      this.sauvegardeService.chargeDepuisText(this.nomFichierLocal, this.jsonChargeDepuisFichierLocal);
      this.dialogRef.close();
    }
  }
}
