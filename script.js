const circles = document.querySelectorAll('.circle');
let deviceFilePath = "data/us-devices.json";

circles.forEach(function (circle) {
    circle.addEventListener("click", clickEvent)
    checkAvailable(circle);
})

document.querySelector('.arrow-buttons .up').addEventListener('click', function() {
    document.getElementById('siloahImage').src = 'Siloah2.png'; // Change the image source to Siloah2.png
});

document.querySelector('.arrow-buttons .down').addEventListener('click', function() {
    document.getElementById('siloahImage').src = 'Siloah.jpg'; // Change the image source back to Siloah.jpg
});

// Get all checkboxes
const checkboxes = document.querySelectorAll('#text-box input[type="checkbox"]');

// Add event listeners to all checkboxes
checkboxes.forEach(checkbox => {
	checkbox.addEventListener('change', changeFilter);
});


document.addEventListener("DOMContentLoaded", function () {
	checkAvailable();
	displayDeviceList_new(false, "", []);
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
	const button_date_planning = document.createElement('button');
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
	
	button_date_planning.className = "submit-button";
	button_date_planning.textContent = "Termin planen";
	button_date_planning.addEventListener('click', () => {
		button_date_planning.classList.add('active');
		window.location.href = "Availability.html";
	});

    if(textBox){
        console.log("Textbox existiert")

		// Clear previous appended content
        const existingContentDiv = textBox.querySelector('.device-info');
        existingSubmitButton = textBox.querySelector('.submit-button');

        if (existingContentDiv) {
            textBox.removeChild(existingContentDiv);
        }

		while (existingSubmitButton) {
			textBox.removeChild(existingSubmitButton);
			existingSubmitButton = textBox.querySelector('.submit-button')
		}

        // Append new content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'device-info';
        contentDiv.innerText = jsonContents;

        textBox.appendChild(contentDiv);
        // textBox.appendChild(submit_button);

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

        textBox.appendChild(button_date_planning);
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

document.getElementById('room-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchRoom();
    }
});

async function displayDeviceList_new(availableFilter, nameFilter, sondenFilter) {
    const listDiv = document.getElementById("device-list");
	const textBox = document.getElementById("text-box");

    try {
        const response = await fetch(deviceFilePath);
        const data = await response.json();

						// 1. Filter devices based on availability
		let availableDevices = data.filter(device => {
			// Check if availableFilter is set and the device is available
			return !availableFilter || device.available;
		});

		// 2. Filter devices based on nameFilter
		let nameFilteredDevices = availableDevices.filter(device => {
			// If nameFilter is empty, include all devices
			// Otherwise, include only devices whose Name is in the nameFilter array
			return nameFilter.length === 0 || nameFilter.includes(device.Name);
		});

		// Step 3: Filter by sonde
		let finalDeviceList = nameFilteredDevices.filter(device => {
			// If sondenFilter is empty, include all devices
			// Otherwise, include only devices whose Sonden array includes at least one value from the sondenFilter array
			return sondenFilter.length === 0 || sondenFilter.some(sonde => device.Sonden.includes(sonde));
		});

        console.log(finalDeviceList);

        // Create a Map for quick lookup
        const deviceMap = new Map(finalDeviceList.map(device => [device.Name, device]));

        // Get all the circles and update their display
        document.querySelectorAll('.circle').forEach(circle => {
            const isVisible = deviceMap.has(circle.id);
            circle.style.display = isVisible ? 'block' : 'none';
        });

    } catch (error) {
        console.error(error);
    }
	
	if(textBox){
        console.log("Textbox existiert")

		// Clear previous appended content
        const existingContentDiv = textBox.querySelector('.device-info');
        existingSubmitButton = textBox.querySelector('.submit-button');

        if (existingContentDiv) {
            textBox.removeChild(existingContentDiv);
        }

		while (existingSubmitButton) {
			textBox.removeChild(existingSubmitButton);
			existingSubmitButton = textBox.querySelector('.submit-button')
	}}
}

// function isDeepEqual(userFilter, compareTo) {

    // const sonden2 = compareTo.Sonden;

    // for (let i = 0; i < sonden2.length; i++) {
        // for (let j = 0; j < userFilter.length; j++) {



            // if(userFilter[j] === sonden2[i]){
                // return true;
            // }
        // }
    // }
    // return false;
// }

function isDeepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
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

    // const nameFilter = document.getElementById("textInput").value;

    // var checkboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
    // var sondenFilter = [];
    // sondenDropdownContent.forEach(function(checkbox) {
        // if (checkbox.checked) {
            // sondenFilter.push(checkbox.id);
        // }
    // });
	// Get the Sonden and Gerätename dropdown content elements
	
	
	var sondenDropdownContent = document.querySelector('.dropdown:nth-of-type(2) .dropdown-content');
	var geraetenameDropdownContent = document.querySelector('.dropdown:nth-of-type(3) .dropdown-content');

	// Get all checkboxes for Sonden and Gerätename
	var sondenCheckboxes = sondenDropdownContent.querySelectorAll('input[type="checkbox"]');
	var geraetenameCheckboxes = geraetenameDropdownContent.querySelectorAll('input[type="checkbox"]');

    var sondenFilter = [];
	sondenCheckboxes.forEach(checkbox => {
		if (checkbox.checked) {
			sondenFilter.push(checkbox.id);
		}
		// checkbox.addEventListener('change', () => {
			// console.log(`Sonden checkbox ${checkbox.id} is ${checkbox.checked ? 'checked' : 'unchecked'}`);
		// });
	});
    var nameFilter = [];
	geraetenameCheckboxes.forEach(checkbox => {
		if (checkbox.checked) {
            nameFilter.push(checkbox.id);
		}
		// checkbox.addEventListener('change', () => {
			// console.log(`Gerätename checkbox ${checkbox.id} is ${checkbox.checked ? 'checked' : 'unchecked'}`);
		// });
	});
	
	
	

	
    console.log('Markierte sondenCheckboxes:', sondenFilter);
	console.log('Markierte geraetenameCheckboxes:', nameFilter);
	displayDeviceList_new(availableFilter, nameFilter, sondenFilter);
}



