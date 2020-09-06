import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataRepository } from '../service/data.repository';
import * as model from '../model/model';

@Component({ selector: 'div-evenements', templateUrl: './div-evenements.component.html', styleUrls: ['./div-evenements.component.css'] })
export class DivEvenementsComponent implements OnInit {

  // Champs de filtrage
  filtre: model.Evenement = new model.Evenement();

  // Liste à afficher
  evenements: model.Evenement[] = [];

  // Element ajouté
  evenementAjoute: model.Evenement | undefined;

  // Element en cours d'édition
  evenementSelectionne: model.Evenement | undefined;

  // Tri
  filtreChamp: string | undefined;
  filtreOrdre: boolean = false;

  ngOnInit(): void {
    // raffraichissement de la liste
    this.listerLesEvenements();
  }

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
      const laDate = this.parseDate(value);
      if (laDate) {
        this.evenementSelectionne.start_date = value;
        this.evenementSelectionne.startDate = laDate;
      }
    }
  }
  set evenementSelectionneEndDate(value: string) {
    if (this.evenementSelectionne) {
      const laDate = this.parseDate(value);
      if (laDate) {
        this.evenementSelectionne.end_date = value;
        this.evenementSelectionne.endDate = laDate;
      }
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

    // raffraichissement de la liste
    this.listerLesEvenements();
  }

  dupliquerEvenementRecurent(evenement: model.Evenement, delta: number): void {
    console.debug(evenement)
    if (evenement && evenement.startDate) {
      this.evenementAjoute = new model.Evenement();
      this.evenementAjoute.details = evenement.details;
      this.evenementAjoute.text = evenement.text;
      this.evenementAjoute.type = evenement.type;
      this.evenementAjoute.modifie = true;

      this.evenementAjoute.startDate = new Date();
      this.evenementAjoute.startDate.setTime(evenement.startDate.getTime() + (delta * 1000 * 3600 * 24));
      this.evenementAjoute.start_date = this.dataRepository.toDate(this.evenementAjoute.startDate);
      if (evenement.endDate) {
        this.evenementAjoute.endDate = new Date();
        this.evenementAjoute.endDate.setTime(evenement.endDate.getTime() + (delta * 1000 * 3600 * 24));
        this.evenementAjoute.end_date = this.dataRepository.toDate(this.evenementAjoute.endDate);
      }

      console.debug(evenement.start_date + '=>' + this.evenementAjoute.start_date);
      this.dataRepository.getFichierCharge().data.push(this.evenementAjoute);

      this.evenementSelectionne = this.evenementAjoute;
      this.evenementAjoute = undefined;
    }

    // raffraichissement de la liste
    this.listerLesEvenements();
  }

  creer(): void {
    this.evenementAjoute = new model.Evenement();
    this.evenementAjoute.start_date = '//2021 :00:00';
    this.evenementAjoute.modifie = true;

    this.evenementSelectionne = undefined;
  }

  editer(evenement: model.Evenement) {
    this.evenementSelectionne = evenement;
    this.evenementSelectionne.modifie = true;
  }

  inserer(): void {
    if (this.evenementAjoute) {
      this.evenementAjoute.startDate = this.dataRepository.parseDate(this.evenementAjoute.start_date);
      this.dataRepository.getFichierCharge().data.push(this.evenementAjoute);
    }
    this.evenementAjoute = undefined;

    // raffraichissement de la liste
    this.listerLesEvenements();
  }

  listerLesEvenements(): void {
    const liste = this.dataRepository.getFichierCharge().data.filter(
      eve => eve.type !== 'maj'
        && (!this.filtre.type || this.filtre.type == eve.type)
        && (!this.filtre.text || (eve.text && eve.text.toUpperCase().indexOf(this.filtre.text.toUpperCase()) > -1))
        && (!this.filtre.details || (eve.details && eve.details.toUpperCase().indexOf(this.filtre.details.toUpperCase()) > -1))
        && (!this.filtre.startDate || (eve.startDate && this.filtre.startDate <= eve.startDate))
        && (!this.filtre.endDate || (eve.startDate && eve.startDate <= this.filtre.endDate))
    ).sort((a: model.Evenement, b: model.Evenement): number => {
      let valeur = -1;
      if (this.filtreChamp === 'debut' && a.startDate && b.startDate) {
        valeur = a.startDate.getTime() - b.startDate.getTime();
      } else if (this.filtreChamp === 'type' && a.type && b.type) {
        valeur = a.type.localeCompare(b.type);
      } else if (this.filtreChamp === 'texte' && a.text && b.text) {
        valeur = a.text.localeCompare(b.text);
      } else if (this.filtreChamp === 'details' && a.details && b.details) {
        valeur = a.details.localeCompare(b.details);
      }
      if (this.filtreOrdre) {
        valeur *= -1;
      }
      return valeur;
    });
    this.evenements = liste;
  }

  supprimer(evenement: model.Evenement): void {
    this.evenementSelectionne = undefined;

    const liste = this.dataRepository.getFichierCharge().data;
    const index = liste.indexOf(evenement);
    if (0 <= index && index < liste.length) {
      liste.splice(index, 1);
    }

    // raffraichissement de la liste
    this.listerLesEvenements();
  }

  trier(valeur: string): void {
    if (this.filtreChamp === valeur) {
      this.filtreOrdre = !this.filtreOrdre;
    } else {
      this.filtreOrdre = true;
    }
    this.filtreChamp = valeur;

    // raffraichissement de la liste
    this.listerLesEvenements();
  }

  private parseDate(chaine: string): Date | undefined {
    if (!chaine || chaine == '') {
      return undefined;
    }
    const regex = new RegExp("^[0-9]?[0-9]/[0-9]?[0-9]/[0-9][0-9][0-9][0-9] ([0-9]?[0-9]:[0-9]?[0-9]:[0-9]?[0-9])?$");
    if (!regex.test(chaine)) {
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
