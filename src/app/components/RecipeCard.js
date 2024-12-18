import Link from 'next/link';

export default function RecipeCard({ recipe }) {
  const mealName = recipe.strMeal || recipe.recipeName;
  const mealImage = recipe.strMealThumb || recipe.imageURL;
  const mealCategory = recipe.strCategory || 'My Favorite'; 
  const mealId = recipe.idMeal || recipe.recipeId;

  return (
    <Link href={`/recipe/${mealId}`}>
      <div className="border border-l-4 border-t-4 border-b-8 border-r-8 border-black bg-white flex flex-col items-start p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:bg-orange-200 w-80 h-96">
        <img
          src={mealImage}
          alt={mealName}
          className="w-full h-96 object-cover rounded-xl mb-4"
        />
        <div className="space-y-2">
          <h3 className="text-l font-extrabold text-black truncate">{mealName}</h3>
          <p className="text-sm text-gray-700">{mealCategory}</p>
        </div>
      </div>
    </Link>
  );
}
