import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function TokenTopup() {
  return <h1>Token top up</h1>
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {}, // will be passed to the page component as props
  }
});
