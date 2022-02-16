import Recipe from "./Recipe";
import {Box, Grid} from "@mui/material";
import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

const RecipesLists = (props) => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    return (
        <Box sx={{flexGrow: 0}}>
        <Grid container sx={{width:1}} spacing={2}>

            {props.recipes.map((recipe) => (
                <Grid item sx={{ alignItems: "center"}} xs={12} md={4} xl={4}>
                    <Item>
                <Recipe
                    onEditRecipe={props.onEditRecipe}
                    onDeleteRecipe={props.onDeleteRecipe}
                    key={recipe.Id}
                    recipe={recipe} />
                    </Item>
                </Grid>
            ))}

        </Grid>
        </Box>
    );
};

export default RecipesLists;