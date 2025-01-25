import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

function MyApp({ Component, pageProps }) {
  return (
    // Wrap the app with the UserProvider context provider for authentication
   <UserProvider >
    <Component {...pageProps} />
  </UserProvider>
  );
}

export default MyApp
