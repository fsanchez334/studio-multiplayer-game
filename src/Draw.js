import React, {Component} from 'react';
// import RaisedButton from 'material-ui/RaisedButton';
import UserApi from './UserApi.js';
// import Avatar from 'material-ui/Avatar';
// import { List, ListItem } from 'material-ui/List';
import firebase from 'firebase';
import WhoseOnline from './WhoseOnline.js';
// import './Data.css';
import randomWords from 'random-words';

export default class Draw extends Component {


 constructor(props) {
    super(props);
    this.state = 
    {
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      randomWord: "",
      inputvalue: "",
      repeat: "",
      drawer: "",
      peopleNames: [],
      color: "#000"
    };
    // console.log(randomWords());
    
 }
 
  componentWillMount() {
    var id = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session-metadata/" + id);
    var usersId = sessionDatabaseRef.child("users");
    usersId.on("value", (snapshot) => {
      var container = snapshot.val();
      const arrayOfAllUsersName = container.map(x => {
        return {
          name: UserApi.getName(x),
          img: UserApi.getPhotoUrl(x)
        }
      })
      this.setState({
        peopleNames: arrayOfAllUsersName
      });
    })
  }  
 
 componentDidUpdate() {
       this.draw();
 }
 
 firstDrawer() {
   this.setState({
    drawer: this.state.peopleNames[0]
   });
 }

 genWord(){
  var words = randomWords();
  var id = this.props.match.params.id;
  var sessionDatabaseRef = firebase.database().ref("/session-metadata/" + id);
  sessionDatabaseRef.set({words: words});
  this.setState({
   randomWord: words
  }); 
 }
 

 getInputValue(){
  var x = document.getElementById("guess").value;
  this.setState({
   inputvalue: x
  });
 }
 
 wins(){
  if (this.state.inputvalue === this.state.randomWord) {
     this.setState({
      randomWord: randomWords()
     }); 
  } else {
     this.setState({
      repeat: "False"
     }); 
  }
 }

 draw() {
       // console.log(this.state.prevX, this.state.prevY)
       // console.log(this.state.currX, this.state.currY)
       const canvas = this.refs.canvas
       const ctx = canvas.getContext('2d');
       console.log(canvas.getBoundingClientRect());
       ctx.beginPath();
       ctx.arc(
        this.state.currX - canvas.getBoundingClientRect().left,
        this.state.currY - canvas.getBoundingClientRect().top*3,
        5, 0,
        Math.PI * 2, 
        true
       );
       ctx.strokeStyle= this.state.color;
       ctx.lineWidth = 2;
       ctx.stroke();
       ctx.closePath();
       
 }
 
 

onMouseMoved(e){
    e.stopPropagation();
   this.setState({
      prevX: this.state.currX,
      currX: e.screenX,
      prevY: this.state.currX,
     currY: e.screenY + 35,
    });
}
getRandomColor(){
   var letters= "0123456789ABCDEF"
   var color = "#"
   for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    this.setState({
     color: color
    })
 }
 
 render() {
    return (
     <div>
        <h1>Draw</h1>
        <button onClick={this.genWord.bind(this)}>New Word</button>
        <p>{this.state.randomWord}</p>
        <button onClick={this.getRandomColor.bind(this)}> Change Color </button>
        <div id="canvas">
         <canvas ref="canvas" onMouseMove={this.onMouseMoved.bind(this)} id="can" width="400" height="400" style={{position: "absolute", top: "10%", left: "50%", border:"2px solid"}}></canvas>
        </div>
        <div id="online">
         <WhoseOnline peopleNames={this.state.peopleNames} session={this.props.match.params.id}/>
         <input type="text" id="guess" onChange={this.getInputValue.bind(this)}/>
         <p>{this.state.inputvalue}</p>
         <button onClick={this.wins.bind(this)}>Compare Answers</button>
         <p>{this.state.repeat}</p>
        </div>
     </div>
    
    );
  }
}

/*
 
 // var canvas, ctx, flag = false,
 //        prevX = 0,
 //        currX = 0,
 //        prevY = 0,
 //        currY = 0,
 //        dot_flag = false;

 //    var x = "black",
 //        y = 2;
    
 //    function init() {
 //        canvas = document.getElementById('can');
 //        ctx = canvas.getContext("2d");
 //        w = canvas.width;
 //        h = canvas.height;
    
 //        canvas.addEventListener("mousemove", function (e) {
 //            findxy('move', e)
 //        }, false);
 //        canvas.addEventListener("mousedown", function (e) {
 //            findxy('down', e)
 //        }, false);
 //        canvas.addEventListener("mouseup", function (e) {
 //            findxy('up', e)
 //        }, false);
 //        canvas.addEventListener("mouseout", function (e) {
 //            findxy('out', e)
 //        }, false);
 //    }
    
 //    function color(obj) {
 //        switch (obj.id) {
 //            case "green":
 //                x = "green";
 //                break;
 //            case "blue":
 //                x = "blue";
 //                break;
 //            case "red":
 //                x = "red";
 //                break;
 //            case "yellow":
 //                x = "yellow";
 //                break;
 //            case "orange":
 //                x = "orange";
 //                break;
 //            case "black":
 //                x = "black";
 //                break;
 //            case "white":
 //                x = "white";
 //                break;
 //        }
 //        if (x == "white") y = 14;
 //        else y = 2;
    
 //    }
    
 //    function draw() {
 //        ctx.beginPath();
 //        ctx.moveTo(prevX, prevY);
 //        ctx.lineTo(currX, currY);
 //        ctx.strokeStyle = x;
 //        ctx.lineWidth = y;
 //        ctx.stroke();
 //        ctx.closePath();
 //    }
    
 //    function erase() {
 //        var m = confirm("Want to clear");
 //        if (m) {
 //            ctx.clearRect(0, 0, w, h);
 //            document.getElementById("canvasimg").style.display = "none";
 //        }
 //    }
    
 //    function save() {
 //        document.getElementById("canvasimg").style.border = "2px solid";
 //        var dataURL = canvas.toDataURL();
 //        document.getElementById("canvasimg").src = dataURL;
 //        document.getElementById("canvasimg").style.display = "inline";
 //    }
    
 //    function findxy(res, e) {
 //        if (res == 'down') {
 //            prevX = currX;
 //            prevY = currY;
 //            currX = e.clientX - canvas.offsetLeft;
 //            currY = e.clientY - canvas.offsetTop;
    
 //            flag = true;
 //            dot_flag = true;
 //            if (dot_flag) {
 //                ctx.beginPath();
 //                ctx.fillStyle = x;
 //                ctx.fillRect(currX, currY, 2, 2);
 //                ctx.closePath();
 //                dot_flag = false;
 //            }
 //        }
 //        if (res == 'up' || res == "out") {
 //            flag = false;
 //        }
 //        if (res == 'move') {
 //            if (flag) {
 //                prevX = currX;
 //                prevY = currY;
 //                currX = e.clientX - canvas.offsetLeft;
 //                currY = e.clientY - canvas.offsetTop;
 //                draw();
 //            }
 //        }
 //    }*/