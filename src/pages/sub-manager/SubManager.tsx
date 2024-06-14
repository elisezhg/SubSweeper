import ArrowButton from '@components/arrow-button/ArrowButton';
import BackToTop from '@components/back-to-top/BackToTop';
import Button from '@components/button/Button';
import Checkbox from '@components/checkbox/Checkbox';
import LoadingWrapper from '@components/loading-wrapper/LoadingWrapper';
import { useAlerts } from '@contexts/AlertsContext';
import useInterceptors from '@hooks/useInterceptors';
import { getSubreddits, getToken, postUnsubscribe } from '@providers/api';
import { SUBREDDITS_PAGE_SIZE } from '@utils/constants';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SubManager.scss';

interface Subreddit {
  selected: boolean;
  fullName: string;
  displayName: string;
}

export default function SubManager() {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  useInterceptors();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubredditsLoading, setIsSubredditsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [subreddits, setSubreddits] = useState([] as Subreddit[]);
  const [selectedSubreddits, setSelectedSubreddits] = useState([] as string[]);
  const [pageNumber, setPageNumber] = useState(0);

  const { pushSuccessAlert, pushErrorAlert } = useAlerts();

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
    const storedToken = localStorage.getItem('ss-token');

    if (paramCode) {
      const isStateMissingOrInvalid = !paramState || paramState != storedState;

      if (isStateMissingOrInvalid) {
        navigate('/login');
      } else {
        getToken(paramCode).then((res: any) => {
          if (res.access_token) {
            localStorage.setItem('ss-token', res.access_token);
          }
          setIsLoading(false);
          navigate('/');
        });
      }
    } else {
      if (!storedToken) {
        navigate('/login');
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchSubreddits();
    }
  }, [isLoading]);

  const fetchSubreddits = () => {
    setIsSubredditsLoading(true);

    getSubreddits().then((res) => {
      setSubreddits(
        Array.from(
          res.map(
            (sub: any) =>
              ({
                selected: false,
                fullName: sub.data.name,
                displayName: sub.data.display_name_prefixed,
              } as Subreddit)
          )
        )
      );
      setIsSubredditsLoading(false);
    });
  };

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
        setSubreddits(updatedSubreddits);
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
                onClick={() => {
                  const idx = selectedSubreddits.indexOf(sub.fullName);
                  if (idx === -1) {
                    setSelectedSubreddits([
                      ...selectedSubreddits,
                      sub.fullName,
                    ]);
                  } else {
                    const updatedSelectedSubs = [...selectedSubreddits];
                    updatedSelectedSubs.splice(idx, 1);
                    setSelectedSubreddits(updatedSelectedSubs);
                  }
                }}
              />
            ))}
          </div>
        </LoadingWrapper>
      </div>

      <BackToTop />
    </LoadingWrapper>
  );
}
