import React from 'react'


export default class FinalInfo extends React.Component{


render(){
  if(this.props.errorList.length === 0 && this.props.rover1.final.coordNS !== null){
    return (

          <div >
              Rover 1: ({this.props.rover1.final.coordEW} East,{this.props.rover1.final.coordNS} North) :  {this.props.rover1.final.orientation}
            <br/>
              Rover 2: ({this.props.rover2.final.coordEW} East, {this.props.rover2.final.coordNS} North) :  {this.props.rover2.final.orientation}
          </div>
    )
  } else{
    return null
  }
}



}
