import './App.css';
import { useState } from 'react';
import { useRef } from 'react';
import React from 'react';
import { act } from 'react-dom/test-utils';

function App() {
  const startfrom = 301

  let [activeplayerid, setActivePlayerID] = useState(0)
  var [players, setPlayers] = useState(['Player1', 'Player2', 'Player3']) //contains all playernames
  var [scores, setScores] = useState([startfrom, startfrom, startfrom])
  let [showscorepad, setShowScorePad] = useState(true)

  let [shotcount, setShotCount] = useState(0) //represents first, second or third shot
  let [threedartscores, setThreeDartScores] = useState(["1st","2nd","3rd"]); //saves all three scores combined
  let [multiplicator, setMultiplicator] = useState(1);
  var tempinput = 0 //stores the numvalues for doubledigit inputs
  
  function handleClick(shotscore) { //handles the score inputs from the ScorePad buttons - each shot/pad-entry calls this function
    if(shotscore!='back') //if the shot score is a number, proceed with the operation
    {
      detectCheaters(shotscore) //throws messages if impossible score is detected
      updateShotCount(true) //increases shotcount-value to indicate a shot has been shot
      updateThreeDartScoreArray(shotscore, shotcount)

      let helpscorearray = scores.slice();
      helpscorearray[activeplayerid] = scores[activeplayerid] - shotscore * multiplicator
      setScores(()=>helpscorearray) //updates the new overall score
      calculateWinner(activeplayerid)   
      updateMultiplicator(1);

      if(shotcount==2) //when the 3rd dart has been shot, inform that it's the next players turn and deactivate scorepad
      {
        //document.getElementById('scorepad').style.display ='none';
        document.getElementById('continuegamebtn').style.display ='inline';
        setShowScorePad(false)
      }
    }
    else { //if the input is 'back', go back to the last move
      updateShotCount(false)
      updateActivePlayerID(false)
      updateThreeDartScoreArray(shotscore, shotcount)
    }   
  }

  function updateThreeDartScoreArray(shotscore, shotcount) { //updates the storage array for the three darts; is being updated live at the top scorepad row
    let helparray = threedartscores.slice();
    
    if(0<shotscore<60)
    {
      helparray[shotcount] = shotscore*multiplicator;
      
    }
    else if (shotscore=='back')
    {
      if(shotcount==0) {helparray[shotcount] = '1st' }
      else if(shotcount==1) {helparray[shotcount] = '2nd' }
      else if(shotcount==2) {helparray[shotcount] = '3rd' }
    }    

    setThreeDartScores(helparray)
  }

  function updateShotCount(direction) { //if true value is passed, raise shotcount, if not, lower 
    if(direction) {
      setShotCount(() => shotcount + 1);
    }
    else if (!direction) {
      setShotCount(() => shotcount - 1);
    }
  }

  function updateActivePlayerID(direction) { //if true value is passed, raise shotcount, if not, lower     
    document.getElementById('player'+activeplayerid).style.backgroundColor = '#35373c'
    let nextplayerid //temporary variable to save nextplayerid for bg color change

    if(direction) {
      setActivePlayerID(() => activeplayerid + 1)
      nextplayerid = activeplayerid + 1
    }
    else if (!direction) {
      setActivePlayerID(() => activeplayerid - 1)
      nextplayerid = activeplayerid - 1
    }

    if(activeplayerid==players.length-1)
    {
      setActivePlayerID(0)
    }

    if(activeplayerid==2) {
      nextplayerid=0
    }

    document.getElementById('player'+nextplayerid).style.backgroundColor = '#198754'
  }

  function calculateWinner(activeplayerid) {
    if(scores[activeplayerid]==0 && multiplicator==2) //win is only legit if score reaches 0 and is double checkout
    {
      alert('winner!')
      resetGame();
    }
    else if (scores[activeplayerid]==0 && multiplicator!=2)
    {
      alert('Dont forget the double out!')
      handleClick('back')
    }
    else if (scores[activeplayerid]<0)
    { 
      alert('You shot too much!')
      handleClick('back')
    }
  }

  function updateMultiplicator(factor) {
    if(factor==1) //makes multibtns normal again
    {
      setMultiplicator(factor)
      let el2 = document.getElementById('DOUBLE')
      el2.style.backgroundColor='#6c757d'
      el2.style.color='#dbdcdd'
      let el3 = document.getElementById('TRIPLE')
      el3.style.backgroundColor='#6c757d'
      el3.style.color='#dbdcdd'
    } 
    else if(multiplicator==factor) //makes multibtns normal again
    {
      setMultiplicator(factor)
      let el2 = document.getElementById('DOUBLE')
      el2.style.backgroundColor='#6c757d'
      el2.style.color='#dbdcdd'
      let el3 = document.getElementById('TRIPLE')
      el3.style.backgroundColor='#6c757d'
      el3.style.color='#dbdcdd'
    } 
    else
    {
      setMultiplicator(factor)
      if(factor==2)
      { 
        let el = document.getElementById('DOUBLE')
        el.style.backgroundColor='#E4A11B'
        el.style.color='#35373c'
      }
      else if(factor==3)
      {
        let el = document.getElementById('TRIPLE')
        el.style.backgroundColor='#E4A11B'
        el.style.color='#35373c'
      }
    }
  }

  function resetGame() {
    setShotCount(0)
    setThreeDartScores(["1st","2nd","3rd"])
    setScores([startfrom, startfrom, startfrom])
    setActivePlayerID(0)
    updateMultiplicator(1)
    document.getElementById('continuegamebtn').style.display ='none';

    for(let i = 0; i<players.length; i++) { //resets all player profiles to standard color
      document.getElementById('player' + i).style.backgroundColor = '#35373c'
    }
    document.getElementById('player0').style.backgroundColor = '#198754' //sets first player to highlighted
  }

  function continueGame() { //shows the scorepad and hides the nextplayerbutton
    //document.getElementById('scorepad').style.display ='inline';
    document.getElementById('continuegamebtn').style.display ='none';
    setShowScorePad(true)

    setShotCount(0)
    updateMultiplicator(1)
    setThreeDartScores(["1st","2nd","3rd"])
    updateActivePlayerID(true)  
  }

  function detectCheaters(shotscore) {
    let final = shotscore*multiplicator

    if(final==75)
      alert('No cheaters allowed')
  }

  function keyInputHandler(e) { //for security, tempinput will always be set to 0 after "confirmation"-inputs
    if(e.key=='Enter') {
      if(shotcount!=3) {
        handleClick(tempinput)
        tempinput = 0
      }
      else //triggers the continueGame-function only if the last dart has been shot
        continueGame()
    }
    else if(e.key=='Backspace') {
      handleClick('back')
      tempinput = 0
    }
    else if(e.key=='Escape') {
      resetGame()
      tempinput = 0
    }
    else if(e.key=='Alt') { //to prevent throwing a message when pressing Alt-Tab
      //do nothing
    }
    else if(e.key=='F5') { //to prevent throwing a message when pressing F5
      //do nothing
    }
    else if(e.key=='Control') { //to prevent throwing a message when pressing Ctrl
      //do nothing
    }
    else if(isFinite(e.key)){ //checks if input is a number
      tempinput = tempinput + '' + e.key //simply appends the input key to the existing value
      
      if(tempinput>60) { //score shot with one dart can't be higher than 60
        alert('No cheaters allowed')
        tempinput=0
      }
    }
    else
      alert('Input incorrect!')
  }


  return (
    <>
    <NavBar resetGame={resetGame} continueGame={continueGame}/>
    <ActiveGameUI keyinputhandler={keyInputHandler} players={players} scores={scores} activeplayerid={activeplayerid} handleClick={handleClick} updateMultiplicator={updateMultiplicator} threedartscores={threedartscores}/>
    </>
  );
}

