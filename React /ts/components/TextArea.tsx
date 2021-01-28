import React, { ChangeEvent } from 'react';
import styles from './TextArea.module.scss';
import cl from 'classnames';

interface Props {
  style?: any;
  label: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  value?: string | null;
  variant: 'outlined' | undefined;
  disabled?: boolean;
  name?: string;
}

const TextArea: React.FC<Props> = ({
  style,
  label,
  onChange,
  placeholder,
  value,
  variant,
  disabled,
  name,
}) => {
  const wrapperClasses = cl(
    styles.inputWrapper,
    variant === 'outlined' && styles.outlined,
  );
  return (
    <div className={wrapperClasses}>
      <span>{label}</span>
      <textarea
        placeholder={placeholder}
        onChange={onChange}
        className={styles.textAreaInput}
        disabled={disabled}
        value={value || ''}
        name={name}
      ></textarea>
    </div>
  );
};

export default TextArea;
