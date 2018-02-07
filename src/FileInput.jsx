import React from 'react';

export default class FileInput extends React.Component {
    constructor(props) {
      super(props)
      this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile(event) {
        let file = event.target.files[0];
        console.log(file);
        var that = this;
        if (file) {
            var reader = new FileReader();

            reader.onload = function(){
                var text = reader.result;
                var obj = {};
                try {
                  obj = JSON.parse(text);
                  that.props.getScenarioFromTextInput(JSON.parse(text))
                } catch (e) {
                  alert('archivo no valido'); // You get an error.
                }
            };
            reader.readAsText(file);
        }
    }

    render() {
      return <span>
        <h3>Select test to run.</h3>
        <input type="file"
        name="myFile"
        onChange={this.uploadFile.bind(this)} />
      </span>
    }
}
