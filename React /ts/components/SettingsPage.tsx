import cl from 'classnames';
import { observer } from 'mobx-react';
import React, { Component, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { usersBillingRoutes } from '../../const/routes';
import { RootStore, RootStoreContext } from '../../rootStore';
import { Button, buttonType } from '../../shared/components/Button';
import GoallyLoader from '../../shared/components/GoallyLoader';
import GoallyAccordion from './components/Accordion';
import GoallySwitch from './components/GoallySwitch';
import styles from './Settings.module.scss';
@observer
export class SettingsPage extends Component<RouteComponentProps> {
  static contextType = RootStoreContext;
  rootStore: RootStore = this.context;

  render(): ReactElement {
    const { userStore } = this.rootStore;
    if (userStore.currentClientLoading)
      return (
        <div className={styles.settings}>
          <GoallyLoader />
        </div>
      );
    return (
      <div className={styles.settings}>
        {userStore.currentClient ? (
          <>
            <h2 className="py-4 mb-2">
              Settings: {`${userStore.currentClient.firstName} ${userStore.currentClient.lastName}`} goally
            </h2>
            <div className={styles.accordionContainer}>
              <GoallyAccordion title={'Visual Scheduler App'}>
                <div className="row">
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={false}
                      label={'Enable visual schedule app'}
                      onChange={userStore.updateCurrentClientSetting('enableVisualScheduleApp')}
                      checked={userStore.currentClient.enableVisualScheduleApp}
                    ></GoallySwitch>
                  </div>
                </div>
              </GoallyAccordion>
              <GoallyAccordion title={'Rewards App'}>
                <div className="row">
                  <div className={cl(styles.ptop, 'col-6')}>
                    <GoallySwitch
                      comingSoon={false}
                      label={'Enable Rewards app'}
                      onChange={userStore.updateCurrentClientSetting('enableRewardApp')}
                      checked={userStore.currentClient.enableRewardApp}
                    ></GoallySwitch>
                  </div>
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={true}
                      label={'Send me an SMS to the parent when child redeems'}
                      onChange={console.log}
                      checked={true}
                    ></GoallySwitch>
                  </div>

                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={false}
                      label={'Allow child to redeem rewards on this Goally:'}
                      onChange={userStore.updateCurrentClientSetting('allowChildToRedeemRewards')}
                      checked={userStore.currentClient.allowChildToRedeemRewards}
                    ></GoallySwitch>
                  </div>
                </div>
              </GoallyAccordion>
              <GoallyAccordion title={'Behavior Tracker App'}>
                <div className="row">
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={false}
                      label={'Enable behaviour tracker app'}
                      onChange={userStore.updateCurrentClientSetting('enableBehaviorTrackerApp')}
                      checked={userStore.currentClient.enableBehaviorTrackerApp}
                    ></GoallySwitch>
                  </div>
                </div>
              </GoallyAccordion>
              <GoallyAccordion title={'Weather App'}>
                <div className="row">
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={false}
                      label={'Enable Weather App on Goally?'}
                      onChange={userStore.updateCurrentClientSetting('enableWeather')}
                      checked={userStore.currentClient.enableWeather}
                    ></GoallySwitch>
                  </div>
                </div>
              </GoallyAccordion>
              <GoallyAccordion title={'Timer App'}>
                <div className="row">
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={false}
                      label={'Enable Timer App on Goally?'}
                      onChange={userStore.updateCurrentClientSetting('enableTimerApp')}
                      checked={userStore.currentClient.enableTimerApp}
                    ></GoallySwitch>
                  </div>
                </div>
              </GoallyAccordion>
              <GoallyAccordion title={'Device'}>
                <div className="row">
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={true}
                      label={'Send me an SMS when the battery is low:'}
                      onChange={console.log}
                      checked={true}
                    ></GoallySwitch>
                  </div>
                  <div className={cl(styles.ptop, 'col-6')}>
                    <GoallySwitch
                      comingSoon={false}
                      label={'Hide the gear icon on the device'}
                      onChange={userStore.updateCurrentClientSetting('hideGearIcon')}
                      checked={userStore.currentClient.hideGearIcon}
                    ></GoallySwitch>
                  </div>
                  <div className="col-6">
                    <GoallySwitch
                      comingSoon={true}
                      label={'Send me an SMS when wifi is disconnected for over 8 hours:'}
                      onChange={console.log}
                      checked={true}
                    ></GoallySwitch>
                  </div>
                </div>
              </GoallyAccordion>
            </div>
          </>
        ) : (
          <div>
            <Button
              type={buttonType.PRIMARY}
              customClasses={'p-4'}
              onClick={(): void => {
                this.props.history.push(usersBillingRoutes.ADD_DEVICE);
              }}
            >
              Add Goally to begin
            </Button>
          </div>
        )}
      </div>
    );
  }
}
