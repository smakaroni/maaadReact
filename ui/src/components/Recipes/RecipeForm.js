import {useState, useContext, useEffect, useCallback} from "react";
import AuthContext from "../../store/auth-context";
import Errors from "../Errors/Errors";
import {Box, Button, Grid, TextareaAutosize, TextField} from "@mui/material";

const RecipeForm = (props) => {
  const authContext = useContext(AuthContext);
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [imgUrlValue, setImgUrlValue] = useState('');
  const [errors, setErrors] = useState({});
  const [ingredientsValue, setIngredientsValue] =useState([]);

  const populateField = useCallback(() => {
      if (props.recipe) {
          setTitleValue(props.recipe.Title);
          setContentValue(props.recipe.Content);
          setImgUrlValue(props.recipe.ImgUrl);
          setIngredientsValue(props.recipe.Ingredients);
      }
  }, [props.recipe]);

  useEffect(() => {
      populateField();
  }, [populateField]);

  async function submitHandler(event) {
      event.preventDefault();
      setErrors({});

      try {
          const method = props.onEditRecipe ? 'PUT' : 'POST';
          let body = {
              Title: titleValue,
              Content: contentValue,
              ImgUrl: imgUrlValue,
              ingredients: ingredientsValue,
          }
          if (props.onEditRecipe) {
              body.Id = props.recipe.Id;
          }
          const response = await fetch('api/recipes',
              {
                  method: method,
                  body: JSON.stringify(body),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+authContext.token,
                  },
              });
          const data = await response.json();
          if (!response.ok) {
              let errorText = 'Failed to add new recipe';
              if (!data.hasOwnProperty('error')) {
                  throw new Error(errorText);
              }
              if ((typeof data['error'] === 'string')) {
                  setErrors({'unknown': data['error']})
              } else {
                  setErrors(data['error']);
              }
          } else {
              setTitleValue('');
              setContentValue('');
              setImgUrlValue('')
              if (props.onAddRecipe) {
                  props.onAddRecipe(data.data);
              }
              if (props.onEditRecipe) {
                  props.onEditRecipe(data.data);
              }
          }
      } catch (error) {
          setErrors({"error": error.message});
      }
  };
  
  const titleChangeHandler = (event) => {
    setTitleValue(event.target.value);
  }
  const contentChangedHandler = (event) => {
    setContentValue(event.target.value);
  }
  const imgUrlChangeHandler = (event) => {
    setImgUrlValue(event.target.value);
  }

  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);
  const submitButtonText = props.onEditRecipe ? 'Update Recipe' : 'Add Recipe';

  return (
      <Grid container sx={{width:1}}>
          <Grid item xs={4} md={4} xl={4}></Grid>
          <Grid item xs={4} md={4} xl={4}>
          <Box component="form" onSubmit={submitHandler}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  autoFocus
                  onChange={titleChangeHandler}/>
              <TextareaAutosize
                  margin="normal"
                  minRows={3}
                  placeholder="Instructions *"
                  style={{width:"100%"}}
                  id="content"
                  label="Instructions"
                  name="content"
                  onChange={contentChangedHandler}/>
              <TextField
                  margin="normal"
                  fullWidth
                  id="imgUrl"
                  label="Image url"
                  name="imgUrl"
                  onChange={imgUrlChangeHandler}/>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 3, mb: 2}}>
                  {submitButtonText}
              </Button>
          </Box>
          </Grid>
          <Grid item xs={4} md={4} xl={4}></Grid>
          {errorContent}
          {/*<div className="container w-75 pb-4">*/}
          {/*  <form onSubmit={submitHandler}>*/}
          {/*      <div className="form-group pb-3">*/}
          {/*          <label htmlFor="title">Title</label>*/}
          {/*          <input id="title" type="text" className="form-control" required value={titleValue} onChange={titleChangeHandler}/>*/}
          {/*      </div>*/}
          {/*      <div className="form-group pb-3">*/}
          {/*          <label htmlFor="content">Content</label>*/}
          {/*          <textarea id="content" className="form-control" rows="5" required value={contentValue} onChange={contentChangedHandler}></textarea>*/}
          {/*      </div>*/}
          {/*      <div className="form-group pb-3">*/}
          {/*          <label htmlFor="imgUrl">Image url</label>*/}
          {/*          <input id="imgUrl" className="form-control" value={imgUrlValue} onChange={imgUrlChangeHandler}></input>*/}
          {/*      </div>*/}
          {/*      <button type="submit" className="btn btn-success">{submitButtonText}</button>*/}
          {/*  </form>*/}
          {/*    {errorContent}*/}
          {/*</div>*/}
      </Grid>
  );
}

export default RecipeForm;