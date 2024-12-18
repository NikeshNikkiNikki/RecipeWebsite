'use client';
import { useState, useEffect, useContext, createContext } from 'react';

export const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavorites(data.favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error.message);
      }
    };
    fetchFavorites();
  }, []);

  const addFavorite = async (recipe) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error('Failed to save favorite');
      }

      const data = await response.json();
      setFavorites((prevFavorites) => [...prevFavorites, data.favorite]);
    } catch (error) {
      console.error('Error saving favorite:', error.message);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete favorite');
      }

      setFavorites((prevFavorites) =>
        prevFavorites.filter((recipe) => recipe.recipeId !== recipeId)
      );
    } catch (error) {
      console.error('Error deleting favorite:', error.message);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
