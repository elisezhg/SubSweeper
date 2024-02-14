import './Button.scss';
import classNames from 'classnames';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, children, ...passthroughs } = props;
  return (
    <button className={classNames('button', className)} {...passthroughs}>
      {children}
    </button>
  );
}
