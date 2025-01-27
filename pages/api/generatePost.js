import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});



const openai = new OpenAIApi(config);

// hardcoded prompt for now

const topic = "dog ownership";
const keywords = "first-time dog owner, puppy, diet";

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

  res.status(200).json({ postContent: response.data.choices[0]?.message?.content });

}
