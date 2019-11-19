"use strict";

var json = [
    {
        "teamId": "1",
        "tasks": [
            {
                "date": "2019-11-18",
                "time": {
                    "hours": "10",
                    "minutes": "35"
                },
                "timePlane": "1.5",
                "adress": {
                    "street": "Пушкина",
                    "house": "44",
                    "housing": "",
                    "flat": "12"
                },
                "details": "подключить новую раковину"
            },
            {
                "date": "2019-11-24",
                "time": {
                    "hours": "14",
                    "minutes": "20"
                },
                "timePlane": "4",
                "adress": {
                    "street": "Островского",
                    "house": "37",
                    "housing": "1",
                    "flat": "24"
                },
                "details": "устранить протечку"
            },
            {
                "date": "2019-11-26",
                "time": {
                    "hours": "17",
                    "minutes": "00"
                },
                "timePlane": "1",
                "adress": {
                    "street": "Островского",
                    "house": "37",
                    "housing": "1",
                    "flat": "24"
                },
                "details": "починить кран"
            }
        ]
    },
    {
        "teamId": "2",
        "tasks": [
            {
                "date": "2019-11-20",
                "time": {
                    "hours": "10",
                    "minutes": "35"
                },
                "timePlane": "1.5",
                "adress": {
                    "street": "Пушкина",
                    "house": "44",
                    "housing": "",
                    "flat": "12"
                },
                "details": "подключить новую раковину"
            },
            {
                "date": "2019-11-26",
                "time": {
                    "hours": "17",
                    "minutes": "00"
                },
                "timePlane": "1",
                "adress": {
                    "street": "Островского",
                    "house": "37",
                    "housing": "1",
                    "flat": "24"
                },
                "details": "починить кран"
            }
        ]
    }
];

(function() {
    let button = document.getElementById('button');
    button.addEventListener('click', function() {
        createSchedule(json);
    });
})();

const week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const weekEN = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/*(async function () {
     let data = await loadJson();
    data = JSON.parse(data); 
    console.log(data);
})();*/

async function loadJson() {
    let promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', './resources/json/tasks.json');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.withCredentials = true;
        request.send();

        request.onreadystatechange = function() {
            if (request.readyState !== 4) return;

            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject('error');
            }
        };

    });

    return await promise;
}

function createSchedule(data) {   
    let table = document.getElementById('table');
    table.innerHTML = '';
    
    let teamId = document.getElementById('add-team-id').value;

    data.forEach(dataElement => {
        if (dataElement.teamId === teamId) {
            let deadlines = generationTable();
            dataElement.tasks.forEach(task => {
                let time = task.time;
                let date = getDate(0, -1, new Date(task.date));

                if (date >= deadlines.firstDate && date <= deadlines.lastDate) {
                    date.setHours(time.hours);
                    date.setMinutes(time.minutes);

                    let shift = (Number(time.minutes) / 60) * 25;
                    let size = 25 * Number(task.timePlane);

                    let day = date.getDay() - 1;
                    day = day === -1 ? 6: day;
                    day = weekEN[day];

                    let template = document.getElementById('table-template-task').content.cloneNode(true);
                    let cell = document.getElementById(`${day}-${time.hours}`);
                    cell.append(template);
                    
                    let temp = '';

                    temp = document.getElementById('adress');
                    temp.innerHTML += getFullAdress(task.adress);
                    temp.removeAttribute('id');
                    
                    temp = document.getElementById('details');
                    let details = task.details;
                    details = details[0].toUpperCase() + details.slice(1);
                    temp.innerHTML += details;
                    temp.removeAttribute('id');
                    
                    temp = document.getElementById('task');
                    temp.style.top = `${shift}px`;

                    /* Изменение размера просматриваемого окна */
                    let realSize = temp.clientHeight;
                    if (realSize > size) {
                        temp.classList.add('element-body-task_resize');
                        temp.addEventListener('click', function() {
                            if (temp.classList.contains('element-body-task_resize')) {
                                temp.style.height = `${realSize}px`;
                                temp.classList.add('element-body-task_open');
                                temp.classList.remove('element-body-task_resize');
                            } else {
                                temp.style.height = `${size}px`;
                                temp.classList.remove('element-body-task_open');
                                temp.classList.add('element-body-task_resize');
                            }
                        });
                    }
                    temp.style.height = `${size}px`;
                    temp.removeAttribute('id');
                }            
            });  
        }
               
    });    
};

function generationTable() {
    let table = document.getElementById('table');

    let firstDate = '';
    let lastDate = '';

    week.forEach((day, index) => {
        let templateTable = document.getElementById('table-template').content.cloneNode(true);
        table.append(templateTable);

        let temp = document.getElementById('day');
        temp.innerText = day.toUpperCase();
        temp.removeAttribute('id');

        let date = getDate(week.length, index);
        firstDate  = firstDate === '' ? date : firstDate;
        lastDate = date;

        let currentDate = getDate(0, -1);
        temp = document.getElementById('template-table');
        if (date.getTime() < currentDate.getTime()) {
            temp.classList.add('form-body__element_last');
        } else if (date.getTime() === currentDate.getTime()) {
            temp.classList.add('form-body__element_current');
        }
        temp.removeAttribute('id');        

        temp = document.getElementById('date');        
        temp.innerText = getFullDate(date);
        temp.removeAttribute('id');
        
        let tableContent = document.getElementById('table-content');
        for (let i = 8; i <= 18; i++) {
            let templateTableRow = document.getElementById('table-template-row').content.cloneNode(true);   
            
            tableContent.append(templateTableRow);
            temp = document.getElementById('time');
            temp.innerText = i < 9 ? '0' + i + ':00': i + ':00';
            temp.removeAttribute('id');
            
            temp = document.getElementById('content');
            temp.id = weekEN[index] + '-' + i;
        }
        tableContent.removeAttribute('id');
    });

    return {
        firstDate: firstDate,
        lastDate: lastDate
    }
}

function getDate(totalIndex, index, date) {
    let currentDate = date ? date : new Date();

    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    let currentDay = currentDate.getDay() - 1;
    currentDay = currentDay === -1 ? 6: currentDay;

    let dateShift = currentDay > index ? -(index + 1): (index - 1);
    
    currentDate.setDate(currentDate.getDate() + dateShift);
    return currentDate;
}

function getFullDate(date) {
    let fullDate = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
    fullDate += '.';
    fullDate += (date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    fullDate += '.';
    fullDate += date.getFullYear();

    return fullDate;
}

function getFullAdress(adress) {
    return `ул. ${adress.street}, д. ${adress.house}, корп. ${adress.housing}, кв. ${adress.flat}`;
}