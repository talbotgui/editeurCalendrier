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

    // Modification du type
    fichier.data.forEach(e => {
      if (e.start_date) { e.startDate = this.parseDate(e.start_date); }
      if (e.end_date) { e.endDate = this.parseDate(e.end_date); }
    });

    this.fichierCharge = fichier;
  }

  parseDate(chaine: string): Date | undefined {
    if (!chaine || chaine == '') {
      return undefined;
    }

    const str = chaine.split('/');
    const str2 = str[2].split(' ');
    const date = new Date(Number(str2[0]), Number(str[1]) - 1, Number(str[0]));

    if (str2.length != 2) {
      date.setHours(0, 0, 0, 0);
    } else {
      const str3 = str2[1].split(':');
      date.setHours(Number(str3[0]), Number(str3[1]), 0, 0);
    }

    return date;
  }

}
