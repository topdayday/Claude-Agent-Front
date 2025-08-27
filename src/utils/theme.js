const THEME_KEY = 'app_theme';

function systemPrefersDark() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || (systemPrefersDark() ? 'dark' : 'light');
}

export function setTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  if (document && document.documentElement) {
    document.documentElement.setAttribute('data-theme', t);
  }
  localStorage.setItem(THEME_KEY, t);
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}


