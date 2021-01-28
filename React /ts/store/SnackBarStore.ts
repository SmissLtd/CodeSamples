import { action, observable } from 'mobx';
import { RootStore } from '../../../rootStore';

export interface SnackBarOptions {
  open: boolean;
  severity: SnackBarSeverity;
  message: string;
}

export type SnackBarSeverity =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | undefined;

export default class SnackBarStore {
  @observable snackBarOptions: SnackBarOptions = {
    open: false,
    severity: undefined,
    message: '',
  };
  rootStore: RootStore;

  constructor(RootStore: RootStore) {
    this.rootStore = RootStore;
  }

  @action showSnackBar = (
    message: string,
    severity: SnackBarSeverity,
  ): void => {
    this.snackBarOptions = {
      open: true,
      severity: severity,
      message: message,
    };
  };

  @action closeSnackBar = (): void => {
    this.snackBarOptions = { open: false, message: '', severity: undefined };
  };
}
