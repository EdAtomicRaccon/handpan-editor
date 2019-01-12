import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGhost } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { faDotCircle } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faHandPaper } from '@fortawesome/free-solid-svg-icons'

library.add(faGhost);
library.add(faCircle);
library.add(faDotCircle);
library.add(faArrowLeft);
library.add(faArrowRight);
library.add(faHandPaper);

//SOUND
var context;
window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
  loadSnareSound();
  loadDingSound();
  loadGhostSound();
  loadAccentSound();
}

var audioBufferSnare = null;
var audioBufferDing = null;
var audioBufferGhost = null;
var audioBufferAccent = null;


function loadSnareSound() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8000/sounds/snare.wav", true);
  request.responseType = "arraybuffer";
  request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
          audioBufferSnare = buffer;
          console.log('Audio decoded !');
      }, function(error) {
          console.error("decodeAudioData error", error);
      });
  };
  request.send();//start doing something async
}

function loadDingSound() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8000/sounds/ding.wav", true);
  request.responseType = "arraybuffer";
  request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
          audioBufferDing = buffer;
          console.log('Audio decoded !');
      }, function(error) {
          console.error("decodeAudioData error", error);
      });
  };
  request.send();//start doing something async
}

function loadGhostSound() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8000/sounds/ghost.wav", true);
  request.responseType = "arraybuffer";
  request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
          audioBufferGhost = buffer;
          console.log('Audio decoded !');
      }, function(error) {
          console.error("decodeAudioData error", error);
      });
  };
  request.send();//start doing something async
}

function loadAccentSound() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8000/sounds/accent.wav", true);
  request.responseType = "arraybuffer";
  request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
          audioBufferAccent = buffer;
          console.log('Audio decoded !');
      }, function(error) {
          console.error("decodeAudioData error", error);
      });
  };
  request.send();//start doing something async
}

function playSound(buffer,time) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(time);
}



class Note extends React.Component {
  render() {
  var note = [];
  switch(this.props.value) {
    case 'DING':
    note.push(
      <button className = {!this.props.isActive ? "square" : "activeSquare"}
                    onClick = {() => this.props.onClick()}>
                    <FontAwesomeIcon icon="dot-circle" color = {this.props.nextIsRed ? 'red' : 'blue'}/>
          </button>);
          break;
    case 'GHOST':
    note.push(
      <button className = {!this.props.isActive ? "square" : "activeSquare"}
                    onClick = {() => this.props.onClick()}>
                    <FontAwesomeIcon icon="ghost" color = {this.props.nextIsRed ? 'red' : 'blue'}/>
          </button>);
          break;
    case 'ACCENT':
    note.push(
      <button className = {!this.props.isActive ? "square" : "activeSquare"}
                    onClick = {() => this.props.onClick()}>
                    <FontAwesomeIcon icon="circle" color = {this.props.nextIsRed ? 'red' : 'blue'}/>
          </button>);
          break;
    default :
    note.push(
    <button className = {!this.props.isActive ? "square" : "activeSquare"}
              onClick = {() => this.props.onClick()}
              key = {this.props.value}
              >
              <font color = {this.props.nextIsRed ? 'red' : 'blue'}>
            {this.props.value}
            </font>
    </button>
    );
    break;
  }
  return (
    <div className = "square">
    {note}
    <button className = "square:focus"
              onClick = {() => this.props.handIsBlue()}>
              <FontAwesomeIcon icon="hand-paper" color='blue'/>
    </button>
    <button className = "square:focus"
              onClick = {() => this.props.handIsRed()}>
              <FontAwesomeIcon icon="hand-paper" color='red'/>
    </button>
    </div>
  );
}
}

class NotesArray extends React.Component {
  renderNote(i) {
    var isActive = this.props.selectedNote === i;
    return (<Note value={this.props.notes[i]}
                  key = {i}
                  isActive = {isActive}
                  nextIsRed = {this.props.hands[i]}
                  onClick = {() => this.props.selectNote(i)}
                  handIsRed = {() => this.props.handIsRed(i)}
                  handIsBlue = {() => this.props.handIsBlue(i)}
                 />
           );
  }

  renderNotes() {
    var notes = [];
    for(let i = 0 ; i < this.props.numberOfNotes ; i++) {
      notes.push(this.renderNote(i));
    }
    return notes;
  }

  render() {
  return(
    <div className="board-row">
      {this.renderNotes()}
    </div>
  );
}
}

function TimeSelector (props) {
  return(
    <div className="board-row">
    <button className = "square"
            onClick = {() => props.decreaseNumberOfTimes()}>
            <FontAwesomeIcon icon="arrow-left" />
    </button>
    <div className = "square">
      {props.numberOfTimes}
    </div>
    <button className = "square"
            onClick = {() => props.increaseNumberOfTimes()}>
            <FontAwesomeIcon icon="arrow-right" />
    </button>
    </div>
  )
}

