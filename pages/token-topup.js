import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout/AppLayout';

export default function TokenTopup() {
  const handleClick = async () => {
    await fetch('/api/addTokens', {
      method: 'POST',
    });
  }
  return (
  <div>
  <h1>Token top up</h1>
  <button className="btn" onClick={handleClick}>Add Tokens</button>
</div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return (
    <AppLayout {...pageProps}>
      {page}
    </AppLayout>
  );
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {}, // will be passed to the page component as props
  }
});
