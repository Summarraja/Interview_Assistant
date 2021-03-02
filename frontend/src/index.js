import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import theme from '../src/shared/components/UIElements/AppTheme/theme';
import { ThemeProvider } from '@material-ui/core/styles';


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
, document.getElementById('root'));
