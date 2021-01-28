import { action, observable } from 'mobx';
import { validationTypes } from '../../../const/validationTypes';
import { RootStore } from '../../../rootStore';
import { AuthService } from '../../../services/http';
import { Field, User } from '../../../shared/types';

interface LoginFields {
  [key: string]: Field;
}
class LoginStore {
  rootStore: RootStore;

  @observable loginSubmitting: boolean;
  @observable loginFields: LoginFields = {
    email: new Field('email', true, validationTypes.EMAIL, 'email'),
    password: new Field('password', true, validationTypes.VALUE_LENGTH, 'password'),
  };

  @observable loginError: string | null;
  @observable invitationId = '';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.loginSubmitting = false;
    this.loginError = null;
  }

  @action async submitAndLogin(): Promise<User | void> {
    try {
      this.loginSubmitting = true;
      this.setError(null);
      if (!this.isLoginFormValid()) return this.onShowErrors();

      const user = await AuthService.login(
        this.loginFields.email.value,
        this.loginFields.password.value,
        this.invitationId,
      );
      this.rootStore.userStore.token = user.token;
      await this.rootStore.userStore.login(user);

      return user;
    } catch (error) {
      if (error) {
        const { response } = error;
        this.setError(response.data.message);
      }
      return;
    } finally {
      this.loginSubmitting = false;
    }
  }

  private setError(error: string | null): void {
    this.loginError = error;
  }
  @action async getInviteById(id: string): Promise<User> {
    const user = await AuthService.getInviteById(id);
    this.loginFields.email.onChange({ target: { value: user.email } });
    this.invitationId = id;
    return user;
  }
  private clearError = (): void => {
    Object.keys(this.loginFields).map((item: keyof LoginFields) => (this.loginFields[item].error = ''));
  };

  @action resetForm(): void {
    this.clearError();

    Object.keys(this.loginFields).map((item: keyof LoginFields) => (this.loginFields[item].value = ''));
  }

  private onShowErrors(): void {
    Object.keys(this.loginFields).map((item: keyof LoginFields) => (this.loginFields[item].showError = true));
  }

  private isLoginFormValid(): boolean {
    return !Object.values(this.loginFields).some(field => !!field.error);
  }
}

export default LoginStore;
