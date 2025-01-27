import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";


export default function NewPost(props) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [postContent, setPostContent] = useState("");
  console.log("NewPost props", props);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Generating post");
    const response = await fetch('/api/generatePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, keywords }),
    });
   const json = await response.json();
    console.log("RESULT", json);
    setPostContent(json.post.postContent);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of</strong>
          </label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
        <label>
            <strong>Targetting the following keywords:</strong>
        </label>
        <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </div>
        <button type="submit" className="btn">
      Generate
      </button>
    </form>
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
