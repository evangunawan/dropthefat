import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableFooter,
  TablePagination,
  Typography,
  withStyles,
  TextField,
} from '@material-ui/core';
import Container from '../components/Container';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';

function Employee(){
    return(
        <div>
        <h1>Employee</h1>
        </div>
    );

};

export default Employee