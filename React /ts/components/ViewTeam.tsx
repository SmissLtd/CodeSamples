import React, { ReactElement, useContext } from 'react';
import classnames from 'classnames';

import styles from './viewTeam.module.scss';

import { RootStoreContext } from '../../../../rootStore';

export default function ViewTeam(): ReactElement {
  const { teamStore } = useContext(RootStoreContext);

  return (
    <div className={styles.viewTeam}>
      {teamStore.teamsList.map(team => (
        <div
          key={team.id}
          className={classnames(styles.team, team.select ? styles.select : '')}
          onClick={(): void => {
            teamStore.selectTeam(team.id);
          }}
        >
          {team.name}
        </div>
      ))}
    </div>
  );
}
