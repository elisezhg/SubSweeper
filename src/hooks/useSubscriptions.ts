import { getSubscriptions } from '@providers/api';
import { useEffect, useState } from 'react';

export interface Subscription {
  fullName: string;
  displayName: string;
  icon: string;
  isNSFW: boolean;
  isSubreddit: boolean;
  subscribers: number;
}

export default function useSubscriptions(isLoading: boolean) {
  const [isSubscriptionsLoading, setIsSubscriptionsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([] as Subscription[]);

  useEffect(() => {
    if (!isLoading) {
      loadSubscriptions();
    }
  }, [isLoading]);

  const setAndCacheSubscriptions = (subscriptions: Subscription[]) => {
    localStorage.setItem('ss-subscriptions', JSON.stringify(subscriptions));
    setSubscriptions(subscriptions);
  };

  const fetchSubscriptions = () => {
    getSubscriptions().then((res) => {
      setAndCacheSubscriptions(
        Array.from(
          res.map(
            (sub: any) =>
              ({
                fullName: sub.data.name,
                displayName: sub.data.display_name_prefixed,
                icon: sub.data.community_icon.split('?')[0],
                isNSFW: sub.data.over18,
                isSubreddit: sub.data.display_name_prefixed.startsWith('r/'),
                subscribers: sub.data.subscribers,
              } as Subscription)
          )
        )
      );

      setIsSubscriptionsLoading(false);
    });
  };

  const loadSubscriptions = () => {
    setIsSubscriptionsLoading(true);

    const cachedSubscriptions = localStorage.getItem('ss-subscriptions');

    if (cachedSubscriptions) {
      try {
        setSubscriptions(JSON.parse(cachedSubscriptions));
        setIsSubscriptionsLoading(false);
      } catch (error) {
        console.error('Error loading subscriptions from cache:', error);
        fetchSubscriptions();
      }
    } else {
      fetchSubscriptions();
    }
  };

  return { isSubscriptionsLoading, subscriptions, setAndCacheSubscriptions };
}
