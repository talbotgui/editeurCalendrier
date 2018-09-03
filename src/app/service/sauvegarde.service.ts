import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { MatSnackBar } from '@angular/material';

import { saveAs } from 'file-saver';

import * as model from '../model/model';
import { DataRepository } from '../service/data.repository';

@Injectable()
export class SauvegardeService {

  constructor(private dataRepository: DataRepository) { }

  chargeDepuisText(nomFichier: string, contenu: string): void {
    // Parse du JSON
    let objet: any;
    try {
      objet = JSON.parse(contenu);
    } catch (error) {
      console.error(error);
      return;
    }

    // Sauvegarde de l'instance dans le service DataService
    this.dataRepository.setFichierCharge(objet);
  }

  sauvegardeParTelechargement(): void {

    // Modification de la date de mise à jour
    // Et suppression des attributs en trop
    const formatNombre = (n: number): string => { return (n < 10) ? ('0' + n) : '' + n; }
    const dateCourante = new Date();

    // Clone de la structure avant modification pour sauvegarde
    const original = this.dataRepository.getFichierCharge()
    const copie: model.Fichier = JSON.parse(JSON.stringify(original));

    copie.data.forEach(e => {
      if (e.type === 'maj') {
        e.start_date = formatNombre(dateCourante.getDate()) + '/' + formatNombre(dateCourante.getMonth() + 1) + '/' + dateCourante.getFullYear();
      }
      delete e.modifie;
      delete e.startDate;
      delete e.endDate;
    });

    // Préparation des données
    const nomDuFichier = "calendrier.json";
    const contenuFichier = JSON.stringify(Object.assign({}, copie), null, 2);
    const leBlob = new Blob([contenuFichier], { type: 'text/plain;charset=utf-8' });
    const resultat = { nomFichier: nomDuFichier, blob: leBlob };

    // Appel à saveAs pour déclencher le téléchargement dans le navigateur
    saveAs(resultat.blob, resultat.nomFichier);

  }
}
