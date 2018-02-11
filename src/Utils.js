export function rover() {
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

export function plateau() {
    this.axisNS = 0,
    this.axisEW = 0
}



export function logResults(state, isTest){
  console.log('Plateau' , state.plateau.axisNS , 'X' , state.plateau.axisEW)
  console.log('Rover1:')
  console.log('Final position:')
  console.log(`${state.rover1.final.coordEW} , ${state.rover1.final.coordNS}  ${state.rover1.final.orientation}`)
  if(isTest)console.log('Expected:')
  if(isTest)console.log(`${state.rover1.expected.coordEW} , ${state.rover1.expected.coordNS}  ${state.rover1.expected.orientation}`)
  console.log('Rover2:')
  console.log('Final position:')
  console.log(`${state.rover2.final.coordEW} , ${state.rover2.final.coordNS}  ${state.rover2.final.orientation}`)
  if(isTest)console.log('Expected:')
  if(isTest)console.log(`${state.rover2.expected.coordEW} , ${state.rover2.expected.coordNS}  ${state.rover2.expected.orientation}`)
}


export function checkMoveFormat (moveText, whatRover,errorList) {
  let invalidChars = /[^lrm]/gi
  if(invalidChars.test(moveText)) {
      errorList.push(`Rover ${whatRover} move can only accepts L, R and M values`)
  }
}

export function checkOrientationFormat (orientationText, whatRover, errorList) {
  let invalidChars = /[^nwes]/gi
  if(invalidChars.test(orientationText)) {
      errorList.push(`Rover ${whatRover} orientation can only accepts N, W, S and E values`)
  }
}

export function checkEmptyValue (value ,fieldAliasForErrorMessage, errorList) {
  if(value === null || value === '') {
     errorList.push(`Field ${fieldAliasForErrorMessage} is empty`)
  }
}

export function checkPositionInbounds (plateau, rover1, rover2, errorList, afterMoving) {
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

export function checkEmptyValues(state, errorList){
  checkEmptyValue(state.plateau.axisNS, 'Plateau "Axis NS"',errorList);
  checkEmptyValue(state.plateau.axisEW, 'Plateau "Axis EW"',errorList);

  checkEmptyValue(state.rover1.deploy.coordNS, 'Rover1 "N-S"',errorList);
  checkEmptyValue(state.rover1.deploy.coordEW, 'Rover1 "E-W"',errorList);
  checkEmptyValue(state.rover1.move, 'Rover1 "Move"',errorList);
  checkEmptyValue(state.rover1.orientation, 'Rover1 "Orientation"',errorList);

  checkEmptyValue(state.rover2.deploy.coordNS, 'Rover2 "Cood NS"',errorList);
  checkEmptyValue(state.rover2.deploy.coordEW, 'Rover2 "Cood EW"',errorList);
  checkEmptyValue(state.rover2.move, 'Rover2 "Move"',errorList);
  checkEmptyValue(state.rover2.orientation, 'Rover2 "Orientation"',errorList);
}
