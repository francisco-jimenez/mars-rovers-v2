import React from 'react';
import './App.css';
import Plateau from './Plateau';
import Rover from './Rover';
import ErrorList from './ErrorList';
import FinalInfo from './FinalInfo';
import FileInput from './FileInput'

export default class App extends React.Component {

constructor(){
  super()
  var testScenarios = [];
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
  this.getScenarioFromTextInput = this.getScenarioFromTextInput.bind(this)
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

getScenarioFromTextInput(JSONtestScenarios) {
    var previousPlateau = this.state.plateau;
    var previousRover1  = this.state.rover1;
    var previousRover2  = this.state.rover2;
    var previousErrorList  = this.state.errorList;

    for (var scenario of JSONtestScenarios) {
        this.checkTest(scenario);
    }

    this.state.errorList =  previousErrorList;
    this.state.plateau = previousPlateau;
    this.state.rover1 = previousRover1;
    this.state.rover2 = previousRover2;
}

checkTest(scenario){
  this.state.errorList = []
  this.state.plateau  = scenario.plateau;
  this.state.rover1   = scenario.rover1;
  this.state.rover2   = scenario.rover2;

  this.checkErrorsAndMoveRovers();

  if(this.state.errorList.length>0){
    console.log(this.state.errorList);
  } else{
    if(this.state.rover1.final.coordEW == this.state.rover1.expected.coordEW &&
        this.state.rover1.final.coordNS == this.state.rover1.expected.coordNS &&
        this.state.rover1.final.orientation == this.state.rover1.expected.orientation) {
          console.log('TEST PASSED OK!!')
        }
  }
  console.log('Plateau' , this.state.plateau.axisNS , 'X' , this.state.plateau.axisEW)
  console.log('Rover1:' , JSON.stringify(this.state.rover1))
  console.log('Rover2:' , JSON.stringify(this.state.rover2))

}

doMove (rover) {

  function changeOrientation(orientationToMatch , newOrientation){
      if(rover.final.orientation.toUpperCase() === orientationToMatch.toUpperCase()) {
          rover.final.orientation = newOrientation;
          return true;
        }
        return false;
  }

  function move(orientation , coord, amount){
      if(rover.final.orientation.toUpperCase() === orientation.toUpperCase()) {
          rover.final[coord] = rover.final[coord] + amount;
          return true;
        }
        return false;
  }


  rover.final.coordNS = rover.deploy.coordNS
  rover.final.coordEW = rover.deploy.coordEW
  rover.final.orientation = rover.orientation
  //console.log('***************')
  //console.log(rover.final.coordEW,' E ' , rover.final.coordNS,' N ',rover.final.orientation)
  for (var x = 0; x < rover.move.length; x++)
  {
    var oneMove = rover.move.charAt(x);
    if(oneMove === 'L' || oneMove === 'l'){
      if(changeOrientation('N' , 'W'));
      else if(changeOrientation('W' , 'S'));
      else if(changeOrientation('S' , 'E'));
      else if(changeOrientation('E' , 'N'));
    }
    if(oneMove === 'R' || oneMove === 'r'){
      if(changeOrientation('N' , 'E'));
      else if(changeOrientation('E' , 'S'));
      else if(changeOrientation('S' , 'W'));
      else if(changeOrientation('W' , 'N'));
    }
    if(oneMove === 'M' || oneMove === 'm'){
      if(move('N','coordNS',+1));
      else if(move('S','coordNS',-1));
      else if(move('E','coordEW',+1));
      else if(move('W','coordEW',-1));
    }
    //console.log('MOVE --> ', oneMove, '!')
    //console.log(rover.final.coordEW,' E ' , rover.final.coordNS,' N ',rover.final.orientation)
  }
}
handleSubmitEvent(event) {
  event.preventDefault();
  var state = this.checkErrorsAndMoveRovers();
  if(state){
    this.submit(state);
  }
}
checkErrorsAndMoveRovers(){
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

    if(setErrors(errorList)) return false;

    checkMoveFormat(this.state.rover1.move, '1', errorList);
    checkMoveFormat(this.state.rover2.move, '2', errorList);

    checkOrientationFormat(this.state.rover1.orientation, '1', errorList);
    checkOrientationFormat(this.state.rover2.orientation, '2', errorList);

    if(setErrors(errorList)) return false;

    checkPositionInbounds(this.state.plateau, this.state.rover1, this.state.rover2, errorList, false);

    if(setErrors(errorList)) return false;

    var auxRover1 = this.state.rover1;
    this.doMove(auxRover1);
    var auxRover2 = this.state.rover2
    this.doMove(auxRover2);

    checkPositionInbounds(this.state.plateau, auxRover1, auxRover2, errorList, true);

    if(setErrors(errorList)) return false;

    return {
              rover1   :auxRover1,
              rover2   :auxRover2,
              errorList:errorList
            }

}

submit(state){
  this.setState(state)
}



render(){
    return (
      <div>
        <form>
          <FileInput getScenarioFromTextInput = {this.getScenarioFromTextInput}></FileInput>
          <h3>..or build your own scenario</h3>
          <Plateau getPlateau = {this.getPlateau} plateau = {this.state.plateau}></Plateau>
          <Rover getRover = {this.getRover} rover= {this.state.rover1} whatRover= {1}></Rover>
          <Rover getRover = {this.getRover} rover= {this.state.rover2} whatRover= {2}></Rover>
          <br/>
          <button onClick= {this.handleSubmitEvent.bind(this)}>Go!</button>
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
