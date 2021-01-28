import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, ReactElement } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { rewardId, rewardsRoutes, usersBillingRoutes } from '../../../../const';
import { cardsType, childrenType, elementsType, tableType } from '../../../../const/libraryTypes';
import { RootStore, RootStoreContext } from '../../../../rootStore';
import { Button, buttonType } from '../../../../shared/components/Button';
import { ChildElement } from '../../../../shared/components/ChildElement';
import Counter from '../../../../shared/components/Counter';
import { FinishedElement } from '../../../../shared/components/FinishedElement';
import GoallyLoader from '../../../../shared/components/GoallyLoader';
import { LibraryElement } from '../../../../shared/components/LibraryElement';
import { TableCard } from '../../../../shared/components/TableCard';
import { ClientReward, ReorderAction, Reward, RewardHistory } from '../../../../shared/types';
import styles from './HomePage.module.scss';

@observer
export default class HomePage extends Component<RouteComponentProps> {
  static contextType = RootStoreContext;
  rootStore: RootStore = this.context;
  userStore = this.rootStore.userStore;
  rewardsStore = this.rootStore.rewardsStore;

  componentDidMount(): void {
    this.rewardsStore.updateLibrary();
    this.rewardsStore.updateClientLibrary();
    this.rewardsStore.updateHistory(this.rewardsStore.daysBefore);
  }
  onEdit = (_id: string): void =>
    this.props.history.push(rewardsRoutes.EDIT_REWARD.replace(`:${rewardId}`, _id), { reset: true });
  renderLibraryElement = (reward: Reward): ReactElement => {
    const { _id, name, imgURL, points } = reward;
    const onAdd = this.userStore.currentClient
      ? async (): Promise<void> => {
          const routine = await this.rewardsStore.addRewardToCurrentClient(_id);
          this.rewardsStore.newAddedId = routine._id;
          setTimeout(() => (this.rewardsStore.newAddedId = null), 2000);
        }
      : undefined;
    const onEdit = (): void => this.onEdit(_id);

    return (
      <LibraryElement
        key={_id}
        elementName={name}
        imgUrl={imgURL}
        childrenType={childrenType.POINT}
        elementType={elementsType.REWARD}
        onAdd={onAdd}
        onEdit={onEdit}
      >
        <span>{points} points</span>
      </LibraryElement>
    );
  };

  renderChildElement = ({ _id, name, imgURL, points }: ClientReward): ReactElement | null => {
    const { currentClient } = this.rootStore.userStore;
    if (!currentClient) return null;

    const onEdit = (): void => this.onEdit(_id);
    const onUp = (): Promise<void> => this.rewardsStore.changeOrder(_id, ReorderAction.up);
    const onDown = (): Promise<void> => this.rewardsStore.changeOrder(_id, ReorderAction.down);
    const onGive = (): Promise<void> => this.rewardsStore.giveReward(_id);
    const isEnough = currentClient.points >= points;
    return (
      <ChildElement
        key={_id}
        elementName={name}
        imgUrl={imgURL}
        childrenType={childrenType.POINT}
        elementType={elementsType.REWARD}
        onEdit={onEdit}
        onUp={onUp}
        onDown={onDown}
        onGive={onGive}
        isEnough={isEnough}
        isNew={this.rewardsStore.newAddedId === _id}
      >
        <span>{points} points</span>
      </ChildElement>
    );
  };

  renderFinishedElement = (reward: RewardHistory): ReactElement => {
    const { _id, name, imgURL, usedPoints, createdAt } = reward;
    const formatDate = 'MMM D';
    const isToday = moment(createdAt).format(formatDate) === moment(new Date()).format(formatDate);
    const day = isToday ? 'Today' : moment(createdAt).format(formatDate);

    const time = moment(createdAt).format('H:mm A');

    const onUndo = (): Promise<void> => this.rewardsStore.undo(reward._id);

    const finishedTime = 24;
    const duration = moment.duration(moment(new Date()).diff(createdAt));
    const isUndo = duration.asHours() <= finishedTime;
    return (
      <FinishedElement
        key={_id}
        elementName={name}
        imgUrl={imgURL}
        elementType={elementsType.REWARD}
        childrenType={childrenType.POINT}
        day={day}
        time={time}
        isUndo={isUndo}
        onUndo={onUndo}
      >
        <span>{usedPoints} points used</span>
      </FinishedElement>
    );
  };

  onCreate = (): void => {
    this.props.history.push(rewardsRoutes.NEW_REWARD);
  };

  render(): ReactElement {
    const {
      rewardLibrary,
      orderedRewardsClientLibrary,
      rewardHistory,
      daysBefore,
      updatePoints,
      setPoints,
      defaultPoints,
    } = this.rewardsStore;
    const { currentClient } = this.userStore;

    if (this.userStore.currentClientLoading)
      return (
        <div className={styles.container}>
          <div className={styles.loaderContainer}>
            <GoallyLoader />
          </div>
        </div>
      );

    return (
      <div className={styles.container}>
        {currentClient && (
          <div className={styles.headerContainer}>
            <Link to={rewardsRoutes.SETUP_PUZZLES} className={styles.setUpPuzzles}>
              Set up puzzles
            </Link>
            <div className={styles.clientInfo}>
              {currentClient.firstName} {currentClient.lastName ? [0] : ''}. Points: {currentClient.points}
            </div>
            <div className={styles.counterContainer}>
              <div className={styles.buttonContainer}>
                <Button
                  type={buttonType.SUBSTRACT}
                  onClick={(): void => updatePoints('SUBTRACT', currentClient.points)}
                >
                  Subtract
                </Button>
              </div>
              <Counter
                value={defaultPoints}
                onClickMinus={(): void => setPoints('SUBTRACT')}
                onClickPlus={(): void => setPoints('ADD')}
              />
              <div className={styles.buttonContainer}>
                <Button type={buttonType.ADD} onClick={(): void => updatePoints('ADD', currentClient.points)}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.tableContainer}>
          <div className={styles.firstTable}>
            <TableCard
              cardName="Goally Rewards Library"
              isHaveAddBlock={true}
              cardType={cardsType.REWARD}
              onCreate={this.onCreate}
              type={tableType.LIBRARY}
            >
              {rewardLibrary.map(this.renderLibraryElement)}
            </TableCard>
          </div>
          <div className={styles.secondTable}>
            <TableCard
              currentClient={currentClient}
              cardName={`${currentClient && currentClient.firstName}’s Rewards`}
              cardType={cardsType.REWARD}
              type={tableType.CHILD}
              goToConnectDevice={(): void => this.props.history.push(usersBillingRoutes.ADD_DEVICE)}
            >
              <div className={styles.newAdded}>{orderedRewardsClientLibrary.map(this.renderChildElement)}</div>
            </TableCard>
          </div>
          <div className={styles.thirdTable}>
            <TableCard
              cardName={`${currentClient ? currentClient.firstName : 'Child'}’s Rewards History`}
              cardType={cardsType.REWARD}
              isHaveSelect={true}
              daysBefore={daysBefore}
              onChangeDay={(value): void => this.rewardsStore.setDaysBefore(value)}
              type={tableType.FINISHED}
            >
              {rewardHistory.map(reward => this.renderFinishedElement(reward))}
            </TableCard>
          </div>
        </div>
      </div>
    );
  }
}
