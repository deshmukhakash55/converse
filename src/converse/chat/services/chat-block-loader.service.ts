import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

type BlockEntity = {
	blocker: string;
	blockee: string;
};

@Injectable()
export class ChatBlockLoaderService {
	constructor(private angularFirestore: AngularFirestore) {}

	public isChatBlockedFor(
		blocker: string,
		blockee: string
	): Observable<string> {
		return this.angularFirestore
			.collection('block', (ref) =>
				ref
					.where('blocker', '==', blocker)
					.where('blockee', '==', blockee)
					.limit(1)
			)
			.valueChanges({ idField: 'id' })
			.pipe(
				map((blockEntities: { id: string }[]) =>
					blockEntities.length > 0 ? blockEntities[0].id : null
				)
			);
	}
}
