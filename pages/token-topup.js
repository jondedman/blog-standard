import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { getAppProps } from '../utils/getAppProps';

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

export const getServerSideProps = withPageAuthRequired ({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    console.log("TokenTopup props", props);

    return {
      props,
    };
}
});
