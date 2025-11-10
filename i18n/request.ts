import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  let validLocale: string = locale || defaultLocale;
  if (!locales.includes(validLocale as any)) {
    validLocale = defaultLocale;
  }

  return {
    locale: validLocale,
    messages: {
      ...(await import(`@/locales/${validLocale}/common.json`)).default,
      ...(await import(`@/locales/${validLocale}/settings.json`)).default
    }
  };
});
