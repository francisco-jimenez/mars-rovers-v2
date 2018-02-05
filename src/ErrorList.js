import React from 'react'


export default class ErrorList extends React.Component{


line(error, index){
  return <div key={index}>{error}</div>
}

render(){
    return (

          <div >
          {
            this.props.errorList.map((error, index) =>{
                  return this.line(error,index)
            })
          }
          </div>
    )
}



}
