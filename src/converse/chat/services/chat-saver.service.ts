import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ChatSaverService {
	constructor(private angularFirestore: AngularFirestore) {}

	public sendMessage(
		from: string,
		to: string,
		message: string
	): Observable<any> {
		return of(
			this.angularFirestore.collection('chat').add({
				from,
				to,
				message,
				date: firebase.firestore.Timestamp.fromDate(new Date())
			})
		);
	}
}
