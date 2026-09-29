import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>OnlyHikes.in — Jaipur's Student Hiking Community</title>
        <meta name="description" content="Discover Aravali trails, forts, hidden spots and unforgettable weekends with students from your city. Pickup + Drop, Food, and Guided treks included." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="OnlyHikes.in — YOUR WEEKEND JUST GOT WILDER." />
        <meta property="og:description" content="Jaipur's student adventure community. Hiking, Aravali ridges, transport & food included." />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
