import { withPageAuthRequired } from "@auth0/nextjs-auth0"

export default function NewPost(props) {
  return <h1>New Post page</h1>
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {}, // will be passed to the page component as props
  }
});
