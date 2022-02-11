import {useState, useContext, useEffect, useCallback} from "react";
import AuthContext from "../../store/auth-context";
import Errors from "../Errors/Errors";

const RecipeForm = (props) => {
  const authContext = useContext(AuthContext);
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');
  const [imgUrlValue, setImgUrlValue] = useState('');
  const [errors, setErrors] = useState({});

  const populateField = useCallback(() => {
      if (props.recipe) {
          setTitleValue(props.recipe.Title);
          setContentValue(props.recipe.Content);
          setImgUrlValue(props.recipe.ImgUrl)
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
      <section>
          <div className="container w-75 pb-4">
            <form onSubmit={submitHandler}>
                <div className="form-group pb-3">
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" className="form-control" required value={titleValue} onChange={titleChangeHandler}/>
                </div>
                <div className="form-group pb-3">
                    <label htmlFor="content">Content</label>
                    <textarea id="content" className="form-control" rows="5" required value={contentValue} onChange={contentChangedHandler}></textarea>
                </div>
                <div className="form-group pb-3">
                    <label htmlFor="imgUrl">Image url</label>
                    <textarea id="content" className="form-control" rows="5" required value={imgUrlValue} onChange={imgUrlChangeHandler}></textarea>
                </div>
                <button type="submit" className="btn btn-success">{submitButtonText}</button>
            </form>
              {errorContent}
          </div>
      </section>
  );
}

export default RecipeForm;