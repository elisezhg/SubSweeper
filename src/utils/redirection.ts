export function getRedirectionUrl() {
  const randomString = (+new Date() * Math.random())
    .toString(36)
    .substring(0, 12);

  localStorage.setItem('ss-state', randomString);

  return `https://www.reddit.com/api/v1/authorize?client_id=${
    import.meta.env.VITE_CLIENT_ID
  }&response_type=code&state=${randomString}&redirect_uri=${
    import.meta.env.VITE_REDIRECT_URI
  }&duration=temporary&scope=mysubreddits subscribe`;
}
