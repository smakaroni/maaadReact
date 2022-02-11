import logo from './logo.svg';
import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import {useContext} from "react";
import AuthContext from "./store/auth-context";
import FoodPage from "./pages/FoodPage";
import Layout from "./components/Layout/Layout";

function App() {
  const authContext = useContext(AuthContext);

  return (
      <Layout>
        <Switch>
          <Route path="/" exact>
            <HomePage/>
          </Route>
          {!authContext.loggedIn && (
              <Route path="/auth">
                <AuthPage />
              </Route>
          )}
          <Route path="/posts">
            {authContext.loggedIn && <FoodPage />}
            {!authContext.loggedIn && <Redirect to="/auth" />}
          </Route>
          <Route path="*">
            <Redirect to="/"/>
          </Route>
        </Switch>
      </Layout>
  );
}

export default App;
