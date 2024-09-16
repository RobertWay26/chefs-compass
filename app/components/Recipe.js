'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmDelete from './ConfirmDelete';
import RecipeDetails from './RecipeDetails';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { FaThumbsUp } from 'react-icons/fa';

const Recipe = ({ recipe, imageUrl, onDelete, onUpdateStatus, showLikeButton }) => {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  // Check if user has liked the recipe
  useEffect(() => {
    if (user && recipe.likedBy && recipe.likedBy.includes(user.uid)) {
      setHasLiked(true);
    }
  }, [user, recipe.likedBy]);
  
  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onDelete();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handlePostRecipe = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeRef, { 'recipe.posted': true });
      if (onUpdateStatus) {
        onUpdateStatus(recipe.id, true);
      }
    } catch (error) {
      console.error('Error posting recipe:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemovePostRecipe = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeRef, { 'recipe.posted': false });
      if (onUpdateStatus) {
        onUpdateStatus(recipe.id, false);
      }
    } catch (error) {
      console.error('Error removing post from recipe:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLikeRecipe = async () => {
    if (!user) return;

    setIsLiking(true);
    try {
      const recipeRef = doc(db, 'recipes', recipe.id);

      if (hasLiked) {
        await updateDoc(recipeRef, {
          'recipe.likes': increment(-1),
          'recipe.likedBy': arrayRemove(user.uid),
        });
        setLikeCount((prevCount) => prevCount - 1);
        setHasLiked(false);
      } else {
        await updateDoc(recipeRef, {
          'recipe.likes': increment(1),
          'recipe.likedBy': arrayUnion(user.uid),
        });
        setLikeCount((prevCount) => prevCount + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error liking/unliking recipe:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="relative p-4 bg-gray-50 rounded-md shadow-sm">
      {user && onDelete && (
        <>
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 left-2 bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          {showConfirm && (
            <ConfirmDelete onConfirm={handleConfirm} onCancel={handleCancel} />
          )}
        </>
      )}

      {/* Post/Remove Post Button */}
      {user && onUpdateStatus && !recipe.posted && (
        <button
          onClick={handlePostRecipe}
          className="absolute top-2 right-2 bg-green-500 text-white py-1 px-2 rounded-full hover:bg-green-600 transition-colors"
          disabled={isUpdating}
        >
          {isUpdating ? 'Posting...' : 'Post'}
        </button>
      )}
      {user && onUpdateStatus && recipe.posted && (
        <button
          onClick={handleRemovePostRecipe}
          className="absolute top-2 right-2 bg-yellow-500 text-white py-1 px-2 rounded-full hover:bg-yellow-600 transition-colors"
          disabled={isUpdating}
        >
          {isUpdating ? 'Removing...' : 'Remove Post'}
        </button>
      )}

      {/* Like/Unlike Button */}
      {showLikeButton && (
        <div className="flex items-center mt-4">
          <button
            onClick={handleLikeRecipe}
            className={`${
              hasLiked ? 'bg-green-500' : 'bg-blue-500'
            } text-white py-1 px-2 rounded-full hover:${
              hasLiked ? 'bg-green-600' : 'bg-blue-600'
            } transition-colors flex items-center justify-center`}
            disabled={isLiking}
          >
            <FaThumbsUp
              className={`${isLiking ? 'spin' : ''} ${
                hasLiked ? 'text-yellow-400' : 'text-white'
              }`}
            />
          </button>
          <span className="ml-2 text-gray-700">{likeCount} Likes</span>
        </div>
      )}

      <RecipeDetails recipe={recipe} imageUrl={imageUrl} />
    </div>
  );
};

export default Recipe;