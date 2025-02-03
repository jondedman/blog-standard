import React, { useCallback } from 'react';
import { useState } from 'react';

const postsContext = React.createContext();

export default postsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR=[]) => {
    setPosts(postsFromSSR);

  }, []);

  return (
    <postsContext.Provider value={{ posts, setPostsFromSSR }}>
      {children}
    </postsContext.Provider>
  );
};
