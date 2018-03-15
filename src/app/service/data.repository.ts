import { Injectable } from '@angular/core';

import * as model from '../model/model';

@Injectable()
export class DataRepository {

  private fichierCharge: model.Fichier;

  isFichierCharge(): boolean {
    return !!this.fichierCharge;
  }

  getFichierCharge(): model.Fichier {
    if (!this.fichierCharge) {
      this.fichierCharge = new model.Fichier();
    }
    return this.fichierCharge;
  }

  setFichierCharge(fichier: model.Fichier): void {
    this.fichierCharge = fichier;
  }

}
