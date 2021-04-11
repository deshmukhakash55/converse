import { from } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContactSearchService } from '../../services/contact-search.service';
import { searchContactsEnd, searchContactsFailure } from '../actions/actions';
import { SearchContact } from '../../nav-types';
import * as actionTypes from '../actions/action-types';

@Injectable()
export class NavEffects {
	constructor(
		private actions: Actions,
		private contactSearchService: ContactSearchService
	) {}

	public searchContactsStart = createEffect(() =>
		this.actions.pipe(
			ofType(actionTypes.SEARCH_CONTACTS_START),
			switchMap(({ searchText }) =>
				this.contactSearchService.searchContactsBy(searchText).pipe(
					mergeMap((searchContacts: SearchContact[]) => [
						{
							type: actionTypes.SEARCH_CONTACTS_SUCCESS,
							searchContacts
						},
						{
							type: actionTypes.SEARCH_CONTACTS_END
						}
					]),
					catchError((error: any) =>
						from([
							searchContactsFailure({ reason: error.message }),
							searchContactsEnd()
						])
					)
				)
			)
		)
	);
}