function NavBar({resetGame, continueGame}) {
  return (
    <div id='navbar'>
      <p id="navtitle">DartScorer by JP</p>
      <button id="continuegamebtn" onClick={continueGame}>Next player...</button>
      <button id='resetgamebtn' onClick={resetGame}>Reset game</button>
    </div>
  );
}

function ActiveGameUI({keyinputhandler, players, scores, activeplayerid, handleClick, updateMultiplicator, threedartscores}) {
  return (
    <div id='activegameui' onKeyDown={keyinputhandler} tabIndex={-1}>
      <div id='activegameinfo'>
        <CurrentScore scores={scores} activeplayerid={activeplayerid}/>
        <PlayerList players={players} scores={scores}/>        
      </div>
      <ScorePad handleClick={handleClick} updateMultiplicator={updateMultiplicator} threedartscores={threedartscores}/>
    </div>
  );
}

function CurrentScore({scores, activeplayerid}) {
  return (
    <div id='currentscorediv'>
      <p id='currentscorevalue'>{scores[activeplayerid]}</p>
    </div>
  );
}

function PlayerList({players, scores}) {
  return (
    <div id='playerlist'>
      {players.map((player, id) => (
        <PlayerProfile id={id} name={player} score={scores[id]}/>
      ))}
    </div>
  );
}

