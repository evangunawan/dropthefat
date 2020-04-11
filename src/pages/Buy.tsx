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
import MaterialTable from '../components/BuyMaterial/MaterialTable';
import { Material } from '../models/Material';


function Buy(){
  const [material,setMaterial] = React.useState<Material[]>([]);
  const fetchOrder = async () => {
    const db = firebase.firestore();
    const result: Material[] = [] as Material[];
    await db
      .collection('ingredient')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
  
          const newOrder: Material = {
            id: doc.id,
            name:data.name,
            price: data.price
          };
  
          result.push(newOrder);
          setMaterial(result);
        });
      });
  
    console.log(result);
  };


  React.useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, []);

    return(
      <Container width='80%' style={{ margin: '0px auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <Typography variant='h4' component='h2'>
            Material List
          </Typography>
          <Typography variant='body2' component='span'>
            Here is the list of Material.
          </Typography>
        </div>
      </div>
      <MaterialTable items={material} />
    </Container>
    );

};

export default Buy