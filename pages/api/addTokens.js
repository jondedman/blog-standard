import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const {user} = await getSession(req, res);

  const line_items = [{
    price: process.env.STRIPE_PRODUCT_PRICE_ID,
    quantity: 1,
  }];

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    success_url: `${protocol}://${host}/success`,
  });

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

  res.status(200).json({ session: checkoutSession });
}
