import React, { useCallback } from 'react';
import { useState } from 'react';

const postsContext = React.createContext();

export default postsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR=[]) => {
    setPosts(postsFromSSR);
  }, []);

  const getPosts = useCallback(async ({lastPostDate}) => {
    console.log("getPosts", lastPostDate);

    const result = await fetch("/api/getPosts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({lastPostDate }),
    });
    const json = await result.json();
    const postsResult = json.posts || [];
    console.log("postsResult", postsResult);
    setPosts(value => {
      const newPosts = [...value];
      postsResult.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if(!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });


  }, []);

  return (
    <postsContext.Provider value={{ posts, setPostsFromSSR, getPosts }}>
      {children}
    </postsContext.Provider>
  );
};
