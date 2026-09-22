import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { setModalVersion } from './actions';

export interface IMainState {
  currentModalVersion: string;
}

interface IAppState {
  main: IMainState;
}

const mainInitialState: IMainState = {
  currentModalVersion: '',
};

const MainReducer = createReducer<IMainState>(
  mainInitialState,
  on(setModalVersion, (state, action): IMainState => {
    const { currentModalVersion } = action;
    return { ...state, currentModalVersion: currentModalVersion };
  }),
);

export const reducers: ActionReducerMap<IAppState> = {
  main: MainReducer,
};
