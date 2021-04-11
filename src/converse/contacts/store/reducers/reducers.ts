import { createReducer, on } from '@ngrx/store';
import {
	blockContactEnd, blockContactFailure, blockContactProgress,
	blockContactSuccess, loadContactsEnd, loadContactsFailure,
	loadContactsProgress, loadContactsSuccess, loadSingleContactEnd,
	loadSingleContactFailure, loadSingleContactProgress,
	loadSingleContactSuccess, reinitContactState, unblockContactEnd,
	unblockContactFailure, unblockContactProgress, unblockContactSuccess
} from '../actions/actions';
import { ContactStoreState } from '../../contact-types';
import {
	BlockContactFailurePayload, LoadedContactsFailurePayload,
	LoadedContactsSuccessPayload, LoadSingleContactSuccessPayload,
	UnblockContactFailurePayload
} from '../payload-types';

const initialState: ContactStoreState = {
	contacts: [],
	loadFailReason: '',
	isLoadContactsSuccess: false,
	isLoadContactsFailure: false,
	isLoadContactsProgress: false,
	isLoadSingleContactProgress: false,
	isLoadSingleContactSuccess: false,
	isLoadSingleContactFailure: false,
	loadSingleContactFailReason: '',
	isBlockContactProgress: false,
	isBlockContactSuccess: false,
	blockContactFailureReason: '',
	isUnblockContactProgress: false,
	isUnblockContactSuccess: false,
	unblockContactFailureReason: ''
};

export const reducer = createReducer(
	initialState,
	on(loadContactsProgress, (state: ContactStoreState) => ({
		...state,
		isLoadContactsProgress: true
	})),
	on(loadContactsEnd, (state: ContactStoreState) => ({
		...state,
		isLoadContactsProgress: false
	})),
	on(
		loadContactsSuccess,
		(
			state: ContactStoreState,
			loadedContactsSuccessPayload: LoadedContactsSuccessPayload
		) => ({
			...state,
			contacts: [...loadedContactsSuccessPayload.contacts],
			isLoadContactsSuccess: true,
			isLoadContactsFailure: false
		})
	),
	on(
		loadContactsFailure,
		(
			state: ContactStoreState,
			loadedContactsFailurePayload: LoadedContactsFailurePayload
		) => ({
			...state,
			loadFailReason: loadedContactsFailurePayload.reason,
			isLoadContactsSuccess: false,
			isLoadContactsFailure: true
		})
	),
	on(loadSingleContactProgress, (state: ContactStoreState) => ({
		...state,
		isLoadSingleContactProgress: true,
		isLoadSingleContactSuccess: false,
		isLoadSingleContactFailure: false,
		loadSingleContactFailReason: ''
	})),
	on(loadSingleContactEnd, (state: ContactStoreState) => ({
		...state,
		isLoadSingleContactProgress: false
	})),
	on(
		loadSingleContactSuccess,
		(
			state: ContactStoreState,
			loadSingleContactSuccessPayload: LoadSingleContactSuccessPayload
		) => ({
			...state,
			contacts: [
				loadSingleContactSuccessPayload.contact,
				...state.contacts
			],
			isLoadSingleContactFailure: false,
			isLoadSingleContactSuccess: true,
			loadSingleContactFailReason: ''
		})
	),
	on(
		loadSingleContactFailure,
		(
			state: ContactStoreState,
			loadSingleContactFailurePayload: LoadedContactsFailurePayload
		) => ({
			...state,
			isLoadSingleContactFailure: true,
			isLoadSingleContactSuccess: false,
			loadSingleContactFailReason: loadSingleContactFailurePayload.reason
		})
	),
	on(blockContactProgress, (state: ContactStoreState) => ({
		...state,
		isBlockContactProgress: true,
		isBlockContactSuccess: false,
		blockContactFailureReason: ''
	})),
	on(blockContactEnd, (state: ContactStoreState) => ({
		...state,
		isBlockContactProgress: false
	})),
	on(blockContactSuccess, (state: ContactStoreState) => ({
		...state,
		isBlockContactSuccess: true,
		blockContactFailureReason: ''
	})),
	on(
		blockContactFailure,
		(
			state: ContactStoreState,
			blockContactFailurePayload: BlockContactFailurePayload
		) => ({
			...state,
			isBlockContactSuccess: false,
			blockContactFailureReason: blockContactFailurePayload.reason
		})
	),
	on(unblockContactProgress, (state: ContactStoreState) => ({
		...state,
		isUnblockContactProgress: true,
		isUnblockContactSuccess: false,
		unblockContactFailureReason: ''
	})),
	on(unblockContactEnd, (state: ContactStoreState) => ({
		...state,
		isUnblockContactProgress: false
	})),
	on(unblockContactSuccess, (state: ContactStoreState) => ({
		...state,
		isUnblockContactSuccess: true,
		unblockContactFailureReason: ''
	})),
	on(
		unblockContactFailure,
		(
			state: ContactStoreState,
			unblockContactFailurePayload: UnblockContactFailurePayload
		) => ({
			...state,
			isUnblockContactSuccess: false,
			unblockContactFailureReason: unblockContactFailurePayload.reason
		})
	),
	on(reinitContactState, (state: ContactStoreState) => ({
		...initialState
	}))
);
