import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout/AppLayout';
import  clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default function Post(props) {
  console.log("Post props", props);
  return (
    <div>
      <h1>Dynamic post page</h1>
    </div>
  );
}
Post.getLayout = function getLayout(page, pageProps) {
  return (
    <AppLayout {...pageProps}>
      {page}
    </AppLayout>
  );
}
export const getServerSideProps = withPageAuthRequired ({
  async getServerSideProps(context) {
    const userSession = await getSession(context.req, context.res);
    const client = await clientPromise;
    const db = client.db("blogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(context.params.postId),
      userId: user._id
    })

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false
        }
      }
    }
    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
      }
    }
  }
});
