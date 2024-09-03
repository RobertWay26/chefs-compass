'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Recipe from '../components/Recipe';

export default function PostedRecipes() {
  const [postedRecipes, setPostedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostedRecipes = async () => {
      try {
        const q = query(
          collection(db, 'recipes'),
          where('recipe.posted', '==', true),
          orderBy('recipe.likes', 'desc') // Order by likes in descending order
        );

        const querySnapshot = await getDocs(q);
        const fetchedRecipes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().recipe,
        }));
        setPostedRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching posted recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostedRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Posted Recipes</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : postedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postedRecipes.map((recipe, index) => (
              <div key={index}>
                <Recipe recipe={recipe} imageUrl={recipe.imageUrl} showLikeButton={true} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No recipes have been posted yet.</p>
        )}
      </div>
    </div>
  );
}