function TimeUnitySelector (props) {
  return(
    <div className="board-row">
    <button className = "square"
            onClick = {() => props.decreaseTimeUnity()}>
            <FontAwesomeIcon icon="arrow-left" />
    </button>
    <div className = "square">
      {props.timeUnity}
    </div>
    <button className = "square"
            onClick = {() => props.increaseTimeUnity()}>
            <FontAwesomeIcon icon="arrow-right" />
    </button>
    </div>
  )
}

function PlayButton (props) {
  return(
    <div>
    <button className = "square"
            onClick = {() => props.playNotes()}>
            Play
    </button>
    <BPMSelector bmp = {props.bpm}
                increaseBPM = {() => props.increaseBPM()}
                decreaseBPM = {() => props.decreaseBPM()}
                />
    </div>
  )
}

function BPMSelector (props) {
  return(
    <div className="board-row">
    <button className = "square"
            onClick = {() => props.decreaseBPM()}>
            <FontAwesomeIcon icon="arrow-left" />
    </button>
    <div className = "square">
      {props.bpm}
    </div>
    <button className = "square"
            onClick = {() => props.increaseBPM()}>
            <FontAwesomeIcon icon="arrow-right" />
    </button>
    </div>
  )
}

class NoteSelector extends React.Component {
  renderNote(availableNote) {

    switch(availableNote) {
      case 'DING':
      return (
        <button className = "square"
                key = {availableNote}
                onClick = {() => this.props.updateNote(availableNote)}>
                      <FontAwesomeIcon icon="dot-circle" />
            </button>);
      case 'GHOST':
      return (
        <button className = "square"
                key = {availableNote}
                      onClick = {() => this.props.updateNote(availableNote)}>
                      <FontAwesomeIcon icon="ghost" />
            </button>);
      case 'ACCENT':
      return (
        <button className = "square"
                key = {availableNote}
                onClick = {() => this.props.updateNote(availableNote)}>
                      <FontAwesomeIcon icon="circle" />
            </button>);
      default :
    return (
      <button className = "square"
              key = {availableNote}
              onClick = {() => this.props.updateNote(availableNote)}>
              {availableNote}
      </button>
    );}
  }

  renderNotes() {
    const availableNotes = ['DING', 'GHOST', 'ACCENT', '1', '2', '3', '4', '5', '6','7', '8'];
    var notes = [];
    for(let i = 0 ; i < availableNotes.length ; i++) {
      notes.push(this.renderNote(availableNotes[i]));
    }
    return notes;
  }

  render() {
  return(
    <div className="board-row">
      {this.renderNotes()}
    </div>
  );
  }
}

