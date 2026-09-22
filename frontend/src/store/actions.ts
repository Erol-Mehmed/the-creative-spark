import { createAction, props } from '@ngrx/store';

const actionTypes = {
  setModalVersion: 'SET_MODAL_VERSION',
};

export const setModalVersion = createAction(
  actionTypes.setModalVersion,
  props<{ currentModalVersion: string }>(),
);
