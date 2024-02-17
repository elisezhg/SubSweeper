import './Button.scss';
import classNames from 'classnames';

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, children, ...passthroughs } = props;
  return (
    <button
      className={classNames('button', className)}
      tabIndex={0}
      {...passthroughs}
    >
      {children}
    </button>
  );
}
