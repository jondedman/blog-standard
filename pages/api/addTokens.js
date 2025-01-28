import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const {user} = await getSession(req, res);
  console.log("User", user);

  const client = await clientPromise;
  const db = client.db("blogStandard");

  // note the use of the upsert operation to create a new document if it does not exist. this is from the mongodb docs

  const userProfile = await db.collection("users").updateOne({
    auth0Id: user.sub
  },
  {
    $inc: {
      availableTokens: 10
    },
    $setOnInsert: {
      auth0Id: user.sub
    },
  },
   {
    upsert: true
  }
);

  res.status(200).json({ name: 'John Doe' })
}
