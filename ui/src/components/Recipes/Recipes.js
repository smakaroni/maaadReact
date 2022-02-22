import {useContext, useState, useEffect, useCallback} from "react";
import AuthContext from "../../store/auth-context";
import Errors from "../Errors/Errors";
import RecipeForm from "./RecipeForm";
import RecipesLists from "./RecipesLists";
import {Box, Container, Fab, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";



const Recipes = () => {
    const authContext = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [errors, setErrors] = useState({});
    const [adding, setAdding] = useState(false);

    const fetchRecipesHandler = useCallback(async () => {
        setErrors({});

        try {
            const response = await fetch('/api/recipes',
                {
                    headers: {
                        'Authorization': 'Bearer ' + authContext.token,
                    },
                });
            const data = await response.json();
            if (!response.ok) {
                let errorText = 'Fetching recipes failed';
                if (!data.hasOwnProperty('error')) {
                    throw new Error(errorText);
                }
                if ((typeof data['error'] === 'string')) {
                    setErrors({'unknown': data['error']});
                } else {
                    setErrors(data['error']);
                }
            } else {
                setRecipes(data.data);
            }
        } catch (error) {
            setErrors({'error': error.message});
        }
    }, [authContext.token]);

    useEffect(() => {
        fetchRecipesHandler();
    }, [fetchRecipesHandler]);

    const addRecipeHandler = (recipeData) => {
        setRecipes((prevState) => { return [...prevState, recipeData] });
    }

    const deleteRecipeHandler = (recipeID) => {
        setRecipes((prevState) => {
            return prevState.filter(recipe => { return recipe.Id !== recipeID; })
        })
    }

    const editRecipeHandler = () => {
        fetchRecipesHandler();
    }
    const addHandler = () => {
        setAdding((prevState) => !prevState);
    }

    const recipeContent = recipes.length === 0 ?
        <p>No posts yet</p>
        :
        <RecipesLists
            recipes={recipes}
            onEditRecipe={editRecipeHandler}
            onDeleteRecipe={deleteRecipeHandler} />;

    const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);

    return (
        <Box  sx={{width: 1}}>
            <Typography variant="h4" textAlign="center">My Recipes</Typography>
            {adding ? <RecipeForm onAddRecipe={addRecipeHandler}/> : ''}

            {errorContent}
            {recipeContent}
            <Box sx={{'& > :not(style)': {m:1}}}>
                <Fab color="primary" aria-label="add" style={{position: 'fixed', bottom: 10, right: 16}}>
                    <AddIcon onClick={addHandler} />
                </Fab>
            </Box>
        </Box>
    );
};

export default Recipes;