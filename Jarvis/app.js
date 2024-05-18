//elements 
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const turn_on = document.querySelector("#turn_on");
const msgs = document.querySelector(".messages");

//create a new chat
function createMsg(who, msg){
    let newmsg = document.createElement("p");
    newmsg.innerText = msg;
    newmsg.setAttribute("class", who);
    msgs.appendChild(newmsg);

}


document.querySelector("#start_lily_btn").addEventListener("click", () => {
    recognition.start();

});


//lily commands
let lilyComs = [];
lilyComs.push("hi lily");
lilyComs.push("what are your commands");
lilyComs.push("close this - to close opened popups");
lilyComs.push(
  "change my information - information regarding your acoounts and you"
);
lilyComs.push("whats the weather or temperature");
lilyComs.push("show the full weather report");
lilyComs.push("are you there - to check lilys presence");
lilyComs.push("shut down - stop voice recognition");
lilyComs.push("open google");
lilyComs.push('search for "your keywords" - to search on google ');
lilyComs.push("open whatsapp");
lilyComs.push("open youtube");
lilyComs.push('play "your keywords" - to search on youtube ');
lilyComs.push("close this youtube tab - to close opened youtube tab");
lilyComs.push("open firebase");
lilyComs.push("open netlify");
lilyComs.push("open twitter");
lilyComs.push("open my twitter profile");
lilyComs.push("open instagram");
lilyComs.push("open my instagram profile");
lilyComs.push("open github");
lilyComs.push("open my github profile");


//weather set up
function weather(location) {
    const weatherCont = document.querySelector(".temp").querySelectorAll("*");
  
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        weatherCont[0].textContent = `Location : ${data.name}`;
        weatherCont[1].textContent = `Country : ${data.sys.country}`;
        weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
        weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
        weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherCont[5].textContent = `Original Temperature : ${ktc(
          data.main.temp
        )}`;
        weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
        weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
        weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
        weatherStatement = `sir the weather in ${data.name} is ${
          data.weather[0].description
        } and the temperature feels like ${ktc(data.main.feels_like)}`;
      } else {
        weatherCont[0].textContent = "Weather Info Not Found";
      }
    };
  
    xhr.send();
  }
  
  // convert kelvin to celcius
  function ktc(k) {
    k = k - 273.15;
    return k.toFixed(2);
  }

//weather("Ifrane");

//time set up 
let date = new Date(); //give date of machine
let hrs = date.getHours(); //get hours
let mins = date.getMinutes(); //get minutes
let secs = date.getSeconds(); //get seconds

function autoLily(){
    setTimeout(() => {
        //recognition.start();
    }, 1000);
}
//onload(window)
window.onload = () => {
 
    let isFirstClick = true; // Flag to track the first click
    let hasPlayedSound = false; // Flag to track whether the sound has been played

   // Add event listener to handle the first click
    document.addEventListener("click", () => {
    if (isFirstClick) { // Check if it's the first click
        if (!hasPlayedSound) { // Check if the sound hasn't been played yet
            // on startup
            turn_on.play(); // play the turn on sound
            hasPlayedSound = true; // Update the flag to indicate that the sound has been played
        }
        
        // Add event listener to handle the end of audio playback
        turn_on.addEventListener("ended", () => {
            // Perform actions when the audio playback ends
            readOut("Ready to assist you");
            isFirstClick = false; // Update the flag to indicate that the first click has occurred
            setTimeout(() => {
                autoLily(); // Call the autoLily function
                
                if(localStorage.getItem("lily_setup") === null){
                    readOut("Please enter your complete information");
                }
            }, 200);
        });
    }
});

    //lily commands adding 
    lilyComs.forEach((e) => {
        document.querySelector(".commands").innerHTML += `<p>#${e}</p></br>`;
    });



    //time - clock
    time.textContent = `${hrs} : ${mins} : ${secs}`;
    setInterval (() => {
        let date = new Date(); //give date of machine
        let hrs = date.getHours(); //get hours
        let mins = date.getMinutes(); //get minutes
        let secs = date.getSeconds();
        time.textContent = `${hrs} : ${mins} : ${secs}`;

    }, 1000);

    //bathery setup 
    let batteryPromise = navigator.getBattery(); //get battery info
    batteryPromise.then(batteryCallback); //call the batteryCallback function

    function batteryCallback(batteryObject){
        printBatteryStatus(batteryObject); //call the printBatteryStatus function
        setInterval(() => {
            printBatteryStatus(batteryObject);
        }, 5000); //checking if battery is conected every 5 seconds 
    };

    function printBatteryStatus(batteryObject){
        const roundedLevel = Math.round(batteryObject.level * 100); // Round the battery level percentage
        battery.textContent = `${roundedLevel}%`;
        if(batteryObject.charging){
            document.querySelector(".battery").style.width = "200px";
            battery.textContent += " Charging...";
        };
    };

    //internet set up 
    //need to fix
    navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline");
    setInterval(() => {
        navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline");
    }, 6000);
    
};




//lily set up 

//if its the first time we enter the platform, ask for info. else display the info the user entered beforehand 

if(localStorage.getItem("lily_setup") !== null){
    weather(JSON.parse(localStorage.getItem("lily_setup")).location);
}

