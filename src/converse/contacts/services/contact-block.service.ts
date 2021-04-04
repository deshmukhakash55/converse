import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ContactBlockService {
	constructor(private angularFirestore: AngularFirestore) {}

	public blockContact(email: string, loggedInEmail: string): Observable<any> {
		return of(
			this.angularFirestore.collection('block').add({
				blocker: loggedInEmail,
				blockee: email,
				date: firebase.firestore.Timestamp.fromDate(new Date())
			})
		);
	}

	public unblockContact(blockChatId: string): Observable<void> {
		return from(
			this.angularFirestore.collection('block').doc(blockChatId).delete()
		);
	}
}