function PlayerProfile({id, name,score}) {
  return (
    <div className='playerprofile' id={'player' + id}>
      <p className='playername'>{name}</p>
      <p className='playerscore'>{score}</p>
    </div>
  );
}

function ScorePad({handleClick, updateMultiplicator, threedartscores}) { //holds three dart history and input pad
  return (
    <>
    <div id='scorepad'>
      <div className='scorepadrow'>
        <p className='dartscores' id='firstdart'>{threedartscores[0]}</p>
        <p className='dartscores' id='seconddart'>{threedartscores[1]}</p>
        <p className='dartscores' id='thirddart'>{threedartscores[2]}</p>
      </div>
      <ScoreValuePad handleClick={handleClick} updateMultiplicator={updateMultiplicator}/>
    </div>
    </>
  );
}

function ScoreValuePad({handleClick, updateMultiplicator}) {
  return (
    <div id='numrows'>
        <div className='scorepadrow'>
          <ScorePadBtn value='1' classname='scorepadbtn standardbtn leftupperbtn' onScorePadBtnClick={()=> handleClick(1)}/>
          <ScorePadBtn value='2' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(2)}/>
          <ScorePadBtn value='3' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(3)}/>
          <ScorePadBtn value='4' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(4)}/>
          <ScorePadBtn value='back' classname='scorepadbtn standardbtn rightupperbtn backbtn' onScorePadBtnClick={()=> handleClick('back')}/>
        </div>
        <div className='scorepadrow'>
          <ScorePadBtn value='5' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(5)}/>
          <ScorePadBtn value='6' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(6)}/>
          <ScorePadBtn value='7' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(7)}/>
          <ScorePadBtn value='8' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(8)}/>
          <ScorePadBtn value='back' classname='scorepadbtn standardbtn backbtn' onScorePadBtnClick={()=> handleClick('back')}/>
        </div>
        <div className='scorepadrow'>
          <ScorePadBtn value='9' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(9)}/>
          <ScorePadBtn value='10' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(10)}/>
          <ScorePadBtn value='11' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(11)}/>
          <ScorePadBtn value='12' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(12)}/>
          <ScorePadBtn value='0' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(0)}/>
        </div>
        <div className='scorepadrow'>
          <ScorePadBtn value='13' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(13)}/>
          <ScorePadBtn value='14' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(14)}/>
          <ScorePadBtn value='15' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(15)}/>
          <ScorePadBtn value='16' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(16)}/>
          <ScorePadBtn value='25' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(25)}/>
        </div>
        <div className='scorepadrow'>
          <ScorePadBtn value='17' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(17)}/>
          <ScorePadBtn value='18' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(18)}/>
          <ScorePadBtn value='19' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(19)}/>
          <ScorePadBtn value='20' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(20)}/>
          <ScorePadBtn value='50' classname='scorepadbtn standardbtn' onScorePadBtnClick={()=> handleClick(50)}/>
        </div>  
        <div className='scorepadrow'>
          <ScorePadBtn value='DOUBLE' classname='scorepadbtn multibtn leftlowerbtn' onScorePadBtnClick={()=> updateMultiplicator(2)}/>
          <ScorePadBtn value='TRIPLE' classname='scorepadbtn multibtn rightlowerbtn' onScorePadBtnClick={()=> updateMultiplicator(3)}/>
        </div>
      </div>
  );
}

function NextplayerBtn(continueGame) {
  return (
    <button id='nextplayerbtn' onClick={continueGame}>Next player...</button>
  );
}


function ScorePadBtn({value, classname, onScorePadBtnClick}) {
  return (
  <button className={classname} onClick={onScorePadBtnClick} id={value}>{value}</button>
  );
}

export default App;
