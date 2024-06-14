import classNames from 'classnames';
import './LoadingDots.scss';

interface LoadingDotsProps {
  small?: boolean;
}

export default function LoadingDots(props: LoadingDotsProps) {
  const { small = false } = props;

  return (
    <div
      className={classNames('loading-dots', { 'loading-dots--small': small })}
    >
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={`dot-${i}`}
          className={classNames('loading-dots__dot', {
            'loading-dots__dot--small': small,
          })}
        ></span>
      ))}
    </div>
  );
}
