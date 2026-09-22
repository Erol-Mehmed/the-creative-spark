import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IMainState } from './index';

const selectMainSelector = createFeatureSelector<IMainState>('main');

export const selectCurrentModalVersion = createSelector(
  selectMainSelector,
  (s) => s.currentModalVersion,
);
