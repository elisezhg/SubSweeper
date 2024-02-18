import axios from 'axios';

export async function getToken(code: string) {
  const data = await axios.post(
    `${import.meta.env.VITE_SERVER_BASE_URL}/token`,
    null,
    {
      params: { code: code },
    }
  );

  console.log(data);
  return data.data;
}

export async function getSubreddits(
  before?: string,
  after?: string,
  count?: number
) {
  const params = {
    limit: 100,
  } as any;

  if (before) {
    params.before = before;
  }

  if (after) {
    params.after = after;
  }

  if (count) {
    params.count = count;
  }

  const data = await axios.get(
    `${import.meta.env.VITE_REDDIT_API_BASE_URL}/subreddits/mine/subscriber`,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ss-token')}`,
      },
    }
  );

  return data.data;
}

export async function postUnsubscribe(subFullNames: string[]) {
  const params = {
    action: 'unsub',
    sr: subFullNames.join(','),
  };

  const data = await axios.post(
    `${import.meta.env.VITE_REDDIT_API_BASE_URL}/api/subscribe`,
    null,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ss-token')}`,
      },
    }
  );

  return data.data;
}
