import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Dropzone from 'react-dropzone'
var request = require('superagent');

function getHeader() {
  return <div className="App-header">
    <img src={logo} className="App-logo" alt="logo"/>
    <h2>Welcome to Hot Dog</h2>
  </div>
}

function onDrop(acceptedFiles, rejectedFiles) {
  console.log("Accepted:", acceptedFiles)
  console.log("Rejected:", rejectedFiles)
}

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      files: [],
      images: []
    };
    request
      .get('http://localhost:3000/images')
      .then(
        (res)=>{
          let images = res.body;
          images = images.map(img => {
              return {name : "http://localhost:3000/images/"+img.name}
          })
          this.setState({images:images});
        }
      )
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({file: file, imagePreviewUrl: reader.result});
    }

    reader.readAsDataURL(file)
  }

  onDrop(files) {
    this.setState({files});
  }

  uploadFiles(){
    let req = request
      .post('http://localhost:3000/upload');
      this.state.files.forEach((file)=>{
        req.attach('file', file)
      });
      req.end(function(err, res){
        // Calling the end function will send the request
      });
  }

  render() {
    return (
      <div className="previewComponent">
        {getHeader()}
        <section>
          <div className="dropzone">
            <Dropzone onDrop={this
              .onDrop
              .bind(this)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>

          <div className="uploadFiles">
            <button onClick={()=> {this.uploadFiles()}}>Upload Files</button>
          </div>

          <aside>
            <h2>Dropped files</h2>
             {this
              .state
              .files
              .map(f => <img className="image-preview" src={f.preview}/>)
}
          </aside>
          <aside>
            <h2>Saved images</h2>
             {this
              .state
              .images
              .map(f => <img className="image-preview" src={f.name}/>)}
          </aside>
        </section>
      </div>
    )
  }
}

export default ImageUpload;