import React from 'react'
import Dropzone from 'react-dropzone'

const sendFile = (file) => {
  var formData  = new FormData();
  formData.append("data", file);
  fetch("localhost:8080/files", {
    method: 'PUT',
    body: formData
  })
  .catch(e => alert(e))
}

class Upload extends React.Component {
  constructor() {
    super()
    this.state = {
      file: null,
      dropzoneActive: false
    }
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(file) {
    this.setState({
      file,
      dropzoneActive: false
    });
    sendFile(this.state.file);
  }

  render() {
    const { accept, files, dropzoneActive } = this.state;
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    };
    const dropZoneStyle = {
      position: "relative",
      height: "100%"
    };
    const uploadHeaderStyle = {
      "font-family": "Lucida Console",
      position: "relative",
      "text-align": "center",
      "font-size": "90px",
      "color": "white"
    }
    return (
      <Dropzone
        disableClick
        style={dropZoneStyle}
        accept="application/json"
        onDrop={this.onDrop.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
      >
        { dropzoneActive && <div style={overlayStyle}>Drop files...</div> }
        <div>
          <h2 style={uploadHeaderStyle}>Dropped files</h2>
        </div>
      </Dropzone>
    );
  }
}

export default Upload

