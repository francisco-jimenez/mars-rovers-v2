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
                  that.props.getScenarioFromTextInput(obj)
                } catch (e) {
                  alert('Not supported file'); // You get an error.
                  console.log(e.message)
                }
            };
            reader.readAsText(file);
        }
    }

    render() {
      return <span>
        <label for="fileuploader" className = "label">JSON file to test  </label>
        <input type="file"
        className = "testInput"
        id = "fileUploader"
        name="myFile"
        onChange={this.uploadFile.bind(this)} />
      </span>
    }
}
