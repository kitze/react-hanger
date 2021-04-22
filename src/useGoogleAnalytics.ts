import { useEffect } from 'react';

export type UseGoogleAnalyticsProps = {
  id: string;
  startLoading: boolean;
  delay: number;
};

export const useGoogleAnalytics = ({ id, startLoading, delay = 0 }: UseGoogleAnalyticsProps) => {
  useEffect(() => {
    if (startLoading) {
      if (!id) {
        throw new Error('Must provide id');
      }
      setTimeout(() => {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.body.appendChild(script);
        //@ts-ignore
        window.dataLayer = window.dataLayer || [];

        function gtag() {
          //@ts-ignore
          window.dataLayer.push(arguments);
        }

        //@ts-ignore
        gtag('js', new Date());
        //@ts-ignore
        gtag('config', id, {
          anonymize_ip: true,
          cookie_expires: 0,
        });
      }, delay);
    }
  }, [delay, id, startLoading]);
};
