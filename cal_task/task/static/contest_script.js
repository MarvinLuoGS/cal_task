let a_list = js_vars.draw_dict_a
let q_list = js_vars.draw_dict_q
let cal_trials = document.getElementById('id_cal_trials')
let cal_correct = document.getElementById('id_cal_correct')
var score = 0;

function checkAnswers() {
  let form = document.getElementById('form');
  for ( let i = 0; i < a_list.length; i++ ){
    q_temp = document.getElementById(q_list[i]).value;
    if ( q_temp == a_list[i]){
      score++;
    }
  };
  cal_correct.value = score;
  cal_trials.value = numCompleted;
  form.submit();
}


let activeTab = 0;
let tabs = document.getElementsByClassName('tab');
// Multiple subpages in a single page
function showCurrentTabOnly() {
for (let i = 0; i < tabs.length; i++) {
let tab = tabs[i];
if (i === activeTab) {
  tab.style.display = 'block';
  tab.scrollIntoView();
} else {
  tab.style.display = 'none';
}
}
};

showCurrentTabOnly();
for (let btn of document.getElementsByClassName('btn-tab')) {
btn.onclick = function () {
    activeTab += parseInt(btn.dataset.offset);
    showCurrentTabOnly();
}
};
////////////////////


// count down timer, the current page will not be submitted when the countdown ends, and the refresh will not reset


  //window.onload = function(){
      var time;
      // get the element to be modified
      var pTime = document.getElementById('timer');
      // set the minutes and seconds of the countdown
      var m = js_vars.cal_minutes;
      var s = js_vars.cal_seconds;
      var total_time = m*60 + s;
      var round_number = js_vars.round_number;
      // code to prevent page refresh from restarting countdown
      // if countDown can be found, the page has been refreshed
      if( round_number == 1 ){
        if(sessionStorage.getItem('countDown')){
            start_time = sessionStorage.getItem('countDown'); 
            var now_time = new Date().getTime(); // get current time
            var remain_time = total_time - (now_time-start_time)/1000 // get remaining time
            m = Math.floor(remain_time/60);
            if (remain_time < 60){
                s = Math.floor(remain_time);
            };
            if (remain_time >= 60){
                s = Math.floor(remain_time - m*60)
            };
        }else{
            start_time = new Date().getTime(); // If it has not been refreshed, get the current time as the page start time and save it as countDown
            sessionStorage.setItem('countDown',start_time);
        };
      };
      if( round_number == 2 ){
        if(sessionStorage.getItem('countDown2')){
            start_time = sessionStorage.getItem('countDown2'); 
            var now_time = new Date().getTime(); // get current time
            var remain_time = total_time - (now_time-start_time)/1000 // get remaining time
            m = Math.floor(remain_time/60);
            if (remain_time < 60){
                s = Math.floor(remain_time);
            };
            if (remain_time >= 60){
                s = Math.floor(remain_time - m*60)
            };
        }else{
            start_time = new Date().getTime(); // If it has not been refreshed, get the current time as the page start time and save it as countDown
            sessionStorage.setItem('countDown2',start_time);
        };
      };
      // use setInterval(function(),1000) to set a timer
      var timer = setInterval(function(){
          // if s is 0,change it to 59, e.g after 4:00, display 3:59
          if(s == 0 && m > 0){
              s = 59;
              m--;
          } else{ // else just decrease the value of s
              s--;
          };
          //change m and s to string type and use .padStart() to add 0 in front of the number if it is less than 10
          minutes = m.toString().padStart(2,'0');
          seconds = s.toString().padStart(2,'0');
          // concatenate string to display
          time_text = "Time Left:"+ minutes +":"+ seconds;
          pTime.innerHTML = time_text;
          // time is up, show red and bold reminders
          if (s <= 0 && m <= 0) {
              clearInterval(timer); 
              time_text = "Time Left: 00:00";
              pTime.innerHTML = time_text + '<p><b><font color=\'red\'>Please submit！</font></b></p>';
              document.getElementById('question_form').style.display = "none";
              document.getElementById('submitButton').style.display = "block";
          }
      },1000)
//  };

// get all the input elements 
const answerInputs = document.querySelectorAll('.answer1');

// initial the number of questions already answered
let numCompleted = 0;

// store the questions already answered
const completedQuestions = {};

// Listen to the event of all input boxes, including blur event and change event
answerInputs.forEach(input => {
  input.addEventListener('blur', () => {
    // update the number
    const questionNumber = input.dataset.question;
    if (input.value.trim() !== '' && !completedQuestions[questionNumber]) {
      completedQuestions[questionNumber] = true;
      numCompleted++;
      document.getElementById('countsum_text').textContent = numCompleted;
    }
  });
  input.addEventListener('change', () => {
    // update the number
    const questionNumber = input.dataset.question;
    if (input.value.trim() === '' && completedQuestions[questionNumber]) {
      delete completedQuestions[questionNumber];
      numCompleted--;
      document.getElementById('countsum_text').textContent = numCompleted;
    }
  });
});
