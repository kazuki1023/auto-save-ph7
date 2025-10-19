import { Analytics } from '@vercel/analytics/next';
import './global.css';

import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata = {
  title: 'E-Love',
  description:
    'E-Loveは、日程調整アプリです。Google Calendarと連携した自動入力やパターン毎に日程調整フォームなどを用意しており、いままで以上に快適な日程調整を提供します',
  verification: {
    google: 'vU5QqsuaI1kaZnRmeAcNO81SClAbY4qPZrhaThoICVk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
