'use client';

import RecipeForm from './components/RecipeForm';
import Recipe from './components/Recipe';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const { user, saveRecipe } = useAuth();

  const handleSaveRecipe = () => {
    if (user && generatedRecipe) {
      saveRecipe({
        ...generatedRecipe,
        imageUrl,
      });
      setConfirmation('Recipe saved successfully!');
      setTimeout(() => setConfirmation(''), 3000); // Clear message after 3 seconds
    } else {
      alert('Please sign in to save recipes.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex pt-5">
      <RecipeForm setGeneratedRecipe={setGeneratedRecipe} setImageUrl={setImageUrl} />

      <div className="flex-grow ml-[25%] p-8">
        {generatedRecipe ? (
          <>
            <Recipe recipe={generatedRecipe} imageUrl={imageUrl} />
            <button
              onClick={handleSaveRecipe}
              className="mt-4 bg-accent text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors"
            >
              {user ? 'Save Recipe' : 'Sign in to Save'}
            </button>
            {confirmation && (
              <p className="mt-2 text-green-600 font-semibold">{confirmation}</p>
            )}
          </>
        ) : (
          <p className="text-lg">Generate a recipe to see it here!</p>
        )}
      </div>
    </div>
  );
}
