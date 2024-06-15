import { getSubreddits } from '@providers/api';
import { useEffect, useState } from 'react';

export interface Subreddit {
  selected: boolean;
  fullName: string;
  displayName: string;
}

export default function useSubreddits(isLoading: boolean) {
  const [isSubredditsLoading, setIsSubredditsLoading] = useState(true);
  const [subreddits, setSubreddits] = useState([] as Subreddit[]);

  useEffect(() => {
    if (!isLoading) {
      loadSubreddits();
    }
  }, [isLoading]);

  const setAndCacheSubreddits = (subreddits: Subreddit[]) => {
    localStorage.setItem('ss-subreddits', JSON.stringify(subreddits));
    setSubreddits(subreddits);
  };

  const fetchSubreddits = () => {
    getSubreddits().then((res) => {
      setAndCacheSubreddits(
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

  const loadSubreddits = () => {
    setIsSubredditsLoading(true);

    const cachedSubreddits = localStorage.getItem('ss-subreddits');

    if (cachedSubreddits) {
      try {
        setSubreddits(JSON.parse(cachedSubreddits));
        setIsSubredditsLoading(false);
      } catch (error) {
        console.error('Error loading subreddits from cache:', error);
        fetchSubreddits();
      }
    } else {
      fetchSubreddits();
    }
  };

  return { isSubredditsLoading, subreddits, setAndCacheSubreddits };
}
