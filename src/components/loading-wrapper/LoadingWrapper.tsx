import LoadingDots from '@components/loading-dots/LoadingDots';
import './LoadingWrapper.scss';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function LoadingWrapper(props: LoadingWrapperProps) {
  const { isLoading, children } = props;

  return <>{isLoading ? <LoadingDots /> : children}</>;
}
