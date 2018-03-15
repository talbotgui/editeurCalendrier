import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataRepository } from '../service/data.repository';
import * as model from '../model/model';

@Component({ selector: 'div-evenements', templateUrl: './div-evenements.component.html', styleUrls: ['./div-evenements.component.css'] })
export class DivEvenementsComponent {

  // Liste à afficher
  get evenements(): model.Evenement[] {
    return this.dataRepository.getFichierCharge().data;
  }

  // Element en cours d'édition
  evenementSelectionne: model.Evenement | undefined;

  // Types disponibles
  get types(): string[] {
    return ["messe", "priere"];
  }

  // Un constructeur pour se faire injecter les dépendances
  constructor(private dataRepository: DataRepository) { }

  editer(evenement: model.Evenement) {
    this.evenementSelectionne = evenement;
  }

  ajouter(): void {
    this.evenementSelectionne = new model.Evenement();
    this.evenements.push(this.evenementSelectionne);
  }

  supprimer(evenement: model.Evenement): void {
    const index = this.evenements.indexOf(evenement);
    if (0 <= index && index < this.evenements.length) {
      this.evenements.splice(index, 1);
    }
    this.evenementSelectionne = undefined;
  }

  private formatDate(date?: Date): string {
    if (date) {
      const j = this.formatNumber(date.getDate());
      const m = this.formatNumber(date.getMonth() + 1);
      const y = date.getFullYear();
      return j + '/' + m + '/' + y;
    } else {
      return '';
    }
  }
  private formatNumber(n: number): string {
    if (n < 10) {
      return '0' + n;
    } else {
      return '' + n;
    }
  }
}
