import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIApi, Configuration } from "openai";
import clientPromise from "../../lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";

export default withApiAuthRequired (async function handler(req, res) {
  const { user } = await getSession(req, res);
  const  client = await clientPromise;
  const db = client.db("blogStandard");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub
  });

  if (!userProfile?.availableTokens ) {
    res.status(403).json({ error: "Insufficient tokens" });
    return;
  }
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});



const openai = new OpenAIApi(config);

const { topic, keywords } = req.body;



// Note use other models for OET roleplay practice TTS which can
// convert text into natural sounding speech.
// see docs for other models
// this is currently not being used as a chat service, rather to generate a sngle response
//  note use delimeter in user content to avoid injecting the user content into the prompt
//  note prompt can be tweaked for the best results
const response = await openai.createChatCompletion({
  model: "gpt-3.5-turbo-1106",
  messages: [
    {
    role: "system",
    content: "You are an SEO friendly blog post generator called BlogStandard. you are designed to output markdown without frontmatter."
    },
    {
    role: "user",
    content: `Generate a blog post on the following topic delimitted by triple hyphens:
    ---
    ${topic}
    ---
      Targetting the following comma separated keywords delimited by triple hyphens:
      ---
      ${keywords}
      ---
      `
    }
  ],
  });

  // note optional chaining to avoid errors if the response is empty
  // the syntax means if the first part is undefined, the second part is not executed. For example, if response.data is undefined, then here response.data.choices is not executed
  // console.log(response.data.choices[0]?.message?.content);

  const postContent = response.data.choices[0]?.message?.content;

  // this is only relevant for the SEO friendly title and meta description. Not needed for my OET roleplay practice TTS
  const seoResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
      role: "system",
      content: "You are an SEO friendly blog post generator called BlogStandard. you are designed to output JSON. Do not include html tags in your output."
      },
      {
      role: "user",
      content: `Generate an SEO friendly title and SEO friendly meta description for the following blog post: ${postContent}
      ---
      The output must be in the following format:
      {
      "title": "example title",
      "metaDescription": "example meta description"
      }
      `
      }
    ],
    response_format: {type: "json_object"} // this is important to get the response in JSON format
    });

    const { title, metaDescription } = seoResponse.data.choices[0]?.message?.content || {};

    //  decrement the available tokens in the database
  await db.collection("users").updateOne({
      auth0Id: user.sub
    },
    {
      $inc: {
        availableTokens: -1
      }
    });


    const post = await db.collection("posts").insertOne({
      postContent,
      title,
      metaDescription,
      topic,
      keywords,
      userId: userProfile._id,
      createdAt: new Date(),
    });

    console.log("Post at bottom", post);


  res.status(200).json({
     postId: post.insertedId,
    });
} );
