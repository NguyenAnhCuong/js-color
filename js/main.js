import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton } from './selectors.js';
import { getRandomColorPairs,showPlayAgain,hidePlayagain,setTimerText, createTimer } from './utils.js';

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
    seconds: GAME_TIME,
    onChange:handleTimerChange,
    onFinish:handleTimerFinish,
})
function handleTimerChange(second){
    console.log('change',second);
    const fullSecond = `0${second}`.slice(-2)
    setTimerText(fullSecond)
}
function handleTimerFinish(){
    console.log('finished');
    //end game
    gameStatus = GAME_STATUS.FINISHED;
    setTimerText('GAME OVER!!!');
    showPlayAgain();
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
// console.log(getRandomColorPairs(PAIRS_COUNT));
function handleColorClick(liElement){
    const shouldBlockClick = [GAME_STATUS.BLOCKING,GAME_STATUS.FINISHED].includes(gameStatus);
    const isClick = liElement.classList.contains("active")
    console.log(liElement);
    if (!liElement || shouldBlockClick || isClick) return;
    liElement.classList.add('active')
    //save clicked cell to selections
    selections.push(liElement)
    if (selections.length < 2) return
    //check match
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor === secondColor;
    if (isMatch){
        //handle match
        const isWin = getInActiveColorList().length === 0 
        if (isWin){
            //show replay
            //show u win
            showPlayAgain()
            setTimerText('WIN!!!');
            gameStatus = GAME_STATUS.FINISHED;
        }
        selections = []
        return;
    }
    //in case of not match
    //remove class active if not match
    gameStatus = GAME_STATUS.BLOCKING;
    setTimeout(()=>{
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')
        // reset selection for next selec
        selections = [];
        if (gameStatus !== GAME_STATUS.FINISHED){
            gameStatus = GAME_STATUS.PLAYING;
        }
        
    },500);
    
    
    
}
function initColor(){
    //random 8 pair color
    //bind to li > div.overlay
    const colorList = getRandomColorPairs(PAIRS_COUNT);
    const liList = getColorElementList();
    liList.forEach((liElement,index) => {
        liElement.dataset.color = colorList[index];
        const overlayElement = liElement.querySelector('.overlay')
        if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
    })

}
function AttachEventForColorList(){
    const ulElement = getColorListElement();
    if (!ulElement) return;
    //event delegation
    ulElement.addEventListener('click',(event) => {
        // console.log(event.target);
        if (event.target.tagName !== "LI" ) return;
        handleColorClick(event.target);
    })

}
function resetGame(){
    //reset global variable
    gameStatus = GAME_STATUS.PLAYING;
    selections = []

    //reset DOM element
    //remove active class for li
    //hide replay button
    //clear timeout text
    const colorList = getColorElementList()
    for (const colorelement of colorList){
        colorelement.classList.remove('active')
    }
    hidePlayagain()
    setTimerText('')
    initColor();
    startTimer();
    //reset new color
}
function AttachEventForPlayAgain(){
    const playAgainButton = getPlayAgainButton();
    if (!playAgainButton) return;
    playAgainButton.addEventListener('click',resetGame)
}
function startTimer(){
    timer.start();
}
(() => {
    initColor();
    AttachEventForColorList()
    AttachEventForPlayAgain();
    startTimer();
})()