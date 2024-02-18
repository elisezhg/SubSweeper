const CLIENT_ID = 'L_3U-CoxKkxuXJMcufGsHA';
const REDIRECT_URI = 'http://localhost:5173/';
const SCOPE = 'mysubreddits subscribe';

export function getRedirectionUrl() {
  const randomString = (+new Date() * Math.random())
    .toString(36)
    .substring(0, 12);

  localStorage.setItem('ss-state', randomString);

  return `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${randomString}&redirect_uri=${REDIRECT_URI}&duration=temporary&scope=${SCOPE}`;
}
