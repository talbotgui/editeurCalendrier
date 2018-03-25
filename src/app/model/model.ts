
export class Fichier {
	commentaires: string[];
	data: Evenement[]
}

export class Evenement {
	start_date: string; end_date: string;
	startDate: Date | undefined; endDate: Date | undefined;
	text: string; details: string; type: string;
	modifie = false;
}
