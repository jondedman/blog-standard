import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout/AppLayout';
import  clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import Markdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { getAppProps } from '../../utils/getAppProps';

export default function Post(props) {
  // console.log("Post props", props.posts[8].title);
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="test-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
          <div className="test-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, index) => (
            <div key={index} className="p-2 rounded-full bg-slate-800 text-white ">
            <FontAwesomeIcon icon={faHashtag}/>{keyword}
          </div>
          ))}
        </div>
        </div>
        <Markdown>
          {props.postContent || ""}
        </Markdown>
      </div>
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

// note importance of protecting posts belonging to the user
export const getServerSideProps = withPageAuthRequired ({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
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
        postCreated: post.createdAt.toString(),
        ...props,
      }
    }
  }
});
