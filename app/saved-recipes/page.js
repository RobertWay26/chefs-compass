'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../../lib/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import Recipe from '../components/Recipe';

export default function SavedRecipes() {
  const { user, recipes, fetchRecipes } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteRecipe = async (recipeId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      fetchRecipes(user.uid); // Refresh
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  // Function to update the posted status of a recipe
  const handleUpdateRecipePostedStatus = (recipeId, postedStatus) => {
    const updatedRecipes = recipes.map((recipe) => 
      recipe.id === recipeId ? { ...recipe, posted: postedStatus } : recipe
    );
    fetchRecipes(user.uid); // Refresh
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Saved Recipes</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : user ? (
          recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <div key={index}>
                  <Recipe
                    recipe={recipe}
                    imageUrl={recipe.imageUrl}
                    onDelete={() => handleDeleteRecipe(recipe.id)}
                    onUpdateStatus={handleUpdateRecipePostedStatus}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No saved recipes found. Generate and save some recipes!</p>
          )
        ) : (
          <p className="text-center">Please sign in to view your saved recipes.</p>
        )}
      </div>
    </div>
  );
}