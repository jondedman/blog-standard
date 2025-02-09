import React, { useCallback } from 'react';
import { useState } from 'react';

const postsContext = React.createContext();

export default postsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const deletePost = useCallback((postId) => {
    setPosts((value) => {
      const newPosts = [];
      value.forEach((post) => {
        if (post._id !== postId) {
        newPosts.push(post);
      }
      });
      return newPosts;
    });
  }, []);

  const setPostsFromSSR = useCallback((postsFromSSR=[]) => {
    // setPosts(postsFromSSR);
    setPosts(value => {
      const newPosts = [...value];
      postsFromSSR.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if(!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  const getPosts = useCallback(async ({lastPostDate, getNewerPosts=false }) => {
    console.log("getPosts", lastPostDate);

    const result = await fetch("/api/getPosts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({lastPostDate, getNewerPosts }),
    });
    const json = await result.json();
    const postsResult = json.posts || [];
    // console.log("postsResult", postsResult);
    if(postsResult.length < 5) {
      setNoMorePosts(true);
    }
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
    <postsContext.Provider value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}>
      {children}
    </postsContext.Provider>
  );
};
