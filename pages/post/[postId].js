import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Post() {
  return <h1>Dynamic post page</h1>
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {}, // will be passed to the page component as props
  }
});
