import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  console.log("NewPost props", props);

  const handleClick = async () => {
    console.log("handleClick");

    const response = await fetch('/api/generatePost', {
      method: 'POST',
    });
   const json = await response.json();
    console.log("RESULT", json);
    setPostContent(json.postContent);
  }

  return (
    <div>
   <h1>New Post page</h1>
   <button className="btn" onClick={handleClick}>
    Generate
   </button>
   <Markdown>{postContent}</Markdown>
</div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
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
