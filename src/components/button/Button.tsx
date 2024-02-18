import './Button.scss';
import classNames from 'classnames';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  buttonType?: 'a' | 'button';
}

export default function Button(props: ButtonProps) {
  const { className, children, buttonType = 'button', ...passthroughs } = props;

  const ButtonTag = buttonType;

  return (
    <ButtonTag
      className={classNames('button', className)}
      tabIndex={0}
      {...passthroughs}
    >
      {children}
    </ButtonTag>
  );
}
