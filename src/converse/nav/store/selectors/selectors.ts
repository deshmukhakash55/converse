import { NavStoreKey } from '../../nav-constants';
import { NavStoreState } from '../../nav-types';
import { createSelector } from '@ngrx/store';

const navStateSelector = (state) => state[NavStoreKey];

export const searchContacts = createSelector(
	navStateSelector,
	(state: NavStoreState) => state.searchContacts
);
