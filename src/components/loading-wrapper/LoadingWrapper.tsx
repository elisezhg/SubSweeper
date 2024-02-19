import './LoadingWrapper.scss';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function LoadingWrapper(props: LoadingWrapperProps) {
  const { isLoading, children } = props;

  return (
    <>
      {isLoading ? (
        <div className='loading-wrapper'>
          <span className='loading-wrapper__dot'></span>
          <span className='loading-wrapper__dot'></span>
          <span className='loading-wrapper__dot'></span>
        </div>
      ) : (
        children
      )}
    </>
  );
}
