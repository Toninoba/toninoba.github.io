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
                if(obj.Name === clickedCircle){
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
	const submit_button = document.createElement('button');
    let jsonContents = '';

	for (const key in data) {
		if (data.hasOwnProperty(key) && key !== 'available') {
			if (Array.isArray(data[key])) {
				jsonContents += `${key}: ${data[key].join(', ')}\n`;
			} else {
				jsonContents += `${key}: ${data[key]}\n`;
			}
		}
	}

    if (data.hasOwnProperty('available')) {
        if (data.available) {
            jsonContents += `Status: Verfügbar\n`;
            clearBookingWindow();
            submit_button.className = "submit-button";
            submit_button.textContent = "Gerät belegen";
            textBox.appendChild(submit_button);
            submit_button.addEventListener('click', () => {
                //moveToRoom(text_input.value ,data);
				submit_button.classList.add('active');
				displayBookingWindow();
            })
        } else {
            jsonContents += `Status: Nicht verfügbar\n`;
			submit_button.style.display = 'none';
			clearBookingWindow();
        }
    }
	

    //const text_input = document.createElement('input');
    //text_input.type = 'text';
    //text_input.placeholder = "Geben sie ihren Namen ein!"
	
	
    textBox.innerText = jsonContents;
	textBox.appendChild(submit_button);
    //textBox.appendChild(text_input);

}

function displayBookingWindow() {
      const bookingWindow = document.querySelector('.booking-window');
      bookingWindow.textContent = 'Sie haben Ihren Termin erfolgreich gebucht!';
      bookingWindow.style.display = 'block';
  }
  
  function clearBookingWindow() {
      const bookingWindow = document.querySelector('.booking-window');
      bookingWindow.textContent = ''; // Clear the content
      bookingWindow.style.display = 'none'; // Hide the booking window
  }



function moveToRoom(arzt, usData){
    console.log('Starting method move to room')

    fetch('data/rooms.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                console.log(parseInt(arzt));
                console.log(obj.Room);


                if(obj.Arzt === arzt){
                    console.log('Found room')
                    moveCircle(obj.x, obj.y);
                    usData.room = obj.Raum;
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
                    listItem.textContent = `${obj.Name}, Raum: ${obj.Raum}, Sonden: ${obj.Sonden.join(', ')}`;
                    deviceList.appendChild(listItem);
                }


            })
        })
        .catch(error => console.error(error));

    const deviceList = document.getElementById('device-list');
}

function searchRoom(){
    const input = document.getElementById('room-input').value;
	const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';
    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj =>{
                if(obj.Raum === parseInt(input)){

                    console.log(obj);
                    const listData = document.createElement('li');
                    listData.textContent = `${obj.Name}, Raum: ${obj.Raum}, Sonden: ${obj.Sonden.join(', ')}`;

                    roomList.appendChild(listData);
                }
            })
        })
        .catch(error => console.error(error));
}
