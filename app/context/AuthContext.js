'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, provider, db } from '../../lib/firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchRecipes(user.uid);
      } else {
        setUser(null);
        setRecipes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).catch((error) => console.error(error));
  };

  const logout = () => {
    signOut(auth).catch((error) => console.error(error));
  };

  const saveRecipe = async (recipe) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'recipes'), {
        uid: user.uid,
        recipe: {
          name: recipe.name,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          imageUrl: recipe.imageUrl,
          posted: false,
          likes: 0,
          likedBy: [],
        },
        createdAt: new Date(),
      });
      fetchRecipes(user.uid);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const fetchRecipes = async (uid) => {
    try {
      const q = query(collection(db, 'recipes'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const userRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().recipe,
      }));
      setRecipes(userRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout, saveRecipe, recipes, fetchRecipes }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);