class Score extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notes : Array(4).fill(null),
      hands : Array(4).fill(null),
      numberOfTimes : 4,
      timeUnity : 4.0,
      selectedNote : 0,
      nextIsRed : true,
      playing : false,
      bpm : 140.0,
    };

    this.selectNote = this.selectNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.playNotes = this.playNotes.bind(this);
    this.handIsRed = this.handIsRed.bind(this);
    this.handIsBlue = this.handIsBlue.bind(this);
  }

  increaseNumberOfTimes (){
    const maximumNumberOfTimes = 20;
    if(this.state.numberOfTimes >= maximumNumberOfTimes) {
      return null;
    }
    var newNumberOfTimes = this.state.numberOfTimes + 1;
    var newNotes = Array(newNumberOfTimes).fill(null);
    var newHands = Array(newNumberOfTimes).fill(null);

    this.setState({numberOfTimes: newNumberOfTimes,
                  notes : newNotes,
                  hands : newHands});
  }

  decreaseNumberOfTimes (){
    if(this.state.numberOfTimes <= 1) {
      return null;
    }
    var newNumberOfTimes = this.state.numberOfTimes - 1;
    var newNotes = Array(newNumberOfTimes).fill(null);
    var newHands = Array(newNumberOfTimes).fill(null);

    this.setState({numberOfTimes: newNumberOfTimes,
                  notes : newNotes,
                  hands : newHands});  }

  increaseTimeUnity (){
    const availableUnities = [1.0,2.0,4.0,8.0,16.0];
    var currentUnityIndex = availableUnities.indexOf(this.state.timeUnity);
    if(currentUnityIndex >= availableUnities.length -1) {
      return null;
    }
    var newTimeUnity = availableUnities[currentUnityIndex + 1];
    this.setState({timeUnity : newTimeUnity});
  }

  decreaseTimeUnity (){
    const availableUnities = [1,2,4,8,16];
    var currentUnityIndex = availableUnities.indexOf(this.state.timeUnity);
    if(currentUnityIndex <= 0) {
      return null;
    }
    var newTimeUnity = availableUnities[currentUnityIndex - 1];
    this.setState({timeUnity : newTimeUnity});
  }

  selectNote (i){
    this.setState({selectedNote : i});
  }

  handIsRed (i){
    console.log('hands :', this.state.hands)
    var newHands = this.state.hands.slice();
    newHands[i] = true;
    this.setState({hands : newHands})
  }

  handIsBlue (i){
    console.log('hands :', this.state.hands)

    var newHands = this.state.hands.slice();
    newHands[i] = false;
    this.setState({hands : newHands})
  }

  updateNote (newNote){
    var newNotes = this.state.notes.slice();
    newNotes[this.state.selectedNote] = newNote;
    var newHands = this.state.hands.slice();

    var newSelectedNote = this.state.selectedNote;
    var newNextIsRed = this.state.nextIsRed;
    newHands[this.state.selectedNote] = newNextIsRed;

    if(this.state.selectedNote < this.state.numberOfTimes -1) {
      newSelectedNote += 1;
      newNextIsRed = !newNextIsRed;
    }
    this.setState({notes : newNotes, selectedNote : newSelectedNote, nextIsRed : newNextIsRed, hands : newHands});
    playSound(audioBufferSnare,0);
  }

  playNotes () {
    const numberOfTimesPlayed = 7;
    var startTime = context.currentTime + 0.100;
    console.log('Playin stuff ', this.state.notes);
    var bpm = this.state.bpm;
    var timeUnity = this.state.timeUnity;
    var timeBetweenNotes = (60.0/bpm)/(timeUnity/4);
    console.log('Time between notes : ', timeBetweenNotes);
    for(let j=0 ; j< numberOfTimesPlayed ; j++){
    for(let i = 0 ; i < this.state.notes.length ; i++){
      console.log(this.state.notes[i]);
      if(this.state.notes[i] === null){
        continue;
      }
      switch(this.state.notes[i].toString()){
        case 'DING' :
        playSound(audioBufferDing,startTime + i*timeBetweenNotes + j*timeBetweenNotes*this.state.notes.length);
        break;
        case 'ACCENT':
        playSound(audioBufferAccent,startTime + i*timeBetweenNotes + j*timeBetweenNotes*this.state.notes.length);
        break;
        case 'GHOST' :
        playSound(audioBufferGhost,startTime + i*timeBetweenNotes + j*timeBetweenNotes*this.state.notes.length);
        break;
        default :
        break;
    }
    }
  }
    //this.setState({playing : true});
  }

  increaseBPM () {
    var newBPM = this.state.bpm + 5;
    this.setState({bpm : newBPM});
    console.log('BPM has changed to : ',this.state.bpm);
  }

  decreaseBPM () {
    var newBPM = this.state.bpm - 5;
    this.setState({bpm : newBPM});
    console.log('BPM has changed to : ',this.state.bpm);
  }
  /*updateHand (newHand){
    var newHands = this.state.hands.slice();
    newHands[this.state.]
  }*/

  render () {
    return(
      <div>
      Nombre de temps :
      <TimeSelector numberOfTimes = {this.state.numberOfTimes}
                    increaseNumberOfTimes = {() => this.increaseNumberOfTimes()}
                    decreaseNumberOfTimes = {() => this.decreaseNumberOfTimes()}
                      />
      Unité de temps :
      <TimeUnitySelector timeUnity = {this.state.timeUnity}
                          increaseTimeUnity = {() => this.increaseTimeUnity()}
                          decreaseTimeUnity = {() => this.decreaseTimeUnity()}
                          />
                          <div className = 'separator'> </div>
      Partition :
      <NotesArray numberOfNotes = {this.state.numberOfTimes}
                  selectedNote = {this.state.selectedNote}
                  selectNote = {this.selectNote}
                  handIsRed = {this.handIsRed}
                  handIsBlue = {this.handIsBlue}
                  notes = {this.state.notes}
                  hands = {this.state.hands}
                  nextIsRed = {this.state.nextIsRed}
                  />
                  <div className = 'separator'> </div>

      Choisissez vos notes ici :
      <NoteSelector updateNote = {this.updateNote}/>
      <div className = 'separator'> </div>

      Jouez votre partition ici :
      <PlayButton playNotes = {() => this.playNotes()}
                  increaseBPM = {() => this.increaseBPM()}
                  decreaseBPM = {() => this.decreaseBPM()}
                  bpm = {this.state.bpm}/>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(
  <Score />,
  document.getElementById('root')
);
