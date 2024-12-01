import React from 'react';
import './App.css';


let tasks:string[] = []


class Pinboard extends React.Component<{},{items:string[]}> {
  constructor(props:{}) {
    super(props);
    this.state = {
      items: tasks
    }
    this.updateNotes = this.updateNotes.bind(this);
  }

  componentDidMount(): void {
    fetch("/api")
    .then((res) => res.json())
    .then((data) =>  {
      this.setState({items: data.message.split(",")});
      tasks = this.state.items;
    });
  }

  updateNotes() {
    this.setState({
      items: tasks
    });
  }

  render() {
    const items= this.state.items.map(i => <Note title={i}/>)

    return (
      <>
        <div className="Pinboard">
          {!items ? <></> : <ul>{items}</ul>}
        </div>
        <NoteAdder updatePin={this.updateNotes}/>
      </>
    )
  }
}


class Note extends React.Component<{title:string},{style:{textDecoration: string, color: string},render:boolean}> {
  constructor(props:any) {
    super(props);
    this.state = {
      style: {
        textDecoration: "none",
        color: "#2B386E"
      },
      render: true

    }
    this.ticked = this.ticked.bind(this);
    this.hidden = this.hidden.bind(this);
  }

  ticked() {
    if (this.state.style.textDecoration === "none") {
      this.setState(
        {style: {textDecoration: "line-through", color: "grey"}}
      )
    } else {
      this.setState(
        {style: {textDecoration: "none", color:"#2B386E"}}
      )
    }
  }

  hidden() {
    if (this.state.render) {
      this.setState({
        render: false
      });
      tasks = tasks.filter(i => i !== this.props.title);
      fetch("/post",
        {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'},
          body: JSON.stringify({message:tasks.join(",")})
        }
      )
    }
  }

  render() {
    if (this.state.render) {
      return (
        <li>
          <h1 style={this.state.style}>{this.props.title}</h1>
          <div className="buttons">
            <button type="button" className="greenButton" onClick={this.ticked}>TICK DONE</button>
            <button type="button" className="redButton" onClick={this.hidden}>DELETE</button>
          </div>
        </li>
      )
    } else {
      return <></>
    }
  }
}

class NoteAdder extends React.Component<{updatePin:Function},{input:string,submitInput:string}> {
  constructor(props:any) {
    super(props)
    this.state = {
      input: '',
      submitInput: ''
    }
    this.inputNote = this.inputNote.bind(this);
    this.inputUpdate = this.inputUpdate.bind(this);
  }

  inputNote(event:any) {
    this.setState({
      input: event.target.value
    })
  }

  inputUpdate(event:any) {
    event.preventDefault();
    if (this.state.input) {
      this.setState({
        submitInput: this.state.input
      })
      tasks.push(this.state.input)
      this.props.updatePin();
    }
  }

  

  render() {
    return (
      <div id="NoteAdder">
        <h2 style={{color:"#2B386E"}}>Add Notes</h2>
        <form onSubmit={this.inputUpdate}>
          <textarea value={this.state.input} onChange={this.inputNote} placeholder="Write your new note here"></textarea>
          <button type="submit" className="noteButton">Add Note</button>
        </form>
      </div>
    )
  }
}


function App() {
  return (
    <div className="App">
      <header><h1>To Do List</h1></header>
      <Pinboard />
    </div>
  );
}

export default App;