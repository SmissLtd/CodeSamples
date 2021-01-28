import { observable, action, reaction, computed } from 'mobx';

import { RootStore } from '../../../rootStore';
import { UserDetails, MyProfileDetails } from '../../types';
import { UserService } from '../../../services/http';

export enum ProfileSideBarTypes {
  OWN_PROFILE,
  OTHER_USER_PROFILE,
}

export type Profile = UserDetails | MyProfileDetails | null;

export default class UIStore {
  @observable private currentUserId: number | null = null;
  @observable currentProfile: Profile = null;
  @observable isEditUserModalOpen = false;

  constructor(public rootStore: RootStore) {
    reaction(
      () => this.currentUserId,
      async (userId: number | null) => {
        if (this.profileSideBarType === ProfileSideBarTypes.OWN_PROFILE) {
          this.currentProfile = null;
          this.currentProfile = await rootStore.userStore.fetchMyProfile();
        } else if (userId) {
          this.currentProfile = null;
          this.currentProfile = await UserService.getUser(userId);
        } else {
          this.currentProfile = null;
        }
      },
    );
    reaction(
      () => this.currentProfile,
      currentProfile => {
        currentProfile &&
          (rootStore.userStore.currentProfile = this.currentProfile);
      },
    );
  }

  @action openProfileSideBar = (userId: number): void => {
    this.currentUserId = userId;
  };

  @action closeProfileSideBar = (): void => {
    this.currentUserId = null;
  };

  @action openEditUserModal = (): void => {
    this.isEditUserModalOpen = true;
    this.closeProfileSideBar();
  };

  @action closeEditUserModal = (): void => {
    this.isEditUserModalOpen = false;
    this.rootStore.userStore.currentProfile = null;
  };

  @computed get profileSideBarType(): ProfileSideBarTypes | null {
    switch (this.currentUserId) {
      case null:
        return null;
      case this.rootStore.userStore.user?.id:
        return ProfileSideBarTypes.OWN_PROFILE;
      default:
        return ProfileSideBarTypes.OTHER_USER_PROFILE;
    }
  }

  @computed get showProfileSideBar(): boolean {
    return !!this.currentProfile;
  }
}
