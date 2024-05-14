const circles = document.querySelectorAll('.circle');
circles.forEach(function (circle) {
    circle.addEventListener("click", clickEvent)
})

let jsonFilePath = "data/us-devices.json";
let clickedCircle;

function clickEvent(event){
    let us_device;
    clickedCircle = event.target.id
    console.log('Starting click Event')

    fetch(jsonFilePath)
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
        if(data.hasOwnProperty(key)){
            jsonContents += `${key}: ${data[key]}\n`
        }
    }
    const text_input = document.createElement('input');
    text_input.type = 'text';
    text_input.placeholder = "Geben sie einen Raum ein!"

    const submit_button = document.createElement('button');
    submit_button.textContent = "Bestätigen";


    textBox.innerText = jsonContents;
    textBox.appendChild(text_input);
    textBox.appendChild(submit_button);

    submit_button.addEventListener('click', () => {

        moveToRoom(text_input.value ,data);
    })


}

function moveToRoom(room, usData){
    console.log('Starting method move to room')

    fetch('data/rooms.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                console.log(parseInt(room));
                console.log(obj.room);


                if(obj.room === parseInt(room)){
                    console.log('Found room')
                    moveCircle(obj.x, obj.y);
                    usData.room = parseInt(room);
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