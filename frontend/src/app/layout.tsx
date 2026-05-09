import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'WhatsAI - Master CRM Dashboard',
  description: 'Huge dashboard with WhatsApp API and Gemini AI integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#050505] text-gray-100 font-sans flex min-h-screen selection:bg-emerald-500/30">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
