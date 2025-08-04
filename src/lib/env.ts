export function getEnv() {
  return process.env.NODE_ENV;
}

export function getUrl() {
  if (getEnv() === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://schedule-adjustment-app.vercel.app';
}
