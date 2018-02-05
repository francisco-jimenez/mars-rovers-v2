import React, { Component } from 'react';
import './App.css';
import Plateau from './Plateau';
import Rover from './Rover';
import ErrorList from './ErrorList';
import FinalInfo from './FinalInfo';

export default class App extends React.Component {

constructor(){
  super()

  function rover() {
      this.deploy =
              {
                coordNS : 0 ,
                coordEW : 0
              },
      this.final =
              {
                coordNS : null ,
                coordEW : null ,
                orientation :null
              },
      this.move = '',
      this.orientation = 'N'
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

doMove (rover) {
  rover.final.coordNS = rover.deploy.coordNS
  rover.final.coordEW = rover.deploy.coordEW
  rover.final.orientation = rover.orientation

  for (var x = 0; x < rover.move.length; x++)
  {
    var oneMove = rover.move.charAt(x);
    if(oneMove === 'L' || oneMove === 'l'){
      if(rover.final.orientation === 'N' || rover.final.orientation === 'n') rover.final.orientation = 'E';
      else if(rover.final.orientation === 'E' || rover.final.orientation === 'e') rover.final.orientation = 'S';
      else if(rover.final.orientation === 'S' || rover.final.orientation === 's') rover.final.orientation = 'W';
      else if(rover.final.orientation === 'W' || rover.final.orientation === 'w') rover.final.orientation = 'N';
    }
    if(oneMove === 'R' || oneMove === 'r'){
      if(rover.final.orientation === 'N' || rover.final.orientation === 'n') rover.final.orientation = 'W';
      else if(rover.final.orientation === 'W' || rover.final.orientation === 'w') rover.final.orientation = 'S';
      else if(rover.final.orientation === 'S' || rover.final.orientation === 's') rover.final.orientation = 'E';
      else if(rover.final.orientation === 'E' || rover.final.orientation === 'e') rover.final.orientation = 'N';
    }
    if(oneMove === 'M' || oneMove === 'm'){
      if(rover.final.orientation === 'N' || rover.final.orientation === 'n') rover.final.coordNS = rover.final.coordNS+1;
      else if(rover.final.orientation === 'S' || rover.final.orientation === 's') rover.final.coordNS = rover.final.coordNS-1;
      else if(rover.final.orientation === 'W' || rover.final.orientation === 'w') rover.final.coordEW = rover.final.coordEW-1;
      else if(rover.final.orientation === 'E' || rover.final.orientation === 'e') rover.final.coordEW = rover.final.coordEW+1;
    }
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

    var checkPositionInbounds = (plateau, rover1, rover2, errorList, afterMoving) => {
      if (afterMoving) {
        if(plateau.axisNS < rover1.final.coordNS || plateau.axisEW < rover1.final.coordEW
            || rover1.final.coordNS < 0          || rover1.final.coordEW < 0               ) {
            errorList.push(`Rover 1 finishes out of bounds`);
        }
        if(plateau.axisNS < rover2.final.coordNS || plateau.axisEW < rover2.final.coordEW
            || rover2.final.coordNS < 0          || rover2.final.coordEW < 0               ) {
          errorList.push(`Rover 2 finishes out of bounds`);
        }
      } else {
        if(plateau.axisNS < rover1.deploy.coordNS || plateau.axisEW < rover1.deploy.coordEW) {
              errorList.push(`Rover 1 is deployed out of bounds`);
        }
        if(plateau.axisNS < rover2.deploy.coordNS || plateau.axisEW < rover2.deploy.coordEW) {
          errorList.push(`Rover 2 is deployed out of bounds`);
        }
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

    checkPositionInbounds(this.state.plateau, this.state.rover1, this.state.rover2, errorList, false);

    if(setErrors(errorList)) return;
    var auxRover1 = this.state.rover1;
    this.doMove(auxRover1);
    var auxRover2 = this.state.rover2
    this.doMove(auxRover2);

    checkPositionInbounds(this.state.plateau, auxRover1, auxRover2, errorList, true);

    if(setErrors(errorList)) return;

    this.setState({
              rover1   :auxRover1,
              rover2   :auxRover2,
              errorList:errorList
            })


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
          <ErrorList errorList = {this.state.errorList}/>
          <FinalInfo errorList = {this.state.errorList} rover1 = {this.state.rover1} rover2 = {this.state.rover2}/>
        </form>
    </div>
    )
  }

}
/**
  <br/>
  Plateau {this.state.plateau.axisNS} X {this.state.plateau.axisEW}
  <br/>
    Rover1: {JSON.stringify(this.state.rover1)}
  <br/>
    Rover2: {JSON.stringify(this.state.rover2)}
  <br/>
    Errors: {JSON.stringify(this.state.errorList)}
**/
