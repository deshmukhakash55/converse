import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BLOCK_COLLECTION } from 'src/converse/contacts/contact-constants';

type BlockEntity = {
	id: string;
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
		return this.getBlockEntitiesFor(blocker, blockee).pipe(
			map((blockEntities: { id: string }[]) =>
				blockEntities.length > 0 ? blockEntities[0].id : null
			)
		);
	}

	private getBlockEntitiesFor(
		blocker: string,
		blockee: string
	): Observable<BlockEntity[]> {
		return this.angularFirestore
			.collection<BlockEntity>(BLOCK_COLLECTION, (ref) =>
				ref
					.where('blocker', '==', blocker)
					.where('blockee', '==', blockee)
					.limit(1)
			)
			.valueChanges({ idField: 'id' });
	}
}
