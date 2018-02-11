import React from 'react'
import NumericInput from 'react-numeric-input';

export default class Rover extends React.Component {
	constructor(props){
		super()
    this.rover = props.rover;
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
  handleOrientationChange (event){
    this.rover.orientation = event.target.value;
    this.props.getRover(this.rover, this.whatRover);
  }


	render(){
		return (
		<div>
					<h3>ROVER {this.whatRover}</h3>
			<div className = "rovers">
					<div className = "roverLabels">
						<div className = "label">
								E-W:
						</div>
						<div className = "label">
								 N-S:
						</div>
						<div className = "label">
								Orientation:
						</div>
						<div className = "label">
								 Move:
						</div>
					</div>
	      <div className = "roverInputs">
						<div>
							<NumericInput
								className = "input"
								min = {0}
								onChange={this.handleEWChange.bind(this)}
								value= {this.rover.deploy.coordEW}
								/>
						</div>
						<div>
								<NumericInput
									className = "input"
									min = {0}
									onChange={this.handleNSChange.bind(this)}
									value= {this.rover.deploy.coordNS}
									/>
						</div>
						<div>
								<input className= " input orientationInput" type = "text"
									onChange = {this.handleOrientationChange.bind(this)}
									value= {this.rover.orientation}
									maxLength="1"
									/>
						</div>
						<div>
									<input type = "text"
										className = "input"
										onChange = {this.handleMoveChange.bind(this)}
										/>
						</div>
		      </div>
			</div>
		</div>
			)
	}
}
