import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataRepository } from '../service/data.repository';
import * as model from '../model/model';

@Component({ selector: 'div-evenements', templateUrl: './div-evenements.component.html', styleUrls: ['./div-evenements.component.css'] })
export class DivEvenementsComponent {

  filtre: model.Evenement = new model.Evenement();

  // Liste à afficher
  get evenements(): model.Evenement[] {
    return this.dataRepository.getFichierCharge().data.filter(
      eve => (!this.filtre.type || this.filtre.type == eve.type)
        && (!this.filtre.text || (eve.text && eve.text.toUpperCase().indexOf(this.filtre.text.toUpperCase()) > -1))
        && (!this.filtre.details || (eve.details && eve.details.toUpperCase().indexOf(this.filtre.details.toUpperCase()) > -1))
        && (!this.filtre.startDate || (eve.startDate && this.filtre.startDate < eve.startDate))
        && (!this.filtre.endDate || (eve.endDate && this.filtre.endDate > eve.endDate))
    );
  }

  // Element en cours d'édition
  evenementSelectionne: model.Evenement | undefined;

  get evenementSelectionneStartDate(): string {
    if (this.evenementSelectionne) {
      return this.evenementSelectionne.start_date;
    } else {
      return '';
    }
  }
  get evenementSelectionneEndDate(): string {
    if (this.evenementSelectionne) {
      return this.evenementSelectionne.end_date;
    } else {
      return '';
    }
  }
  set evenementSelectionneStartDate(value: string) {
    if (this.evenementSelectionne) {
      this.evenementSelectionne.start_date = value;
      this.evenementSelectionne.startDate = this.parseDate(value);
    }
  }
  set evenementSelectionneEndDate(value: string) {
    if (this.evenementSelectionne) {
      this.evenementSelectionne.end_date = value;
      this.evenementSelectionne.endDate = this.parseDate(value);
    }
  }

  // Types disponibles
  get types(): string[] {
    return ["", "messe", "priere", "reunion", "celeb"];
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

  changeDate(delta: number) {
    if (this.filtre.startDate) {
      const nouvelleDate = new Date();
      nouvelleDate.setTime(this.filtre.startDate.getTime() + (delta * 1000 * 3600 * 24));
      nouvelleDate.setHours(0, 0, 0, 0);
      this.filtre.startDate = nouvelleDate;
    }

    if (this.filtre.endDate) {
      const nouvelleDate = new Date();
      nouvelleDate.setTime(this.filtre.endDate.getTime() + (delta * 1000 * 3600 * 24));
      nouvelleDate.setHours(0, 0, 0, 0);
      this.filtre.endDate = nouvelleDate;
    }
  }

  private parseDate(chaine: string): Date | undefined {
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
