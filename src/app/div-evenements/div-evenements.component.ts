import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataRepository } from '../service/data.repository';
import * as model from '../model/model';

@Component({ selector: 'div-evenements', templateUrl: './div-evenements.component.html', styleUrls: ['./div-evenements.component.css'] })
export class DivEvenementsComponent {

  // Champs de filtrage
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

  // Element ajouté
  evenementAjoute: model.Evenement | undefined;


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

  changerDate(delta: number) {
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

  creer(): void {
    this.evenementAjoute = new model.Evenement();
    this.evenementAjoute.start_date = '//2018 :00:00';
    this.evenementAjoute.end_date = '//2018 :00:00';

    this.evenementSelectionne = undefined;
  }

  editer(evenement: model.Evenement) {
    this.evenementSelectionne = evenement;
  }

  inserer(): void {
    if (this.evenementAjoute) {
      this.dataRepository.getFichierCharge().data.push(this.evenementAjoute);
    }
    this.evenementAjoute = undefined;
  }

  supprimer(evenement: model.Evenement): void {
    this.evenementSelectionne = undefined;

    const liste = this.dataRepository.getFichierCharge().data;
    const index = liste.indexOf(evenement);
    if (0 <= index && index < liste.length) {
      liste.splice(index, 1);
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
}
