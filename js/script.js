"use strict";

(async function () {
    let data = await loadJson();
    data = JSON.parse(data);

    console.log(data);
})();

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
    generationTable();

    let adress = {
        street: 'Пушкина',
        house: 44,
        housing: '',
        flat: 12
    }
    let task = new Task(4, 'подключить новую раковину', adress);
      
    let time = {
        hour: 13,
        minute: 30
    }
    let day = 'mon';
    let shift = (time.minute / 60) * 25;
    let size = 25 * task.timePlane - 20;

    let template = document.getElementById('table-template-task').content.cloneNode(true);
    let cell = document.getElementById(`${day}-${time.hour}`);
    cell.append(template);

    let temp = document.getElementById('adress');
    temp.innerText += getFullAdress(task.adress);
    temp.removeAttribute('id');

    temp = document.getElementById('details');
    temp.innerText += task.detail;
    temp.removeAttribute('id');

    temp = document.getElementById('task');
    temp.style.height = `${size}px`;
    temp.style.top = `${shift}px`;
    temp.removeAttribute('id');

    /* place.innerHTML = template;  */    
};

function generationTable() {
    let table = document.getElementById('table');

    var week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    let weekEN = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    week.forEach((day, index) => {
        let templateTable = document.getElementById('table-template').content.cloneNode(true);
        table.append(templateTable);

        let temp = document.getElementById('day');
        temp.innerText = day.toUpperCase();
        temp.removeAttribute('id');

        let date = getDate(week.length, index);        
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
}

function getDate(totalIndex, index) {
    let currentDate = new Date();

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