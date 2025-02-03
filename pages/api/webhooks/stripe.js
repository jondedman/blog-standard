import Cors from "micro-cors";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import stripeInit from "stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try{
      event = await verifyStripe({
      req,
      stripe,
      endpointSecret,
    });
  } catch (error) {
    console.log("Error", error);
    // res.status(400).send(`Webhook Error: ${error.message}`);
    // return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const client = await clientPromise;
      const db = client.db("blogStandard");

      const paymentIntent = event.data.object;
      const auth0Id = paymentIntent.metadata.sub;

      // note the use of the upsert operation to create a new document if it does not exist. this is from the mongodb docs

      const userProfile = await db.collection("users").updateOne({
        auth0Id,
      },
      {
        $inc: {
          availableTokens: 10
        },
        $setOnInsert: {
          auth0Id,
        },
      },
       {
        upsert: true
      }
    );
  }
 default:
    console.log('Unhandled event type', event.type);
  }

  res.status(200).json({ received: true });

}
  };


export default cors(handler);
