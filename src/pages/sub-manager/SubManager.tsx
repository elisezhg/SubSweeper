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
  const [subreddits, setSubreddits] = useState([] as Subreddit[]);
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');

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
    });
  };

  const toggleAllSelections = (selected: boolean) => {
    const updatedSubreddits = subreddits.map((s: Subreddit) => ({
      ...s,
      selected: selected,
    }));
    setSubreddits(updatedSubreddits);
  };

  const handleUnsubscribe = () => {
    const subredditsToUnsub = subreddits
      .filter((sub) => sub.selected)
      .map((sub) => sub.fullName);

    postUnsubscribe(subredditsToUnsub).then((res) => {
      console.log(res.success);
      setSubreddits(subreddits.filter((sub) => !sub.selected));
    });
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div className='sub-manager-page'>
        <div className='btn-container'>
          <div className='btn-container__left'>
            <Button onClick={() => toggleAllSelections(false)}>
              Unselect all
            </Button>
            <Button onClick={() => toggleAllSelections(true)}>
              Select all
            </Button>
            <Button onClick={handleUnsubscribe}>Unsubscribe</Button>
          </div>
          <div className='btn-container__right'>
            <Button onClick={() => fetchSubreddits(before)}>Previous</Button>
            <Button onClick={() => fetchSubreddits('', after)}>Next</Button>
          </div>
        </div>

        <div className='subreddits-container'>
          {subreddits?.map((sub: Subreddit, idx: number) => (
            <Checkbox
              key={idx}
              checked={sub.selected}
              className='subreddits-container__checkbox'
              id={sub.fullName}
              name='subreddits'
              value={sub.fullName}
              label={sub.displayName}
              onClick={() => {
                const updatedSubreddits = subreddits.map((s: Subreddit) =>
                  s.fullName == sub.fullName
                    ? { ...s, selected: !s.selected }
                    : s
                );
                setSubreddits(updatedSubreddits);
              }}
            />
          ))}
        </div>
      </div>
    </LoadingWrapper>
  );
}
