import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import './globals.css';

export const metadata = {
  title: "Chef's Compass",
  description: 'Get personalized recipes with ingredients you have',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-16">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}