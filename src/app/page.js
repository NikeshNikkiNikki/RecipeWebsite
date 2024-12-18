'use client';
import { useState, useEffect } from 'react';
import RecipeCard from './components/RecipeCard';
import { useFavorites } from './context/favorites';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { favorites } = useFavorites();
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewFavorites, setViewFavorites] = useState(false);
  const recipesPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        if (data.meals) {
          setRecipes(data.meals);
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = viewFavorites ? favorites : recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil((viewFavorites ? favorites.length : recipes.length) / recipesPerPage); i++) {
    pageNumbers.push(i);
  }

  const getRandomRecipe = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data.meals) {
        router.push(`/recipe/${data.meals[0].idMeal}`);
      }
    } catch (error) {
      console.error('Error fetching random meal:', error);
    }
  };

  return (
    <div>
      <div className="w-full h-20 bg-[var(--color-primary)] pattern flex items-center justify-center flex-col">
        <div className="w-56 h-2/4 bg-black flex items-center justify-center">
          <h1 className="text-white text-4xl font-extrabold">RECIPES</h1>
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={getRandomRecipe}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-orange-600"
        >
          Suggest Me a Random Recipe
        </button>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setViewFavorites(false)}
          className={`px-4 py-2 border rounded-md ${!viewFavorites ? 'bg-[var(--color-primary)] text-white hover:bg-orange-600' : 'bg-white text-black'}`}
        >
          All Recipes
        </button>
        <button
          onClick={() => setViewFavorites(true)}
          className={`px-4 py-2 border rounded-md ${viewFavorites ? 'bg-[var(--color-primary)] text-white ' : 'bg-white text-black'}`}
        >
          Favorites
        </button>
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center mt-10 min-h-screen">
            <div className="loader text-gray-600">Please wait while we get your Recipes :P</div>
          </div>
        ) : (
          <div>
            <div className="flex">
              <ul className="text-white flex flex-wrap gap-4 p-4 mx-auto justify-center">
                {(viewFavorites ? favorites : currentRecipes).length > 0 ?
                  (viewFavorites ? favorites : currentRecipes).map((result, index) => (
                    <RecipeCard key={index} recipe={result} />
                  )) : (
                    <div>No Recipes Found</div>
                  )}
              </ul>
            </div>
            <div className="flex justify-center my-4">
              <nav>
                <ul className="flex space-x-4">
                  {!viewFavorites && pageNumbers.map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 border rounded-md ${currentPage === number ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-black'}`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
