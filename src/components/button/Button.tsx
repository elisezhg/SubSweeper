import classNames from 'classnames';
import './Button.scss';

export interface ButtonProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  buttonType?: 'a' | 'button';
}

export default function Button(props: ButtonProps) {
  const {
    className,
    children,
    disabled,
    buttonType = 'button',
    ...passthroughs
  } = props;

  const ButtonTag = buttonType;

  return (
    <ButtonTag
      className={classNames('button', className, {
        'button--disabled': disabled,
      })}
      tabIndex={0}
      disabled={disabled}
      {...passthroughs}
    >
      {children}
    </ButtonTag>
  );
}
