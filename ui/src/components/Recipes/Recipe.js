import {useState, useContext} from "react";
import AuthContext from "../../store/auth-context";
import Errors from "../Errors/Errors";
import RecipeForm from "./RecipeForm";
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton, Menu, MenuItem,
    Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {red} from "@mui/material/colors";
import {ExpandMore} from "@mui/icons-material";
import {styled} from '@mui/material/styles'

const Recipe = (props) => {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const authContext = useContext(AuthContext);

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }));

    const handleSettingsMenu = (event) => {
      setAnchorEl(event.currentTarget);
    }
    const handleClose = (event) => {
      setAnchorEl(null);
    }
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    }

  const switchModeHandler = () => {
      setEditing((prevState) => !prevState);
      setErrors({});
  };

  async function deleteHandler() {
      try {
          const response = await fetch('api/recipes/'+props.recipe.Id,
              {
                  method: 'DELETE',
                  headers: {
                      'Authorization': 'Bearer '+authContext.token,
                  },
              });
          const data = await response.json();
          if (!response.ok) {
              let errorText = 'Failed to delete recipe';
              if (!data.hasOwnProperty('error')) {
                  throw new Error(errorText);
              }
              if ((typeof data['error'] === 'string')) {
                  setErrors({'unknown': data['error']});
              } else {
                  setErrors(data['error']);
              }
          } else {
              props.onDeleteRecipe(props.recipe.Id);
              handleClose();
          }
      } catch (error) {
          setErrors({'error': error.message});
      }
  };

  const editRecipeHandler = () => {
    setEditing(false);
    props.onEditRecipe();
  }

  const cardTitle = editing ? 'Edit recipe' : props.recipe.Title;
  const cardDate = props.recipe.CreatedAt;
  const cardImg = props.recipe.ImgUrl;
  const cardIngredients = props.recipe.ingredients;
  const cardBody = editing ? <RecipeForm recipe={props.recipe} onEditRecipe={editRecipeHandler} editing={true}/> : props.recipe.Content;
  const switchModeButtonText = editing ? 'Cancel' : 'Edit';
  const cardButtons = editing ?
      <div className="container">
          <button type="button" className="btn btn-link" onClick={switchModeHandler}>{switchModeButtonText}</button>
          <button type="button" className="btn btn-danger float-right mx-3" onClick={deleteHandler}>Delete</button>
      </div>
      :
      <div className="container">
          <button type="button" className="btn btn-link" onClick={switchModeHandler}>{switchModeButtonText}</button>
          <button type="button" className="btn btn-danger float-right mx-3" onClick={deleteHandler}>Delete</button>
      </div>
  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);

  return (
      <Card sx={{maxWidth: "100%"}}>
          <CardHeader
              avatar={
                  <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                      R
                  </Avatar>
              }
              action={
                  <div>
                      <IconButton aria-label="settings" aria-controls="settings-menu" aria-haspopup="true" onClick={handleSettingsMenu}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                          id="settings-menu"
                          anchorEl={anchorEl}
                          anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                          }}
                          keepMounted
                          transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                          }}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                          >
                          <MenuItem onClick={deleteHandler}>Delete</MenuItem>
                          <MenuItem onClick={handleClose}>Edit</MenuItem>
                      </Menu>
                  </div>
              }
              title={
                  <Typography variant="h6">
                      {cardTitle}
                  </Typography>
              }
              subheader={
                  cardDate
              }
              />
          <CardMedia
              component="img"
              height="194"
              image={cardImg ? cardImg : 'https://via.placeholder.com/500'}
              alt="Bla Bla"
              />
          <CardContent>
              <Typography variant="h6">
                  Ingredients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                  {cardIngredients ? cardIngredients.map((ingredient) => (
                      <p key={ingredient.Id}>{ingredient.Name} {ingredient.Amount} {ingredient.Unit}</p>
                  )) : "hej hej"}

              </Typography>
          </CardContent>
          <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                  <FavoriteIcon/>
              </IconButton>
              <IconButton aria-label="share">
                  <ShareIcon />
              </IconButton>
              <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded="show more"
                  >
                  <ExpandMoreIcon />
              </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                  <Typography variant="h6">Instructions</Typography>
                  <Typography paragraph>
                      {cardBody}
                  </Typography>
              </CardContent>
          </Collapse>
      </Card>
  );
};

export default Recipe;