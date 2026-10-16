import { CmsThemeTokens } from '@/sanity/lib/data';

export default function CmsThemeInjector({ tokens }: { tokens?: CmsThemeTokens }) {
  if (!tokens) return null;

  const btnRadius =
    tokens.buttonRadius === 'full'
      ? '9999px'
      : tokens.buttonRadius === 'xl'
      ? '1rem'
      : tokens.buttonRadius === 'lg'
      ? '0.75rem'
      : '9999px';

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --cms-primary-color: ${tokens.primaryColor || '#D4AF37'};
          --cms-secondary-color: ${tokens.secondaryColor || '#059669'};
          --cms-card-radius: ${tokens.cardRadius || '24px'};
          --cms-button-radius: ${btnRadius};
          --cms-max-content-width: ${tokens.maxContentWidth || '1360px'};
        }
      `
    }} />
  );
}
