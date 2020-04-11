import * as React from 'react';
import firebase from 'firebase';
import '@firebase/firestore';
import { Ingredient } from '../../models/Ingredient';

import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button
} from '@material-ui/core';
import Container from '../../components/Container';
import { Link } from "react-router-dom";

export class DeleteIngredient extends React.Component<{}, { ready: boolean, listIngredient: any[], id: string , success: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {
      ready: false,
      listIngredient: [],
      id: ' ',
      success: false
    };

    this.handleChangeName = this.handleChangeName.bind(this)
    this.delIngredientInDB = this.delIngredientInDB.bind(this);
  }

  delIngredientInDB(){
    const db = firebase.firestore();
    // db.collection('ingredient').doc(this.state.id).delete();
    db.collection('ingredient').doc().delete();

    this.setState({ success: true });
  }

  // handleChangeId(event: any){
  //   this.setState({id: event.target.value});
  // }

  handleChangeName(event: any){
    this.setState({id: event.target.value});
  }

  componentDidMount() {
    this.addIngredientToDB();
  }

  async addIngredientToDB() {
    const db = firebase.firestore();
    let result = null;
    await db
      .collection('ingredient')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temp = [...this.state.listIngredient, doc.data()];
          this.setState({ listIngredient: temp });
        });
      });

    this.setState({ ready: true });
  }

  render() {
    const formStyle: React.CSSProperties = {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      // flexWrap: 'wrap',
      padding: '16px 0',
    };

    const btnGroupStyle: React.CSSProperties = {
       width: '100%',
       display: 'flex',
       justifyContent: 'flex-end',
     };

    if(!this.state.ready){
      return <p>Loading</p>
    }

    const items = this.state.listIngredient.map((item, key) => {
      return (
        <option value={item.id} >{item.name}</option>

      );
    });
    if(!this.state.success){
      return (
        <Container>
         <label>Choose ingredient: </label>
          <select id="name" onChange={this.handleChangeName}>
            <option>---Choose Ingredient---</option>
            {items}
          </select>
          <button onClick={this.delIngredientInDB}>Delete</button>
          <p>id   : {this.state.id}</p>
        </Container> 
      );
    }else{
      return(
        <Container>
          <h1>Success</h1>
          <Link to="/expenditure">
            <Button
              color='primary'
              style={{ fontWeight: 'bold', marginLeft: 'auto' }}
            >Back</Button>
          </Link>
        </Container>
      );
    }
  }
}

export default DeleteIngredient;