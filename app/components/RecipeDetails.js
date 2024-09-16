'use client';

const RecipeDetails = ({ recipe, imageUrl }) => (
  <>
    {imageUrl && (
      <img
        src={imageUrl}
        alt={`Image of ${recipe.name}`}
        className="w-1/2 h-auto rounded-md mb-4 pt-2"
      />
    )}
    <h2 className="text-2xl font-bold">{recipe.name || 'Unnamed Recipe'}</h2>
    <h4 className="mt-4 text-lg font-semibold">Ingredients:</h4>
    <ul className="list-inside">
      {Array.isArray(recipe.ingredients) ? (
        recipe.ingredients.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))
      ) : (
        <li className="text-gray-500">No ingredients provided.</li>
      )}
    </ul>
    <h4 className="mt-4 text-lg font-semibold">Steps:</h4>
    <ol className="list-inside">
      {Array.isArray(recipe.steps) ? (
        recipe.steps.map((step, index) => (
          <li key={index} className="text-gray-700">{step}</li>
        ))
      ) : (
        <li className="text-gray-500">No steps provided.</li>
      )}
    </ol>
  </>
);

export default RecipeDetails;