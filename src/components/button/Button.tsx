import LoadingDots from '@components/loading-dots/LoadingDots';
import classNames from 'classnames';
import './Button.scss';

export interface ButtonProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  buttonType?: 'a' | 'button';
}

export default function Button(props: ButtonProps) {
  const {
    className,
    children,
    disabled,
    loading,
    buttonType = 'button',
    ...passthroughs
  } = props;

  const ButtonTag = buttonType;

  return (
    <ButtonTag
      className={classNames('button', className, {
        'button--disabled': disabled,
        'button--loading': loading,
      })}
      tabIndex={0}
      disabled={disabled}
      {...passthroughs}
    >
      {loading && <LoadingDots small />}
      <span>{children}</span>
    </ButtonTag>
  );
}
