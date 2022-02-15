import { Fragment } from 'react';

import './Layout.css';

import NavigationBar from './NavigationBar';
import {Box} from "@mui/material";

const Layout = (props) => {
    return (
        <Fragment>
            <NavigationBar/>
            <main>
                <Box sx={{width:1}}>{props.children}</Box>
            </main>
        </Fragment>
    );
};

export default Layout;