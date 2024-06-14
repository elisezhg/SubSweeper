import ArrowButton from '@components/arrow-button/ArrowButton';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import './BackToTop.scss';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ArrowButton
      className={classNames('back-to-top', {
        'back-to-top--hidden': !isVisible,
      })}
      direction='top'
      onClick={scrollToTop}
    />
  );
}
