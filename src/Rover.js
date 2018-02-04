import React from 'react'
import NumericInput from 'react-numeric-input';

export default class Rover extends React.Component {
	constructor(props){
		super()
    this.rover = {
      deploy : {coordNS : 0 , coordEW : 0},
      move : ''
    };
    this.whatRover = props.whatRover;
	}

	handleNSChange (number){
    this.rover.deploy.coordNS = number;
    this.props.getRover(this.rover, this.whatRover);
	}
  handleEWChange (number){
    this.rover.deploy.coordEW = number;
    this.props.getRover(this.rover, this.whatRover);
  }
  handleMoveChange (event){
    this.rover.move = event.target.value;
    this.props.getRover(this.rover, this.whatRover);
  }

	render(){
		return (
      <div>
          <h3>ROVER {this.whatRover}</h3>
          N-S Deploy:
          <NumericInput
              min = {0}
              onChange={this.handleNSChange.bind(this)}
              value= {this.rover.deploy.coordNS}
          />
          <br/>
          E-W Deploy:
          <NumericInput
              min = {0}
              onChange={this.handleEWChange.bind(this)}
              value= {this.rover.deploy.coordEW}
          />
          <br/>
          Move: <input type = "text" onChange = {this.handleMoveChange.bind(this)} />
      </div>

			)
	}
}
