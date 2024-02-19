import ArrowButton from '@components/arrow-button/ArrowButton';
import Button from '@components/button/Button';
import Checkbox from '@components/checkbox/Checkbox';
import LoadingWrapper from '@components/loading-wrapper/LoadingWrapper';
import { getSubreddits, getToken, postUnsubscribe } from '@providers/api';
import { useEffect, useState } from 'react';
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

  const [isLoading, setIsLoading] = useState(true);
  const [isSubredditsLoading, setIsSubredditsLoading] = useState(true);
  const [subreddits, setSubreddits] = useState([] as Subreddit[]);
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const [selectedSubreddits, setSelectedSubreddits] = useState([] as string[]);

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

  const fetchSubreddits = (before: string = '', after: string = '') => {
    setIsSubredditsLoading(true);

    getSubreddits(before, after).then((res) => {
      setBefore(res.data.before);
      setAfter(res.data.after);
      setSubreddits(
        Array.from(
          res.data.children.map(
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

  const toggleAllSelections = (selected: boolean) => {
    if (selected) {
      setSelectedSubreddits((prevSelectedSubreddits) => [
        ...prevSelectedSubreddits,
        ...subreddits
          .filter(
            (s: Subreddit) => prevSelectedSubreddits.indexOf(s.fullName) === -1
          )
          .map((s) => s.fullName),
      ]);
    } else {
      const toBeRemoved = subreddits.map((s) => s.fullName);
      setSelectedSubreddits((prevSelectedSubreddits) =>
        prevSelectedSubreddits.filter(
          (s: string) => toBeRemoved.indexOf(s) === -1
        )
      );
    }
  };

  const resetSelection = () => {
    setSelectedSubreddits([]);
  };

  const handleUnsubscribe = () => {
    postUnsubscribe(selectedSubreddits).then((res) => {
      console.log(res.success);
      setSubreddits(
        subreddits.filter(
          (sub) => selectedSubreddits.indexOf(sub.fullName) === -1
        )
      );
      setSelectedSubreddits([]);
    });
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div className='sub-manager-page'>
        <div className='btn-container'>
          <div className='btn-container__actions'>
            <Button onClick={() => toggleAllSelections(true)}>
              Select visible
            </Button>
            <Button onClick={() => toggleAllSelections(false)}>
              Unselect visible
            </Button>
            <Button onClick={handleUnsubscribe}>Unsubscribe</Button>
          </div>
          <div className='btn-container__pagination'>
            {/* TODO */}
            <span>1-100 of 600</span>
            <ArrowButton
              direction='left'
              onClick={() => fetchSubreddits(before)}
            />
            <ArrowButton
              direction='right'
              onClick={() => fetchSubreddits('', after)}
            />
          </div>
        </div>

        <div className='nb-selected'>
          <span>
            {`${selectedSubreddits.length} subreddit${
              selectedSubreddits.length > 1 ? 's' : ''
            } selected`}
          </span>
          <button
            className='nb-selected__reset-btn'
            tabIndex={0}
            onClick={resetSelection}
          >
            Reset
          </button>
        </div>

        <LoadingWrapper isLoading={isSubredditsLoading}>
          <div className='subreddits-container'>
            {subreddits?.map((sub: Subreddit, idx: number) => (
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
    </LoadingWrapper>
  );
}
