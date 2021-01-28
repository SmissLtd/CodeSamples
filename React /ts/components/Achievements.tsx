import React, { FunctionComponent } from 'react';
import AchievementsHeader from './components/AchievementsHeader';
import AchievementsPage from './components/AchievementsPage';
import UsersPage from './components/UsersPage';
import {
  EditAchievementModal,
  AddAchievementModal,
  EditUserModal,
} from './components/AchievementModals';
import styles from './Achievements.module.scss';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';

import { achievementsRoutes } from '../../const/routes';
import CreateAchievementMobile from './components/AchievementModals/components/CreateAchievementMobile';
import AddAchievementMobile from './components/AchievementModals/components/AddAchievementMobile';
import EditUserMobile from './components/AchievementModals/components/EditUserMobile';
import EditAchievementMobile from './components/AchievementModals/components/EditAchievementMobile';

const Achievements: FunctionComponent<RouteComponentProps> = ({
  match: { path },
}) => {
  return (
    <div className={styles.achievements}>
      <Switch>
        <Redirect exact from={path} to={path + achievementsRoutes.LIST} />
        <Route
          exact
          path={path + achievementsRoutes.LIST}
          component={AchievementsPage}
        />
        <Route
          exact
          path={path + achievementsRoutes.USERS}
          component={UsersPage}
        />
        <Route
          exact
          path={
            path +
            achievementsRoutes.MOBILE +
            achievementsRoutes.CREATE_ACHIEVEMENT
          }
        >
          <CreateAchievementMobile />
        </Route>
        <Route
          exact
          path={
            path +
            achievementsRoutes.MOBILE +
            achievementsRoutes.EDIT_ACHIEVEMENT
          }
        >
          <EditAchievementMobile />
        </Route>
        <Route
          exact
          path={
            path +
            achievementsRoutes.MOBILE +
            achievementsRoutes.ADD_ACHIEVEMENT
          }
        >
          <AddAchievementMobile />
        </Route>
        <Route
          exact
          path={path + achievementsRoutes.MOBILE + achievementsRoutes.EDIT_USER}
        >
          <EditUserMobile />
        </Route>
      </Switch>
      <EditAchievementModal />
      <AddAchievementModal />
      <EditUserModal />
    </div>
  );
};

export default Achievements;
