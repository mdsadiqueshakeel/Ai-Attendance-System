import { BASE_URL } from '../services/api';

export const isAbsoluteUrl = (url) => /^https?:\/\//i.test(url || '');

export const toAbsoluteUrl = (url) => {
  if (!url) return '';
  if (isAbsoluteUrl(url)) return url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

export const isBackendFileUrl = (url) => {
  const absolute = toAbsoluteUrl(url);
  return absolute.startsWith(`${BASE_URL}/files`) || absolute.includes(`${BASE_URL}/files/`);
};

