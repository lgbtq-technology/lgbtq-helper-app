import React from 'react';
import Layout from '../components/layout';
import AuthRequired from '../components/auth-required';
import Drop from 'react-drop-to-upload';
import fetch from 'isomorphic-fetch';

export default AuthRequired(class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  render() {
    return <Layout auth={this.props.auth}>
      <Drop onDrop={drop => this.handleDrop(drop)} onLeave={() => this.handleLeave()} onOver={() => this.handleOver()}>
        {
          this.state.active ?
            <h1>Drop file to upload</h1>
          :
            <h1>Drag file here</h1>
        }
        { this.state.active || <FileInput onFiles={drop => this.handleDrop(drop)} multiple /> }
      </Drop>
    </Layout>;
  }

  async handleDrop(drop) {
    const data = new FormData();
    let n = 0;
    drop.forEach(f => data.append(`file-${n++}`, f))
    data.append('sid', this.props.auth.sid)
    const result = await fetch(`http://localhost:3001/-/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.props.auth.sid}`
      },
      body: data
    })

    console.warn(drop, result, await result.json());
  }

  handleOver() {
    this.setState({active: true});
  }

  handleLeave() {
    this.setState({active: false});
  }
})

class FileInput extends React.Component {
  render() {
    const props = {...this.props};
    delete props.onFiles;
    return <input ref='file' type='file' onChange={() => this.handleChange()} accept='image/*' {...props} />
  }

  handleChange() {
    if (typeof this.props.onFiles == 'function') {
      this.props.onFiles(Array.from(this.refs.file.files))
    }
  }

}