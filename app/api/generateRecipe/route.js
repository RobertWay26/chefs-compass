import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { ingredients, appliances, cuisine } = await request.json();

    const recipePrompt = `Create a recipe in ${cuisine} style using the following ingredients: ${ingredients.join(', ')}. The recipe should use the following appliances: ${appliances.join(', ')}. Provide a recipe name, a list of ingredients, and detailed steps.`;

    const recipeResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: recipePrompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const recipeText = recipeResponse.choices[0].message.content.trim();

    const [namePart, ingredientsPart, stepsPart] = recipeText.split('\n\n');
    const recipe = {
      name: namePart.replace('Recipe Name:', '').trim(),
      ingredients: ingredientsPart.replace('Ingredients:', '').trim().split('\n'),
      steps: stepsPart.replace('Steps:', '').trim().split('\n'),
    };

    const imagePrompt = `A delicious dish of ${recipe.name}, prepared in ${cuisine} style, served in a beautifully arranged plate with the main ingredients: ${ingredients.join(', ')}.`;

    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: '512x512',
    });

    const imageUrl = imageResponse.data[0].url;

    return NextResponse.json({ recipe, imageUrl });
  } catch (error) {
    console.error('Error generating recipe or image:', error);
    return NextResponse.json({ error: 'Failed to generate recipe or image' }, { status: 500 });
  }
}