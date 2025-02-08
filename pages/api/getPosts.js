import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

// $lt is a MongoDB operator that selects the documents where the value of the field is less than the specified value.
export default withApiAuthRequired(async function handler(req, res) {
  console.log("getPosts API");
  console.log("req", req.body);


try {
  const { user: { sub } } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("blogStandard");
  const userProfile = await db.collection("users").findOne({ auth0Id: sub });

  // console.log("req:",req.body);

  const { lastPostDate, getNewerPosts } = req.body;
  console.log("lastPostDate", lastPostDate);

  const posts = await db.collection("posts").find({
    userId: userProfile._id,
    createdAt: { [getNewerPosts ? "$gt" : "$lt"]: new Date(lastPostDate) },
}).limit(getNewerPosts ? 0 : 5)
.sort({ createdAt: -1 })
.toArray();
console.log("line 38 in getPosts", posts);

  res.status(200).json({ posts });
  return;
} catch (error) {
  console.error("getposts Error", error);
  res.status(500).json({ error: "error" });
  return;
}
});
