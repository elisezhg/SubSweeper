function getState() {
  const state = localStorage.getItem('ss-state');

  if (state) {
    return state;
  }

  const randomString = (+new Date() * Math.random())
    .toString(36)
    .substring(0, 12);

  localStorage.setItem('ss-state', randomString);

  return randomString;
}

export function getRedirectionUrl() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectURI = import.meta.env.VITE_REDIRECT_URI;
  const state = getState();

  return (
    'https://www.reddit.com/api/v1/authorize' +
    `?client_id=${clientId}&state=${state}&redirect_uri=${redirectURI}` +
    `&response_type=code&duration=temporary&scope=mysubreddits subscribe`
  );
}
