import ArrowButton from '@components/arrow-button/ArrowButton';
import BackToTop from '@components/back-to-top/BackToTop';
import Button from '@components/button/Button';
import Checkbox from '@components/checkbox/Checkbox';
import LoadingWrapper from '@components/loading-wrapper/LoadingWrapper';
import { useAlerts } from '@contexts/AlertsContext';
import useInterceptors from '@hooks/useInterceptors';
import useLoggedIn from '@hooks/useLoggedIn';
import useSubscriptions, { Subscription } from '@hooks/useSubscriptions';
import { getToken, postUnsubscribe } from '@providers/api';
import { SUBSCRIPTIONS_PAGE_SIZE } from '@utils/constants';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SubManager.scss';

export default function SubManager() {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useLoggedIn();

  useInterceptors();

  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState(
    [] as string[]
  );
  const [pageNumber, setPageNumber] = useState(0);

  const { pushSuccessAlert, pushErrorAlert } = useAlerts();

  const { isSubscriptionsLoading, subscriptions, setAndCacheSubscriptions } =
    useSubscriptions(isLoading);

  const lowerBound = 0;
  const upperBound = Math.ceil(
    subscriptions.length / SUBSCRIPTIONS_PAGE_SIZE - 1
  );

  const pageStart = pageNumber * SUBSCRIPTIONS_PAGE_SIZE;
  const pageEnd = (pageNumber + 1) * SUBSCRIPTIONS_PAGE_SIZE - 1;

  const visibleSubscriptions = useMemo(
    () => subscriptions?.slice(pageStart, pageEnd + 1),
    [subscriptions, pageNumber]
  );

  useEffect(() => {
    const paramState = searchParams.get('state');
    const paramCode = searchParams.get('code');
    const storedState = localStorage.getItem('ss-state');

    if (paramCode) {
      const isStateMissingOrInvalid = !paramState || paramState != storedState;

      if (isStateMissingOrInvalid) {
        navigate('/login');
      } else {
        getToken(paramCode).then((res: any) => {
          if (res.access_token) {
            localStorage.setItem('ss-token', res.access_token);
            window.dispatchEvent(new Event('storage'));
          }
          setIsLoading(false);
          navigate('/');
        });
      }
    } else {
      if (!isLoggedIn) {
        navigate('/login');
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoggedIn]);

  const handleSelectVisible = () => {
    setSelectedSubscriptions((prevSelectedSubscriptions) => [
      ...prevSelectedSubscriptions,
      ...visibleSubscriptions
        .filter(
          (s: Subscription) =>
            prevSelectedSubscriptions.indexOf(s.fullName) === -1
        )
        .map((s) => s.fullName),
    ]);
  };

  const handleUnselectVisible = () => {
    const toBeRemoved = visibleSubscriptions.map((s) => s.fullName);
    setSelectedSubscriptions((prevSelectedSubscriptions) =>
      prevSelectedSubscriptions.filter(
        (s: string) => toBeRemoved.indexOf(s) === -1
      )
    );
  };

  const handleUnsubscribe = () => {
    setIsUnsubscribing(true);

    postUnsubscribe(selectedSubscriptions)
      .then(() => {
        setIsUnsubscribing(false);

        const updatedSubscriptions = subscriptions.filter(
          (sub) => selectedSubscriptions.indexOf(sub.fullName) === -1
        );
        setAndCacheSubscriptions(updatedSubscriptions);
        setSelectedSubscriptions([]);

        // Decrease page number if needed
        const totalPages =
          updatedSubscriptions.length / SUBSCRIPTIONS_PAGE_SIZE;
        if (pageNumber >= totalPages) {
          setPageNumber(pageNumber - 1);
        }

        pushSuccessAlert(
          `Successfully unsubscribed from ${
            selectedSubscriptions.length
          } subscription${selectedSubscriptions.length > 1 ? 's' : ''}.`
        );
      })
      .catch((err) => {
        setIsUnsubscribing(false);

        if (err !== 'Unauthorized') {
          console.error(err);
          pushErrorAlert(
            `Uh oh... An error occured while trying to unsubscribe.`
          );
        }
      });
  };

  const handlePageChange = (newPageNumber: number) => {
    if (newPageNumber >= lowerBound && newPageNumber <= upperBound) {
      setPageNumber(newPageNumber);
    }
  };

  const handleCheckboxChange = (e: React.BaseSyntheticEvent) => {
    const { checked, value } = e.target;
    const updatedSelected = checked
      ? [...selectedSubscriptions, value]
      : selectedSubscriptions.filter((s) => s !== value);
    setSelectedSubscriptions(updatedSelected);
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div className='sub-manager-page'>
        <div className='btn-container'>
          <div className='btn-container__actions'>
            <Button onClick={handleSelectVisible}>Select visible</Button>
            <Button onClick={handleUnselectVisible}>Unselect visible</Button>
            <Button
              onClick={handleUnsubscribe}
              disabled={selectedSubscriptions.length == 0 || isUnsubscribing}
              loading={isUnsubscribing}
            >
              Unsubscribe
            </Button>
          </div>

          {subscriptions?.length > SUBSCRIPTIONS_PAGE_SIZE && (
            <div className='btn-container__pagination'>
              <span>
                {pageStart + 1}-{Math.min(pageEnd + 1, subscriptions.length)} of{' '}
                {subscriptions.length}
              </span>
              <ArrowButton
                direction='left'
                disabled={pageNumber == lowerBound}
                onClick={() => handlePageChange(pageNumber - 1)}
              />
              <ArrowButton
                direction='right'
                disabled={pageNumber == upperBound}
                onClick={() => handlePageChange(pageNumber + 1)}
              />
            </div>
          )}
        </div>

        <div className='nb-selected'>
          <span>
            {selectedSubscriptions.length} subscription
            {selectedSubscriptions.length > 1 ? 's' : ''} selected
          </span>
          <button
            className='nb-selected__reset-btn'
            tabIndex={0}
            onClick={() => setSelectedSubscriptions([])}
          >
            Reset
          </button>
        </div>

        <LoadingWrapper isLoading={isSubscriptionsLoading}>
          <div className='subscriptions-container'>
            {visibleSubscriptions.map((sub: Subscription, idx: number) => (
              <Checkbox
                key={idx}
                checked={selectedSubscriptions.indexOf(sub.fullName) !== -1}
                className='subscriptions-container__checkbox'
                id={sub.fullName}
                name='subscriptions'
                value={sub.fullName}
                label={sub.displayName}
                icon={sub.icon}
                isNSFW={sub.isNSFW}
                onChange={handleCheckboxChange}
              />
            ))}
          </div>
        </LoadingWrapper>
      </div>

      <BackToTop />
    </LoadingWrapper>
  );
}
