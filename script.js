const circles = document.querySelectorAll('.circle');
circles.forEach(function (circle) {
    circle.addEventListener("click", clickEvent)
})



let deviceFilePath = "data/us-devices.json";
let clickedCircle;

function clickEvent(event){
    let us_device;
    clickedCircle = event.target.id
    console.log('Starting click Event')

    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                if(obj.name === clickedCircle){
                    console.log('Found obj in json')
                    us_device = obj;
                    displayUSDeviceInfo(us_device);
                    console.log(us_device)
                }
            })
        })
        .catch(error => console.error('Failed loading File ' + error))




}

function displayUSDeviceInfo(data){
    const textBox = document.getElementById("text-box");
    let jsonContents = '';

    for(const key in data){
        if(data.hasOwnProperty(key) && key !== 'available'){
            jsonContents += `${key}: ${data[key]}\n`
        }
    }
    if (data.hasOwnProperty('available')) {
        if (data.available) {
            jsonContents += `Status: Verfügbar\n`;
            const submit_button = document.createElement('button');
            submit_button.className = "submit-button";
            submit_button.textContent = "Gerät belegen";
            textBox.appendChild(submit_button);
            submit_button.addEventListener('click', () => {

                moveToRoom(text_input.value ,data);
            })
        } else {
            jsonContents += `Status: Nicht verfügbar\n`;
        }
    }


    //const text_input = document.createElement('input');
    //text_input.type = 'text';
    //text_input.placeholder = "Geben sie ihren Namen ein!"


    textBox.innerText = jsonContents;
    //textBox.appendChild(text_input);

}

function moveToRoom(arzt, usData){
    console.log('Starting method move to room')

    fetch('data/rooms.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                console.log(parseInt(arzt));
                console.log(obj.room);


                if(obj.arzt === arzt){
                    console.log('Found room')
                    moveCircle(obj.x, obj.y);
                    usData.room = obj.room;
                    displayUSDeviceInfo(usData)
                }
            })
        })
        .catch(error => console.error(error))


}

function moveCircle(deltaX, deltaY){
    const circle = document.getElementById(clickedCircle);


    circle.style.left = deltaX + 'px';
    circle.style.top = deltaY + 'px';
}

document.addEventListener('DOMContentLoaded', fetchDevices);

async function fetchDevices(){

    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                if(obj.available === true){
                    const listItem = document.createElement('li');
                    listItem.textContent = `${obj.name}, Raum: ${obj.room}, Sonden: ${obj.sonden}`;
                    deviceList.appendChild(listItem);
                }


            })
        })
        .catch(error => console.error(error));

    const deviceList = document.getElementById('device-list');
}

function searchRoom(){
    const input = document.getElementById('room-input').value;
    const inputContainer = document.getElementById('room-list');
    inputContainer.innerHTML = '';

    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj =>{


                if(obj.room === parseInt(input) && obj.available === true){

                    console.log(obj);
                    const listData = document.createElement('li');
                    listData.textContent = `${obj.name}, Raum: ${obj.room}, Sonden: ${obj.sonden}`;



                    inputContainer.appendChild(listData);
                }



            })

        })
        .catch(error => console.error(error));


}
