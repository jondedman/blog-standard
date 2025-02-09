import React, { useCallback, useReducer } from 'react';
import { useState } from 'react';

const postsContext = React.createContext();

export default postsContext;

function postsReducer(state, action){
  switch (action.type) {
    case 'addPosts': {
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if(!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
  }
    case 'deletePost': {
      const newPosts = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
        newPosts.push(post);
      }
      });
      return newPosts;
    }

    default:
      return state;
  }
}
export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer,[]);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const deletePost = useCallback((postId) => {
    dispatch({
    type: "deletePost",
    postId
    })
  }, []);

  const setPostsFromSSR = useCallback((postsFromSSR=[]) => {
    dispatch({
      type: "addPosts",
      posts: postsFromSSR
    })
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
    dispatch({
      type: "addPosts",
      posts: postsResult,
    })
  }, []);

  return (
    <postsContext.Provider value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}>
      {children}
    </postsContext.Provider>
  );
};
