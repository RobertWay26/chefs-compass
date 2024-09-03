'use client';

import { useState } from 'react';

const RecipeForm = ({ setGeneratedRecipe, setImageUrl }) => {
  const [ingredients, setIngredients] = useState('');
  const [appliances, setAppliances] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map((item) => item.trim()),
          appliances: appliances.split(',').map((item) => item.trim()),
          cuisine: cuisine.trim(),
        }),
      });

      const data = await response.json();
      setGeneratedRecipe(data.recipe); // Passing to parent
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Failed to fetch recipe or image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed left-0 top-20 h-full max-h-screen w-1/4 p-6 bg-background shadow-md border-r border-secondary overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="text"
          placeholder="Appliances (comma separated)"
          value={appliances}
          onChange={(e) => setAppliances(e.target.value)}
          className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="text"
          placeholder="Cuisine type (e.g., Italian)"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary text-white py-2 rounded-md hover:bg-primary transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;