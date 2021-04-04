import {
	BlockContactFailurePayload, BlockContactStartPayload,
	LoadedContactsFailurePayload, LoadedContactsStartPayload,
	LoadedContactsSuccessPayload, LoadSingleContactFailurePayload,
	LoadSingleContactStartPayload, LoadSingleContactSuccessPayload,
	UnblockContactFailurePayload, UnblockContactStartPayload
} from '../payload-types';
import * as actionTypes from './action-types';
import { createAction, props } from '@ngrx/store';

export const loadContactsStart = createAction(
	actionTypes.LOAD_CONTACTS_START,
	props<LoadedContactsStartPayload>()
);
export const loadContactsEnd = createAction(actionTypes.LOAD_CONTACTS_END);
export const loadContactsSuccess = createAction(
	actionTypes.LOAD_CONTACTS_SUCCESS,
	props<LoadedContactsSuccessPayload>()
);
export const loadContactsFailure = createAction(
	actionTypes.LOAD_CONTACTS_FAILURE,
	props<LoadedContactsFailurePayload>()
);
export const loadContactsProgress = createAction(
	actionTypes.LOAD_CONTACTS_PROGRESS
);

export const loadSingleContactStart = createAction(
	actionTypes.LOAD_SINGLE_CONTACT_START,
	props<LoadSingleContactStartPayload>()
);
export const loadSingleContactProgress = createAction(
	actionTypes.LOAD_SINGLE_CONTACT_PROGRESS
);
export const loadSingleContactEnd = createAction(
	actionTypes.LOAD_SINGLE_CONTACT_END
);
export const loadSingleContactSuccess = createAction(
	actionTypes.LOAD_SINGLE_CONTACT_SUCCESS,
	props<LoadSingleContactSuccessPayload>()
);
export const loadSingleContactFailure = createAction(
	actionTypes.LOAD_SINGLE_CONTACT_FAILURE,
	props<LoadSingleContactFailurePayload>()
);

export const blockContactStart = createAction(
	actionTypes.BLOCK_CONTACT_START,
	props<BlockContactStartPayload>()
);
export const blockContactEnd = createAction(actionTypes.BLOCK_CONTACT_END);
export const blockContactProgress = createAction(
	actionTypes.BLOCK_CONTACT_PROGRESS
);
export const blockContactSuccess = createAction(
	actionTypes.BLOCK_CONTACT_SUCCESS
);
export const blockContactFailure = createAction(
	actionTypes.BLOCK_CONTACT_FAILURE,
	props<BlockContactFailurePayload>()
);

export const unblockContactStart = createAction(
	actionTypes.UNBLOCK_CONTACT_START,
	props<UnblockContactStartPayload>()
);
export const unblockContactEnd = createAction(actionTypes.UNBLOCK_CONTACT_END);
export const unblockContactProgress = createAction(
	actionTypes.UNBLOCK_CONTACT_PROGRESS
);
export const unblockContactSuccess = createAction(
	actionTypes.UNBLOCK_CONTACT_SUCCESS
);
export const unblockContactFailure = createAction(
	actionTypes.UNBLOCK_CONTACT_FAILURE,
	props<UnblockContactFailurePayload>()
);

export const reinitContactState = createAction(
	actionTypes.REINIT_CONTACT_STATE
);
