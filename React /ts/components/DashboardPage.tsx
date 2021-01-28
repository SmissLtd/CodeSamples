import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';

import DashboardHeader from '../../shared/components/DashboardHeader';
import DashboardSideBar from './components/DashboardSideBar';
import { ProfileSideBar } from './components';
import MyTasks from '../my-tasks';
import StatusOfTeam from '../status';
import { Schedule } from '../schedule';
import StatisticsPage from '../statistics';
import ConfigurationPage from '../configuration';
import Profile from '../profile';
import Achievements from '../achievements';
import EditUserModal from '../profile/components/EditUserModal';

import { dashboardRoutes } from '../../const/routes';

import styles from './DashboardPage.module.scss';

export const DashboardPage: FunctionComponent<RouteComponentProps> = ({
  match: { path },
}) => {
  return (
    <>
      <div className={styles.dashboardPageContainer}>
        <div className={styles.dashboardSideBarContainer}>
          <DashboardSideBar />
        </div>
        <div className={styles.dashboardMainContentContainer}>
          <DashboardHeader />
          <Switch>
            <Redirect exact from={path} to={path + dashboardRoutes.MY_TASKS} />
            <Route path={path + dashboardRoutes.MY_TASKS} component={MyTasks} />
            <Route
              path={path + dashboardRoutes.SCHEDULE}
              component={Schedule}
            />
            <Route
              path={path + dashboardRoutes.STATISTICS}
              component={StatisticsPage}
            />
            <Route
              path={path + dashboardRoutes.CONFIGURATION}
              component={ConfigurationPage}
            />
            <Route
              path={[
                path + dashboardRoutes.STATUS_OF_TEAM + '/:id',
                path + dashboardRoutes.STATUS_OF_TEAM,
              ]}
            >
              <StatusOfTeam />
            </Route>
            <Route path={path + dashboardRoutes.PROFILE} component={Profile} />
            <Route
              path={path + dashboardRoutes.ACHIEVEMENTS}
              component={Achievements}
            />
            <Route>404</Route>
          </Switch>
        </div>
      </div>
      <ProfileSideBar />
      <EditUserModal />
    </>
  );
};
