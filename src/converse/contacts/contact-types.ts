import { Contact } from './store/payload-types';

export type ContactStoreState = {
	contacts: Contact[];
	loadFailReason: string;
	isLoadContactsProgress: boolean;
	isLoadContactsSuccess: boolean;
	isLoadContactsFailure: boolean;
	isLoadSingleContactProgress: boolean;
	isLoadSingleContactSuccess: boolean;
	isLoadSingleContactFailure: boolean;
	loadSingleContactFailReason: string;
	isBlockContactProgress: boolean;
	isBlockContactSuccess: boolean;
	blockContactFailureReason: string;
	isUnblockContactProgress: boolean;
	isUnblockContactSuccess: boolean;
	unblockContactFailureReason: string;
};
