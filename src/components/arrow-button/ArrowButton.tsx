import Button, { ButtonProps } from '@components/button/Button';
import classNames from 'classnames';
import './ArrowButton.scss';

export interface ArrowButtonProps extends ButtonProps {
  direction: 'left' | 'right' | 'top';
}

export default function ArrowButton(props: ArrowButtonProps) {
  const { direction, className, ...passthroughs } = props;
  return (
    <Button
      className={classNames(
        'arrow-button',
        `arrow-button--${direction}`,
        className
      )}
      {...passthroughs}
    />
  );
}
