import React, { Component } from 'react';
import './App.css';
import Plateau from './Plateau';
import Rover from './Rover';

export default class App extends React.Component {

constructor(){
  super()

  function rover() {
      this.deploy =
              {
                coordNS : 0 ,
                coordEW : 0
              },
      this.move = '',
      this.orientation = 'N'
      /*
      this.doSingleMove = (move) => {
        if(move === 'L'){
          this.currentOrientation === 'N'? currentOrientation = 'E';
          this.currentOrientation === 'E'? currentOrientation = 'S';
          this.currentOrientation === 'S'? currentOrientation = 'W';
          this.currentOrientation === 'W'? currentOrientation = 'N';
        }
      }
      if(move === 'R'){
          this.currentOrientation === 'N'? currentOrientation = 'W';
          this.currentOrientation === 'W'? currentOrientation = 'S';
          this.currentOrientation === 'S'? currentOrientation = 'E';
          this.currentOrientation === 'E'? currentOrientation = 'N';
      }
      */
  };

  var rover1 = new rover();
  var rover2 = new rover();

  var plateau = {
      axisNS : 0,
      axisEW : 0
  }

  this.state = {
                plateau: plateau,
                rover1:rover1,
                rover2:rover2,
                errorList:[]
               }

  this.getPlateau = this.getPlateau.bind(this)
  this.getRover = this.getRover.bind(this)
}

getPlateau(newPlateau){
  this.setState({ plateau : newPlateau})
}

getRover(newRover, whatRover){
  if(whatRover == '1') {
    this.setState({ rover1: newRover })
  } else {
    this.setState({ rover2: newRover })
  }
}


checkErrorsAndSubmit(event){
  event.preventDefault();
  var errorList = [];

  var checkMoveFormat = (moveText, whatRover,errorList) => {
    let invalidChars = /[^lrm]/gi
    if(invalidChars.test(moveText)) {
        errorList.push(`Rover ${whatRover} move can only accepts L, R and M values`)
    }
  }

  var checkOrientationFormat = (orientationText, whatRover, errorList) => {
    let invalidChars = /[^nwes]/gi
    if(invalidChars.test(orientationText)) {
        errorList.push(`Rover ${whatRover} orientation can only accepts N, W, S and E values`)
    }
  }

  var checkEmptyValue = (value ,fieldAliasForErrorMessage, errorList) => {
    if(value === null || value === '') {
       errorList.push(`Field ${fieldAliasForErrorMessage} is empty`)
    }
  }

  var checkPositionInbounds = (plateau, rover1, rover2, errorList) => {
      if(plateau.axisNS < rover1.deploy.coordNS || plateau.axisEW < rover1.deploy.coordEW) {
        errorList.push(`Rover 1 is out of bounds`);
      }
      if(plateau.axisNS < rover2.deploy.coordNS || plateau.axisEW < rover2.deploy.coordEW) {
        errorList.push(`Rover 2 is out of bounds`);
      }
  }
  var setErrors = (errorList) => {
    if (errorList.length>0){
      this.setState({ errorList:errorList})
      return true;
    } else {
      return false;
    }
  }

  checkEmptyValue(this.state.plateau.axisNS, 'Plateau "Axis NS"',errorList);
  checkEmptyValue(this.state.plateau.axisEW, 'Plateau "Axis EW"',errorList);

  checkEmptyValue(this.state.rover1.deploy.coordNS, 'in rover1 "Cood NS"',errorList);
  checkEmptyValue(this.state.rover1.deploy.coordEW, 'in rover1 "Cood EW"',errorList);
  checkEmptyValue(this.state.rover1.move, 'in rover1 "Move"',errorList);
  checkEmptyValue(this.state.rover1.orientation, 'in rover1 "Orientation"',errorList);

  checkEmptyValue(this.state.rover2.deploy.coordNS, 'in rover2 "Cood NS"',errorList);
  checkEmptyValue(this.state.rover2.deploy.coordEW, 'in rover2 "Cood EW"',errorList);
  checkEmptyValue(this.state.rover2.move, 'in rover2 "Move"',errorList);
  checkEmptyValue(this.state.rover2.orientation, 'in rover2 "Orientation"',errorList);

  if(setErrors(errorList)) return;

  checkMoveFormat(this.state.rover1.move, '1', errorList);
  checkMoveFormat(this.state.rover2.move, '2', errorList);

  checkOrientationFormat(this.state.rover1.orientation, '1', errorList);
  checkOrientationFormat(this.state.rover2.orientation, '2', errorList);

  if(setErrors(errorList)) return;

  checkPositionInbounds(this.state.plateau, this.state.rover1, this.state.rover2, errorList);

  if(setErrors(errorList)) return;

  console.log(JSON.stringify(errorList));
}



render(){
    return (
      <div>
        <form>
          <Plateau getPlateau = {this.getPlateau} plateau = {this.state.plateau}></Plateau>
          <Rover getRover = {this.getRover} rover= {this.state.rover1} whatRover= {1}></Rover>
          <Rover getRover = {this.getRover} rover= {this.state.rover2} whatRover= {2}></Rover>
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
        <br/>
        Errors: {JSON.stringify(this.state.errorList)}
    </div>
    )
  }

}

//<Input getData = {this.getData}/>
//<h1>my data is {this.state.data}</h1>
