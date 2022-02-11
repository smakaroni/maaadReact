import Recipe from "./Recipe";

const RecipesLists = (props) => {
    return (
        <ul>
            {props.recipes.map((recipe) => (
                <Recipe
                    onEditRecipe={props.onEditRecipe}
                    onDeleteRecipe={props.onDeleteRecipe}
                    key={recipe.Id}
                    recipe={recipe} />
            ))}
        </ul>
    );
};

export default RecipesLists;