//lily information setup
const setup = document.querySelector(".lily_setup")
setup.style.display = "none"; //hide the setup div
//if there is no previous data
if(localStorage.getItem("lily_setup") == null){
    setup.style.display = "block";
    //setup.style.display = "flex"; //show the setup div
    setup.querySelector("button").addEventListener("click", userInfo); //after clicking on submit button, we call the userInfo function 
}

//userInfo function 
function userInfo(){
    let setupInfo = {
        name : setup.querySelectorAll("input")[0].value, //select all inputs then select first input and getting its value
        bio : setup.querySelectorAll("input")[1].value,
        location : setup.querySelectorAll("input")[2].value,
        instagram : setup.querySelectorAll("input")[3].value,
        github : setup.querySelectorAll("input")[4].value
    }

    //testing array - if any of data is missing, it will fill the missing info
    let testArr = [];

    setup.querySelectorAll("input").forEach(e => {
        testArr.push(e.value); //pushing the value of each input into the array
    })

    //if one of them is empty string 
    if(testArr.includes("")){
        readOut("Please enter your complete information");}
    else{
        localStorage.clear(); //clear local storage in case of input of wrong data
        localStorage.setItem("lily_setup", JSON.stringify(setupInfo)); //set the data in local storage
        setup.style.display = "none"; //hide the setup div
        //refreshing in case of change 
        weather(JSON.parse(localStorage.getItem("lily_setup")).location);

    }
}


//set up speech recognition 
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; //built-in API for voice recognition within the website, making sure that it works for every browser

const recognition = new SpeechRecognition(); 

//speech recognition start
recognition.onstart = function(){
    console.log("vr active")
}




//speech recognition result 
recognition.onresult = function(event){
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript; //transcript is contained in undex 0 of results
    let userdata = localStorage.getItem("lily_setup");
    transcript = transcript.toLowerCase();
    createMsg("usermsg", transcript); 

    if(transcript.includes("hi lily")){
        readOut("Hello Chahd"); // fix name
    }
    if(transcript.includes("what are your commands")){
        readOut("Here are some of the commands you can use");
        document.querySelector(".commands").style.display = "block";
    };
    if(transcript.includes("close this")){
        readOut("closed");
        document.querySelector(".commands").style.display = "none";
    }
    if (transcript.includes("change information")) {
        setup.style.display = "block";
        readOut("Please enter your complete information");
        
        
    }
    if(transcript.includes("open youtube")){
        readOut("opening youtube")
        //open new tab in browser
        window.open("https://www.youtube.com")
    }
    if(transcript.includes("open google")){
        readOut("opening google")
        //open new tab in browser
        window.open("https://www.google.com")
    }
    if(transcript.includes("open whatsapp")){
        readOut("opening whatsapp")
        //open new tab in browser
        window.open("https://web.whatsapp.com")
    }

    //google search
    if(transcript.includes("search for")){
        let input = transcript.split(""); //split the words in transcript 
        //remove search for part
        input.splice(0, 11);
        //remove last full stop 
        
        input.pop();
        //join the words together 
        input = input.join("").split(" ").join("+"); //need to add a + in between each one of the words in order to search for them in google
        console.log(input);
        //open new tab in browser
        readOut("here's the results of your search");
        window.open(`https://www.google.com/search?q=${input}`);
    }

    //youtube search 
    if(transcript.includes("play")){
        let input = transcript.split(""); //split the words in transcript 
        //remove search for part
        input.splice(0, 5);
        //remove last full stop 
        input.pop();
        //join the words together 
        input = input.join("").split(" ").join("+"); //need to add a + in between each one of the words in order to search for them in google
        console.log(input);
        //open new tab in browser
        readOut("here are the suggested videos");
        window.open(`https://www.youtube.com/search?q=${input}`);
    }

    //github search
    if(transcript.includes("open github")){
        readOut("Opening github");
        window.open("https://github.com");
    }
    //github profile search
    if(transcript.includes("open my github profile")){
        readOut("Opening your github profile");
        window.open(`https://github.com/${JSON.parse(userdata).github}`);
    }

    //instagram profile search 
    if(transcript.includes("open my instagram profile")){
        readOut("Opening your instagram profile");
        window.open(`https://instagram.com/${JSON.parse(userdata).instagram}`);
    }

    if(transcript.includes("stop recognition")){
        recognition.stop();  
    }

    //open university website 

    //open canvas

    //open notion 
    
    //include the chat gpt api in order to do research


};

//stop speech recognition 
recognition.onend = function(){
    console.log("vr deactivated");
};

//speech recognition continuous unless stopped 
recognition.continuous = true;


//button in order to be able to test these functions 
startBtn.addEventListener("click", () => {
    recognition.start()
} );

stopBtn.addEventListener("click", () => {
    recognition.stop()
} );


//lily speech 
function readOut(message){
    const speech = new SpeechSynthesisUtterance() //speech request
    speech.text = message;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
    console.log("speaking out");
    createMsg("jmsg", message);
}

//test for the speak button
speakBtn.addEventListener("click", () => {
    readOut("hi, Chahd, lets code something epic today");
});