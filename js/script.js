"use strict";

class Task {
    constructor(timePlane, details, adress) {
        this.timePlane = timePlane;
        this.adress = adress;
        this.details = details;
    }
}

(function() {  
    generationTable()

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
    let place = document.getElementById(`${day}-${time.hour}`);
    let shift = (time.minute / 60) * 25;
    let size = 25 * task.timePlane - 20;

    let template = `<div class="element-body-task" style="height: ${size}px; top: ${shift}"> 
                        <div class="element-body-task__detail">
                            <span class="element-body-task__header">Адрес:</span>
                                ${task.adress.street}, д. ${task.adress.house}, корп. ${task.adress.housing}, кв. ${task.adress.flat}
                        </div>
                        <div class="element-body-task__detail">
                            <span class="element-body-task__header">Задача:</span>
                                ${task.details}
                        </div>
                    </div>`;

    /* place.innerHTML = template;  */
    
})();

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
        console.log(date);
        
        temp = document.getElementById('date');
        temp.innerText = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
        temp.innerText += '.';
        temp.innerText += (date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        temp.innerText += '.';
        temp.innerText += date.getFullYear();
        temp.removeAttribute('id');
        
        let tableContent = document.getElementById('table-content');
        for (let i = 8; i <= 18; i++) {
            let templateTableRow = document.getElementById('table-template-row').content.cloneNode(true);   
            
            tableContent.append(templateTableRow);
            temp = document.getElementById('time');
            temp.innerText = i < 9 ? '0' + i + ':00': i + ':00';
            temp.removeAttribute('id');     
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