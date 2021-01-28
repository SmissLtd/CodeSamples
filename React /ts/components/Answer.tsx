import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import answer from '../../../../assets/request-card-answer.svg';
import checked from '../../../../assets/request-card-checked.svg';
import style from './Answer.module.scss';

import { LeaveAnswerForm } from '../LeaveAnswerFrom/LeaveAnswerForm';
import { Comment as IComment } from '../types';

interface ExtrProp {
  onAnswerReply(id: number, text: string): void;
}

type Props = IComment & ExtrProp;

export const Answer: React.FC<Props> = ({
  id,
  description,
  createdAt,
  user,
  onAnswerReply,
}) => {
  const [showLeaveAnswerForm, setShowLeaveAnswerForm] = React.useState(false);

  return (
    <div className={style.answer}>
      <div className={style.textLight}>
        {[user.firstName, user.lastName].join(' ')}
      </div>
      <p className={classnames(style.textNormal, style.msg)}>{description}</p>
      <div className={style.cardFooter}>
        <div className={style.footerLeft}>
          <div className={style.textLight}>{moment(createdAt).format('L')}</div>
        </div>
        <div className={style.footerRight}>
          <img src={checked} alt="checked" />
          <img
            src={answer}
            alt="answer"
            onClick={() => setShowLeaveAnswerForm(!showLeaveAnswerForm)}
          />
        </div>
      </div>
      {showLeaveAnswerForm && (
        <LeaveAnswerForm
          onSubmit={text => {
            onAnswerReply(id, text);
            setShowLeaveAnswerForm(false);
          }}
        />
      )}
    </div>
  );
};
