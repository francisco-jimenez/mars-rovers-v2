import React, { Component } from 'react';
import './App.css';
import Plateau from './Plateau';
import Rover from './Rover';

export default class App extends React.Component {

constructor(){
  super()
  this.state = {
                plateau: {},
                rover1:{},
                rover2:{},
                errors:[]
               }
  this.getPlateau = this.getPlateau.bind(this)
  this.getRover = this.getRover.bind(this)
}

getPlateau(newPlateau){
  let prevState = this.state;
  this.setState({
                  plateau : newPlateau,
                  rover1:   prevState.rover1,
                  rover2:   prevState.rover2
                })
}

getRover(newRover, whatRover){
  let prevState = this.state;
  if(whatRover == '1') {
    this.setState({
      plateau : prevState.plateau,
      rover1:   newRover,
      rover2:   prevState.rover2
    })
  } else {
    this.setState({
      plateau : prevState.plateau,
      rover1:   prevState.rover1,
      rover2:   newRover
    })
  }
}
checkErrorsAndSubmit(event){
  event.preventDefault();
  console.log('Alla vamos!')
}


render(){
    return (
      <div>
        <form>
          <Plateau getPlateau = {this.getPlateau}></Plateau>
          <Rover getRover = {this.getRover} rover= {this.rover1} whatRover= {1}></Rover>
          <Rover getRover = {this.getRover} rover= {this.rover2} whatRover= {2}></Rover>
          <br/>
          <button onClick= {this.checkErrorsAndSubmit.bind(this)}>Go!</button>
        </form>
      <br/>
      <br/>
        Plateau dim:  {this.state.plateau.axisNS}  {this.state.plateau.axisEW}
      <br/>
        Rover1: {JSON.stringify(this.state.rover1)}
        <br/>
        Rover2: {JSON.stringify(this.state.rover2)}
    </div>
    )
  }

}

//<Input getData = {this.getData}/>
//<h1>my data is {this.state.data}</h1>
