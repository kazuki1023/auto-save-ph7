export function getEnv() {
  return process.env.NODE_ENV;
}

export function getUrl() {
  if (getEnv() === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://auto-save-ph7.vercel.app/';
}
