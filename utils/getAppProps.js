import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../lib/mongodb"
import { _ } from "numeral";

export const getAppProps = async (context) => {
  const userSession = await getSession(context.req, context.res);
  const client = await clientPromise;
  const db = client.db("blogStandard");
  const user = await db.collection("users").findOne({ auth0Id: userSession.user.sub
  });

  if(!user) {
    return {
      availableTokens: 0,
      posts: [],
    }
  }

  const posts = await db.collection("posts").find({ userId: user._id })
  .limit(5)
  .sort({
    createdAt: -1
  })
  .toArray();
  console.log("APP posts in getAppProps", posts);
  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({createdAt, _id, userId, ...rest}) => ({
      _id: _id.toString(),
      createdAt: createdAt.toString(),
      ...rest,
  } )),
  postId: context.params?.postId || null,
}

}
