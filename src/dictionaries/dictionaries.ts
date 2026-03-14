const dictionaries = {
  pl: () => import('./pl.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'pl' | 'en') => dictionaries[locale]();