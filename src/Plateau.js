import React from 'react'
import NumericInput from 'react-numeric-input';

export default class Plateau extends React.Component {
	constructor(props){
		super()
    this.plateau = props.plateau;
	}

	handleNSChange (number){
    this.plateau.axisNS = number;
    this.props.getPlateau(this.plateau);
	}
  handleEWChange (number){
    this.plateau.axisEW = number;
    this.props.getPlateau(this.plateau);
  }

	render(){
		return (
      <div>
          <h3>PLATEAU</h3>
          N-S Axis:
          <NumericInput
              min = {0}
              onChange={this.handleNSChange.bind(this)}
              value= {this.plateau.axisNS}
          />
          <br/>
          E-W Axis:
          <NumericInput
              min = {0}
              onChange={this.handleEWChange.bind(this)}
              value= {this.plateau.axisEW}
          />
      </div>

			)
	}
}
