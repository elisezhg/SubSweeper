import Button, { ButtonProps } from '@components/button/Button';
import './ArrowButton.scss';

interface ArrowButtonProps extends ButtonProps {
  direction: 'left' | 'right';
}

export default function ArrowButton(props: ArrowButtonProps) {
  const { direction, ...passthroughs } = props;
  return (
    <Button
      className={`arrow-button arrow-button--${direction}`}
      {...passthroughs}
    />
  );
}
