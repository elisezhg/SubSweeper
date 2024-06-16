import { SUBSCRIPTIONS_PAGE_SIZE } from '@utils/constants';
import axios from 'axios';

export async function getToken(code: string) {
  const data = await axios.post(
    `${import.meta.env.VITE_SERVER_BASE_URL}/token`,
    null,
    {
      params: { code: code },
    }
  );

  return data.data;
}

export async function getSubscriptions() {
  let seen = 0;
  let after = null;
  let subscriptions: any[] = [];

  do {
    const res = (await axios.get(
      `${import.meta.env.VITE_REDDIT_API_BASE_URL}/subreddits/mine/subscriber`,
      {
        params: {
          limit: SUBSCRIPTIONS_PAGE_SIZE,
          count: seen,
          after: after,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ss-token')}`,
        },
      }
    )) as any;

    after = res.data.data.after;
    seen += res.data.data.children.length;
    subscriptions = subscriptions.concat(res.data.data.children);
  } while (after);

  return Promise.resolve(subscriptions);
}

export async function postUnsubscribe(subFullNames: string[]) {
  const data = await axios.post(
    `${import.meta.env.VITE_REDDIT_API_BASE_URL}/api/subscribe`,
    null,
    {
      params: {
        action: 'unsub',
        sr: subFullNames.join(','),
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ss-token')}`,
      },
    }
  );

  return data.data;
}
