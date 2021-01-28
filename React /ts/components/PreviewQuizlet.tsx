import cl from 'classnames';
import { observer } from 'mobx-react';
import React, { Component, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import device from '../../../../assets/device.png';
import { RootStore, RootStoreContext } from '../../../../rootStore';
import BackButton from '../../../../shared/components/BackButton';
import Image from '../../../../shared/components/Image';
import styles from './PreviewQuizlet.module.scss';
@observer
export default class PreviewQuizlet extends Component<RouteComponentProps> {
  static contextType = RootStoreContext;
  rootStore: RootStore = this.context;

  render(): ReactElement | null {
    const { location } = this.props;
    const { detailedQuizletStore } = this.rootStore;
    const { quizletForm, answers } = detailedQuizletStore;
    const { prevPath } = location.state as { prevPath: string };

    return (
      <div className={styles.container}>
        <BackButton
          url={{ pathname: prevPath, state: { reset: false } }}
          text={quizletForm.question.value ? `Back to Quizlets - ${quizletForm.question.value}` : 'Back to Quizlets'}
        />
        <div className={styles.deviceContainer}>
          <img src={device} alt="device" />
          <div className={styles.answersContainer}>
            <h2>{quizletForm.question.value}</h2>
            <div className={styles.answersMain}>
              {answers.map((answer, index) => (
                <div className={cl(styles.answerContainer)} key={index}>
                  <h3 className={cl({ [styles.titleWithoutImage]: !answer.imgURL.value })}>{answer.text.value}</h3>
                  {answer.imgURL.value && (
                    <div className={styles.imageContainer}>
                      <Image imgURL={answer.imgURL.value} isQuizlet={true} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
