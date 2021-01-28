import React, { Component, ReactElement } from 'react';
import { observer } from 'mobx-react';

import styles from './StatusOfTeamPage.module.scss';

import { RootStore, RootStoreContext } from '../../rootStore';
import TeamTable from './components/TeamTable';
import { InputField, Select, SelectOptions } from '../../shared/components';
import ViewTeam from './components/ViewTeam';
import { viewTypes } from '../../shared/types';

@observer
class StatusOfTeamPage extends Component {
  static contextType = RootStoreContext;
  rootStore: RootStore = this.context;

  componentDidMount(): void {
    this.rootStore.teamStore.updateTeamMembers();
  }

  onSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { teamStore } = this.rootStore;
    teamStore.changeFilter(event.target.value);
  };

  selectOptions = (): Array<SelectOptions> =>
    [viewTypes.ALL, viewTypes.TEAM].map(type => ({
      value: type,
      text: type,
    }));

  render(): ReactElement {
    const {
      teamStore,
      i18nStore: { t },
    } = this.rootStore;

    return (
      <div className={styles.statusOfTeamContainer}>
        <div className={styles.inputsContainer}>
          <div className={styles.filterInput}>
            <InputField
              placeholder={t(`dashboard.header.searchUser`)}
              onChange={this.onSearchChange}
              value={teamStore.filter}
            />
          </div>
          <div className={styles.selectContainer}>
            <Select
              onChange={teamStore.changeType}
              value={teamStore.viewType}
              variant="outlined"
              options={this.selectOptions()}
            />
          </div>
        </div>
        {teamStore.viewType === viewTypes.TEAM && <ViewTeam />}
        <TeamTable teamMembers={teamStore.teamMembers} />
      </div>
    );
  }
}
export default StatusOfTeamPage;
