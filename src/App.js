import React from 'react';
import './App.css';
import Plateau from './Plateau';
import Rover from './Rover';
import ErrorList from './ErrorList';
import FinalInfo from './FinalInfo';
import FileInput from './FileInput'
import * as Utils from './Utils.js';

export default class App extends React.Component {

constructor(){
  super()

  var rover1 = new Utils.rover();
  var rover2 = new Utils.rover();

  var plateau = new Utils.plateau();

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


////TESTING////

checkTest(scenario){
  Utils.copyStateValues(scenario, this.state);
  this.state.errorList = []

  this.checkErrorsAndMoveRovers();

  if(this.state.errorList.length>0){
        console.log(this.state.errorList);
  } else{
    if(this.state.rover1.final.coordEW == this.state.rover1.expected.coordEW &&
        this.state.rover1.final.coordNS == this.state.rover1.expected.coordNS &&
        this.state.rover1.final.orientation == this.state.rover1.expected.orientation &&
        this.state.rover2.final.coordEW == this.state.rover2.expected.coordEW &&
        this.state.rover2.final.coordNS == this.state.rover2.expected.coordNS &&
        this.state.rover2.final.orientation == this.state.rover2.expected.orientation) {
          console.log('TEST OK!!')
        } else{
          console.log('TEST FAILED')
        }
  }
      Utils.logResults(this.state, true);
}

//////////BUSSINESS LOGIC/////////
doMove (rover) {
  rover.final.coordNS = rover.deploy.coordNS
  rover.final.coordEW = rover.deploy.coordEW
  rover.final.orientation = rover.orientation
  //console.log('***************')
  //console.log(rover.final.coordEW,' E ' , rover.final.coordNS,' N ',rover.final.orientation)
  for (var x = 0; x < rover.move.length; x++)
  {
    var oneMove = rover.move.charAt(x);
    if(oneMove === 'L' || oneMove === 'l'){
      if(Utils.changeOrientation(rover, 'N' , 'W'));
      else if(Utils.changeOrientation(rover, 'W' , 'S'));
      else if(Utils.changeOrientation(rover, 'S' , 'E'));
      else if(Utils.changeOrientation(rover, 'E' , 'N'));
    }
    if(oneMove === 'R' || oneMove === 'r'){
      if(Utils.changeOrientation(rover, 'N' , 'E'));
      else if(Utils.changeOrientation(rover, 'E' , 'S'));
      else if(Utils.changeOrientation(rover, 'S' , 'W'));
      else if(Utils.changeOrientation(rover, 'W' , 'N'));
    }
    if(oneMove === 'M' || oneMove === 'm'){
      if(Utils.move(rover, 'N','coordNS',+1));
      else if(Utils.move(rover, 'S','coordNS',-1));
      else if(Utils.move(rover, 'E','coordEW',+1));
      else if(Utils.move(rover, 'W','coordEW',-1));
    }
    //console.log('MOVE --> ', oneMove, '!')
    //console.log(rover.final.coordEW,' E ' , rover.final.coordNS,' N ',rover.final.orientation)
  }
}
checkErrorsAndMoveRovers(){
    var errorList = [];

    var setErrors = (errorList) => {
      if (errorList.length>0){
        this.setState({ errorList:errorList})
        return true;
      } else {
        return false;
      }
    }

    Utils.checkEmptyValues(this.state, errorList);

    if(setErrors(errorList)) return false;

    Utils.checkMoveFormat(this.state.rover1.move, '1', errorList);
    Utils.checkMoveFormat(this.state.rover2.move, '2', errorList);

    Utils.checkOrientationFormat(this.state.rover1.orientation, '1', errorList);
    Utils.checkOrientationFormat(this.state.rover2.orientation, '2', errorList);

    if(setErrors(errorList)) return false;

    Utils.checkPositionInbounds(this.state.plateau, this.state.rover1, this.state.rover2, errorList, false);

    if(setErrors(errorList)) return false;

    var auxRover1 = this.state.rover1;
    this.doMove(auxRover1);
    var auxRover2 = this.state.rover2
    this.doMove(auxRover2);

    Utils.checkPositionInbounds(this.state.plateau, auxRover1, auxRover2, errorList, true);

    if(setErrors(errorList)) return false;

    return {
              rover1   :auxRover1,
              rover2   :auxRover2,
              errorList:errorList
            }

}
///////EVENT HANDLERS////////
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
  var previousState = {};

  Utils.copyStateValues(this.state , previousState);

  for (var scenario of JSONtestScenarios) {
    this.checkTest(scenario);
  }

  Utils.copyStateValues(previousState , this.state);
  alert('Test finished, check console for results');
}

handleSubmitEvent(event) {
  event.preventDefault();
  var newErrorFreeState = this.checkErrorsAndMoveRovers();
  if(newErrorFreeState){
    this.setState(newErrorFreeState)
  }
  Utils.logResults(this.state,false);
}

/////////////////////////////

render(){
    return (
      <div>
          <div>
              <h2>Select test to run..</h2>
              <FileInput getScenarioFromTextInput = {this.getScenarioFromTextInput}>Upload test file</FileInput>
              <h2>..or build your own scenario</h2>
          </div>
          <div>
              <Plateau getPlateau = {this.getPlateau} plateau = {this.state.plateau}></Plateau>
          </div>
          <div className="rovers">
              <div className= "leftRover">
                  <Rover getRover = {this.getRover} rover= {this.state.rover1} whatRover= {1}></Rover>
              </div>
              <div className= "rigthRover">
                  <Rover getRover = {this.getRover} rover= {this.state.rover2} whatRover= {2}></Rover>
              </div>
          </div>
          <div>
              <button className = "OKButton" onClick= {this.handleSubmitEvent.bind(this)}>Go!</button>
          </div>
          <div className="errorList">
              <ErrorList errorList = {this.state.errorList}/>
          </div>
          <div>
              <FinalInfo errorList = {this.state.errorList} rover1 = {this.state.rover1} rover2 = {this.state.rover2}/>
          </div>
      </div>
    )
  }

}
