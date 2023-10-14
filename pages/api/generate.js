import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const ingredient = req.body.ingredient || '';
  if (ingredient.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter only one ingredient because we all know you don't have anything else :-)",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredient),
      temperature: 0.5,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(ingredient) {
  const capitalizedIngredient =
    ingredient[0].toUpperCase() + ingredient.slice(1).toLowerCase();
  return `You are a funny generator of food items that take no effort to make. The user will provide you with an input of one ingredient. Suggest one food dish for lazy people that are not very nutritious but still edible. Do not include recipes. Make your response as short as a tweet. Be funny.

Ingredient: Cheese
Dish: Cheesy Cheese: Take a slice of cheese, fold it in half.
Ingredient: ${capitalizedIngredient}
Dish: `;
}
