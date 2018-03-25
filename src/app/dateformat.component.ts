import { NativeDateAdapter } from '@angular/material';

/**
 * Adapter pour le format de date compatible avec la locale fr-FR.
 * { provide: LOCALE_ID, useValue: 'fr-FR' },
 * { provide: DateAdapter, useClass: MyDateAdapter },
 * @see https://stackoverflow.com/questions/44201050/how-to-implement-md-date-formats-for-datepicker
 */
export class MyDateAdapter extends NativeDateAdapter {
    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            if (str.length === 3) {
                const strHeure = str[2].split('[ :]');
                const date = new Date(Number(strHeure[0]), Number(str[1]) - 1, Number(str[0]), 12);
                if (strHeure.length == 1) {
                    date.setHours(0, 0, 0, 0);
                } else {
                    date.setHours(Number(strHeure[1]), Number(strHeure[2]), 0, 0);
                }
                return date;
            } else {
                return null;
            }
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
}