import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { getAppProps } from '../utils/getAppProps';

export default function Success() {
  return (
  <div>
  <h1>Thank you for your purchase</h1>

</div>
  );
}

Success.getLayout = function getLayout(page, pageProps) {
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
