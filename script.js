const circles = document.querySelectorAll('.circle');
let deviceFilePath = "data/us-devices.json";

circles.forEach(function (circle) {
    circle.addEventListener("click", clickEvent)
    checkAvailable(circle);
})

document.addEventListener("DOMContentLoaded", function () {
    checkAvailable();
    displayDeviceList(false, "", []);
});



function checkAvailable() {
    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            var circles = document.querySelectorAll('.circle');
            circles.forEach(circle => {
                var currentCircle = circle.id;
                var device = data.find(obj => obj.Name === currentCircle);
                if (device) {
                    if (device.available === true) {
                        circle.style.backgroundColor = 'green';
                    } else {
                        circle.style.backgroundColor = 'red';
                    }
                } else {
                    console.error('Kein passendes Gerät gefunden: ' + currentCircle);
                }
            });
        })
        .catch(error => console.error('Error:', error));

}


function clickEvent(event) {
    let us_device;
    let clickedCircle = event.target.id;

    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                console.log(obj);
                if (obj.Name === clickedCircle) {
                    us_device = obj;
                    displayUSDeviceInfo(us_device);
                }
            })
        })
        .catch(error => console.error('Failed loading File ' + error));
}

function displayUSDeviceInfo(data) {
    clearBookingWindow();
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
    console.log(jsonContents);

    if (data.hasOwnProperty('available')) {
        if (data.available) {
            jsonContents += `Status: Verfügbar\n`;
            submit_button.className = "submit-button";
            submit_button.textContent = "Gerät belegen";
            textBox.appendChild(submit_button);
            submit_button.addEventListener('click', () => {
                submit_button.classList.add('active');
                displayBookingWindow();
            })
        } else {
            jsonContents += `Status: Nicht verfügbar\n`;
            submit_button.style.display = 'none';
            clearBookingWindow();
        }
    }
    if(textBox){
        console.log("Textbox existoert")
        textBox.innerText = jsonContents;
        textBox.appendChild(submit_button);
    }
    else {
        console.error("Textbox weg")
    }

}

function displayBookingWindow() {
    const bookingWindow = document.querySelector('.booking-Window');
    bookingWindow.textContent = 'Sie haben Ihren Termin erfolgreich gebucht!';
    bookingWindow.style.display = 'block';
}

function clearBookingWindow() {
    const bookingWindow = document.querySelector('.booking-Window');
    bookingWindow.textContent = ''; // Clear the content
    bookingWindow.style.display = 'none'; // Hide the booking window
}


function searchRoom() {
    const input = document.getElementById('room-input').value;
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';
    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {
                if (obj.Raum === parseInt(input)) {

                    console.log(obj);
                    const listData = document.createElement('li');
                    listData.textContent = `${obj.Name}, Raum: ${obj.Raum}, Sonden: ${obj.Sonden.join(', ')}`;

                    roomList.appendChild(listData);
                }
            })
        })
        .catch(error => console.error(error));
}

function displayDeviceList(availableFilter, nameFilter, sondenFilter){
    const listDiv = document.getElementById("device-list");
    let finalDeviceList = [];
    listDiv.innerHTML = '';


    fetch(deviceFilePath)
        .then(response => response.json())
        .then(data => {
            let availableDevices;
            if(availableFilter){
                availableDevices = data.filter(device => device.available);
            }
            else {
                availableDevices = data;
            }
            if(nameFilter !== ""){
                availableDevices = availableDevices.filter(device => device.Name === nameFilter);
            }

            if(sondenFilter.length !== 0){


                for (let i = 0; i < availableDevices.length; i++) {
                    const currentDevice = availableDevices[i];

                    if(isDeepEqual(sondenFilter, currentDevice)){
                        finalDeviceList.push(currentDevice);
                    }


                }

            }
            else {
                finalDeviceList = availableDevices;
            }
            console.log(finalDeviceList);

            finalDeviceList.forEach(obj => {
                const dataList = document.createElement('div');
                dataList.style.margin = '14px';
                dataList.style.fontSize = '17px';

                // Erstelle separate HTML-Elemente für jedes Detail
                const nameElement = document.createElement('div');
                nameElement.textContent = obj.Name;
                dataList.appendChild(nameElement);

                const raumElement = document.createElement('div');
                raumElement.textContent = `Raum: ${obj.Raum}`;
                dataList.appendChild(raumElement);

                const sondenElement = document.createElement('div');
                sondenElement.textContent = `Sonden: ${obj.Sonden.join(', ')}`;
                dataList.appendChild(sondenElement);

                listDiv.appendChild(dataList);
            })






        })
        .catch(error => console.error());



}

function isDeepEqual(userFilter, compareTo) {

    const sonden2 = compareTo.Sonden;

    for (let i = 0; i < sonden2.length; i++) {
        for (let j = 0; j < userFilter.length; j++) {



            if(userFilter[j] === sonden2[i]){
                return true;
            }
        }
    }
    return false;
}

function changeFilter(){
    var checkbox = document.getElementById("available-checkbox");
    let availableFilter;
    if(checkbox.checked){
        availableFilter = true;
    }
    else {
        availableFilter = false;
    }

    const nameFilter = document.getElementById("textInput").value;

    var checkboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
    var sondenFilter = [];
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            sondenFilter.push(checkbox.id);
        }
    });
    console.log('Markierte Checkboxen:', sondenFilter);

    displayDeviceList(availableFilter, nameFilter, sondenFilter);



}



