import ArrowButton from '@components/arrow-button/ArrowButton';
import BackToTop from '@components/back-to-top/BackToTop';
import Button from '@components/button/Button';
import Checkbox from '@components/checkbox/Checkbox';
import LoadingWrapper from '@components/loading-wrapper/LoadingWrapper';
import { useAlerts } from '@contexts/AlertsContext';
import useInterceptors from '@hooks/useInterceptors';
import useLoggedIn from '@hooks/useLoggedIn';
import useSubreddits, { Subreddit } from '@hooks/useSubreddits';
import { getToken, postUnsubscribe } from '@providers/api';
import { SUBREDDITS_PAGE_SIZE } from '@utils/constants';
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
  const [selectedSubreddits, setSelectedSubreddits] = useState([] as string[]);
  const [pageNumber, setPageNumber] = useState(0);

  const { pushSuccessAlert, pushErrorAlert } = useAlerts();

  const { isSubredditsLoading, subreddits, setAndCacheSubreddits } =
    useSubreddits(isLoading);

  const lowerBound = 0;
  const upperBound = Math.ceil(subreddits.length / SUBREDDITS_PAGE_SIZE - 1);

  const pageStart = pageNumber * SUBREDDITS_PAGE_SIZE;
  const pageEnd = (pageNumber + 1) * SUBREDDITS_PAGE_SIZE - 1;

  const visibleSubreddits = useMemo(
    () => subreddits?.slice(pageStart, pageEnd + 1),
    [subreddits, pageNumber]
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
    setSelectedSubreddits((prevSelectedSubreddits) => [
      ...prevSelectedSubreddits,
      ...visibleSubreddits
        .filter(
          (s: Subreddit) => prevSelectedSubreddits.indexOf(s.fullName) === -1
        )
        .map((s) => s.fullName),
    ]);
  };

  const handleUnselectVisible = () => {
    const toBeRemoved = visibleSubreddits.map((s) => s.fullName);
    setSelectedSubreddits((prevSelectedSubreddits) =>
      prevSelectedSubreddits.filter(
        (s: string) => toBeRemoved.indexOf(s) === -1
      )
    );
  };

  const handleUnsubscribe = () => {
    setIsUnsubscribing(true);

    postUnsubscribe(selectedSubreddits)
      .then(() => {
        setIsUnsubscribing(false);

        const updatedSubreddits = subreddits.filter(
          (sub) => selectedSubreddits.indexOf(sub.fullName) === -1
        );
        setAndCacheSubreddits(updatedSubreddits);
        setSelectedSubreddits([]);

        // Decrease page number if needed
        const totalPages = updatedSubreddits.length / SUBREDDITS_PAGE_SIZE;
        if (pageNumber >= totalPages) {
          setPageNumber(pageNumber - 1);
        }

        pushSuccessAlert(
          `Successfully unsubscribed from ${
            selectedSubreddits.length
          } subreddit${selectedSubreddits.length > 1 ? 's' : ''}.`
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
      ? [...selectedSubreddits, value]
      : selectedSubreddits.filter((s) => s !== value);
    setSelectedSubreddits(updatedSelected);
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
              disabled={selectedSubreddits.length == 0 || isUnsubscribing}
              loading={isUnsubscribing}
            >
              Unsubscribe
            </Button>
          </div>

          {subreddits?.length > SUBREDDITS_PAGE_SIZE && (
            <div className='btn-container__pagination'>
              <span>
                {pageStart + 1}-{Math.min(pageEnd + 1, subreddits.length)} of{' '}
                {subreddits.length}
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
            {selectedSubreddits.length} subreddit
            {selectedSubreddits.length > 1 ? 's' : ''} selected
          </span>
          <button
            className='nb-selected__reset-btn'
            tabIndex={0}
            onClick={() => setSelectedSubreddits([])}
          >
            Reset
          </button>
        </div>

        <LoadingWrapper isLoading={isSubredditsLoading}>
          <div className='subreddits-container'>
            {visibleSubreddits.map((sub: Subreddit, idx: number) => (
              <Checkbox
                key={idx}
                checked={selectedSubreddits.indexOf(sub.fullName) !== -1}
                className='subreddits-container__checkbox'
                id={sub.fullName}
                name='subreddits'
                value={sub.fullName}
                label={sub.displayName}
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
