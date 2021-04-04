import { NavStoreState } from '../../nav-types';
import {
	reinitNavState, searchContactsEnd, searchContactsFailure,
	searchContactsProgress, searchContactsSuccess
} from '../actions/actions';
import {
	SearchContactsFailurePayload, SearchContactsSuccessPayload
} from '../payload-types';
import { createReducer, on } from '@ngrx/store';

const initialState: NavStoreState = {
	searchContacts: [],
	isSearchContactsProgress: false,
	searchContactsFailureReason: ''
};

export const reducer = createReducer(
	initialState,
	on(searchContactsProgress, (state: NavStoreState) => ({
		...state,
		isSearchContactsProgress: true,
		searchContactsFailureReason: ''
	})),
	on(searchContactsEnd, (state: NavStoreState) => ({
		...state,
		isSearchContactsProgress: false
	})),
	on(
		searchContactsSuccess,
		(
			state: NavStoreState,
			searchContactsSuccessPayload: SearchContactsSuccessPayload
		) => ({
			...state,
			searchContacts: [...searchContactsSuccessPayload.searchContacts],
			searchContactsFailureReason: ''
		})
	),
	on(
		searchContactsFailure,
		(
			state: NavStoreState,
			searchContactsFailurePayload: SearchContactsFailurePayload
		) => ({
			...state,
			searchContacts: [],
			searchContactsFailureReason: searchContactsFailurePayload.reason
		})
	),
	on(reinitNavState, (state: NavStoreState) => ({
		...initialState
	}))
);
