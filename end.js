const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentscore = localStorage.getItem('mostRecentscore');

const highScores = JSON.parse(localStorage.getItem('highScore')) || [];


finalScore.innerText = mostRecentscore;


username.addEventListener("keyup", () =>{
    saveScoreBtn.disabled = !username.value;
})

saveHighScore = e => {
    console.log ("clicked the save button");
    e.preventDefault();

    const score = {
        score: mostRecentscore,
        name: username.value
    };
    highScores.push(score);
    highScores.sort( (a,b) => b.score > a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign("/");
};