import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BLOCK_COLLECTION } from '../contact-constants';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ContactBlockService {
	constructor(private angularFirestore: AngularFirestore) {}

	public blockContact(
		email: string,
		loggedInEmail: string
	): Observable<string> {
		return of(
			this.angularFirestore.collection(BLOCK_COLLECTION).add({
				blocker: loggedInEmail,
				blockee: email,
				date: firebase.firestore.Timestamp.fromDate(new Date())
			})
		).pipe(map((_: any) => loggedInEmail));
	}

	public unblockContact(blockChatId: string): Observable<void> {
		return from(
			this.angularFirestore
				.collection(BLOCK_COLLECTION)
				.doc(blockChatId)
				.delete()
		);
	}
}
