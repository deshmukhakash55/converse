import { from } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { LOAD_CHAT_START } from '../../../chat/store/actions/action-types';
import { Contact } from '../../contact-types';
import * as actionTypes from '../actions/action-types';
import {
	blockContactEnd, blockContactFailure, loadContactsEnd, loadContactsFailure,
	loadSingleContactEnd, loadSingleContactFailure, unblockContactEnd,
	unblockContactFailure
} from '../actions/actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContactBlockService } from '../../services/contact-block.service';
import { ContactsLoaderService } from '../../services/contacts-loader.service';
import {
	SingleContactLoaderService
} from '../../services/single-contact-loader.service';

@Injectable()
export class ContactEffects {
	constructor(
		private actions: Actions,
		private contactsLoaderService: ContactsLoaderService,
		private singleContactLoaderService: SingleContactLoaderService,
		private contactBlockService: ContactBlockService
	) {}

	public loadContactsStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.LOAD_CONTACTS_START),
			switchMap(({ loggedInEmail }) =>
				this.contactsLoaderService.loadContactsFor(loggedInEmail).pipe(
					mergeMap((contacts: Contact[]) => [
						{
							type: actionTypes.LOAD_CONTACTS_SUCCESS,
							contacts
						},
						{
							type: actionTypes.LOAD_CONTACTS_END
						}
					]),
					catchError((error) =>
						from([
							loadContactsFailure({ reason: error.message }),
							loadContactsEnd()
						])
					)
				)
			)
		)
	);

	public loadSingleContactStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.LOAD_SINGLE_CONTACT_START),
			switchMap(({ searchContact, loggedInEmail }) =>
				this.singleContactLoaderService
					.loadSingleContactDetailsFor(searchContact, loggedInEmail)
					.pipe(
						mergeMap((contact: Contact) => [
							{
								type: actionTypes.LOAD_SINGLE_CONTACT_SUCCESS,
								contact
							},
							{
								type: actionTypes.LOAD_SINGLE_CONTACT_END
							},
							{
								type: LOAD_CHAT_START,
								recipientEmail: loggedInEmail,
								senderEmail: contact.email
							}
						]),
						catchError((error: any) =>
							from([
								loadSingleContactFailure({
									reason: error.message
								}),
								loadSingleContactEnd()
							])
						)
					)
			)
		)
	);

	public blockContactStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.BLOCK_CONTACT_START),
			switchMap(({ loggedInEmail, email }) =>
				this.contactBlockService
					.blockContact(email, loggedInEmail)
					.pipe(
						mergeMap((_: any) => [
							{
								type: actionTypes.BLOCK_CONTACT_SUCCESS
							},
							{
								type: actionTypes.BLOCK_CONTACT_END
							},
							{
								type: actionTypes.LOAD_CONTACTS_START,
								loggedInEmail
							}
						]),
						catchError((error: any) =>
							from([
								blockContactFailure({ reason: error.message }),
								blockContactEnd()
							])
						)
					)
			)
		)
	);

	public unblockContactStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.UNBLOCK_CONTACT_START),
			switchMap(({ blockChatId, loggedInEmail }) =>
				this.contactBlockService.unblockContact(blockChatId).pipe(
					mergeMap(() => [
						{
							type: actionTypes.UNBLOCK_CONTACT_SUCCESS
						},
						{
							type: actionTypes.UNBLOCK_CONTACT_END
						},
						{
							type: actionTypes.LOAD_CONTACTS_START,
							loggedInEmail
						}
					]),
					catchError((error: any) =>
						from([
							unblockContactFailure({ reason: error.message }),
							unblockContactEnd()
						])
					)
				)
			)
		)
	);
}
