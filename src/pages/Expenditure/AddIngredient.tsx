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

export class AddIngredient extends React.Component<{}, { ready: boolean, id: string, name: string, price: number }> {
  constructor(props: any) {
    super(props);
    this.state = {
      ready: false,
      id: ' ',
      name: ' ',
      price: 0
    };

    this.handleChangeId = this.handleChangeId.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangePrice = this.handleChangePrice.bind(this)

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: any){
    this.addIngredientToDB()
    event.preventDefault();
  }

  handleChangeId(event: any){
    this.setState({id: event.target.value});
  }

  handleChangeName(event: any){
    this.setState({name: event.target.value});
  }

  handleChangePrice(event: any){
    this.setState({price: event.target.value});
  }

  async addIngredientToDB() {
    const db = firebase.firestore();
    db.collection('ingredient').doc().set({
        id: this.state.id,
        name: this.state.name,
        price: this.state.price
    })

    this.setState({ ready: true });
  }

  render() {
    if(this.state.ready){
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

    const btnGroupStyle: React.CSSProperties = {
       width: '100%',
       display: 'flex',
       justifyContent: 'flex-end',
     };

    const formStyle: React.CSSProperties = {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      // flexWrap: 'wrap',
      padding: '16px 0',
    };

    return (
      <Container>
        <h1>Ingredients</h1>
        <form onSubmit={this.handleSubmit} style={formStyle}>
          <label>
            Id :
            <input type="text" value={this.state.id} onChange={this.handleChangeId}/>
          </label>
          <label>
            Name :
            <input type="text" value={this.state.name} onChange={this.handleChangeName}/>
          </label>
          <label>
            Price :
            <input type="text" value={this.state.price}  onChange={this.handleChangePrice}/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </Container>
    );


  }
}

export default AddIngredient;