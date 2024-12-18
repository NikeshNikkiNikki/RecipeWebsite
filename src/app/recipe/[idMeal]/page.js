'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useFavorites } from '@/app/context/favorites';

export default function RecipePage() {
  const { idMeal } = useParams();
  const [recipe, setRecipe] = useState(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    if (idMeal) {
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.meals) {
            setRecipe(data.meals[0]);
          }
        });
    }
  }, [idMeal]);

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    const isFavorite = favorites.some((fav) => fav.recipeId === recipe.idMeal);
    console.log(recipe)
    if (isFavorite) {
      await removeFavorite(recipe.idMeal);
    } else {
      await addFavorite({
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory,
      });
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-bold text-gray-500">Loading...</p>
      </div>
    );
  }

  const steps = recipe.strInstructions.split('\r\n').filter((step) => step.trim() !== '');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-96 object-cover"
        />
        <div className="p-6 space-y-6">
          <div className='flex justify-between'>
            <h1 className="text-3xl font-extrabold text-gray-900">{recipe.strMeal}</h1>
            <button
              onClick={handleToggleFavorite}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-orange-600"
            >
              {favorites.some((fav) => fav.recipeId === recipe.idMeal)
                ? 'Remove from Favorites'
                : 'Add to Favorites'}
            </button>
          </div>
          <p className="text-lg text-gray-700 font-medium">{recipe.strCategory}</p>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex justify-around">
                  <span className="font-bold text-lg text-gray-900">Step {index + 1}:</span>
                  <p className="text-gray-700 text-base w-5/6">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
