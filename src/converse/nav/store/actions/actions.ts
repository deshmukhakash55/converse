import {
	SearchContactsFailurePayload, SearchContactsStartPayload,
	SearchContactsSuccessPayload
} from '../payload-types';
import * as actionTypes from './action-types';
import { createAction, props } from '@ngrx/store';

export const searchContactsStart = createAction(
	actionTypes.SEARCH_CONTACTS_START,
	props<SearchContactsStartPayload>()
);

export const searchContactsProgress = createAction(
	actionTypes.SEARCH_CONTACTS_PROGRESS
);

export const searchContactsEnd = createAction(actionTypes.SEARCH_CONTACTS_END);

export const searchContactsSuccess = createAction(
	actionTypes.SEARCH_CONTACTS_SUCCESS,
	props<SearchContactsSuccessPayload>()
);

export const searchContactsFailure = createAction(
	actionTypes.SEARCH_CONTACTS_FAILURE,
	props<SearchContactsFailurePayload>()
);

export const reinitNavState = createAction(actionTypes.REINIT_NAV_STATE);
