"use strict";

const week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const weekEN = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

(async function () {
    let data = await loadJson();
    data = JSON.parse(data);

    let button = document.getElementById('button');
    button.addEventListener('click', function() {
        createSchedule(data);
    });
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
    let table = document.getElementById('table');
    table.innerHTML = '';

    let teamId = document.getElementById('add-team-id').value;

    let userDate = document.getElementById('add-date').value;
    if (userDate === '') {
        createAllTasks(data, teamId, new Date());
    }
    userDate = new Date(userDate);
    if (String(userDate) !== 'Invalid Date') {
        createAllTasks(data, teamId, userDate);
    }
};

function createAllTasks(data, teamId, userDate) {
    data.forEach(dataElement => {
        if (dataElement.teamId === teamId) {
            let deadlines = createTable(userDate);

            dataElement.tasks.forEach(task => {
                let time = task.time;
                let date = new Date(task.date);
                date = getDate(date.getDay() - 1, date);

                if (date.getTime() >= deadlines.firstDate.getTime() && date.getTime() <= deadlines.lastDate.getTime()) {
                    date.setHours(time.hours);
                    date.setMinutes(time.minutes);
                    
                    let temp = '';

                    let day = date.getDay() - 1;
                    day = day === -1 ? 6: day;
                    day = weekEN[day];

                    let template = document.getElementById('table-template-task').content.cloneNode(true);
                    let cell = document.getElementById(`${day}-${time.hours}`);
                    cell.append(template);

                    let total = document.getElementById(`${day}-total`);
                    total.innerText = Number(total.innerText) + 1;

                    /* Адрес и детали */
                    temp = document.getElementById('adress');
                    temp.innerHTML += getFullAdress(task.adress);
                    temp.removeAttribute('id');
                    
                    temp = document.getElementById('details');
                    task.details.forEach(detail => {
                        let li = document.createElement('li');
                        li.innerHTML = detail[0].toUpperCase() + detail.slice(1);
                        li.classList.add('element-body-task-detail__element');
                        temp.append(li);
                    });
                    temp.removeAttribute('id');                    
                    
                    /* Изменение размера просматриваемого окна */
                    let shift = (Number(time.minutes) / 60) * 25;
                    let size = 30 * Number(task.timePlane);

                    temp = document.getElementById('task');
                    temp.style.top = `${shift}px`;

                    let realSize = temp.clientHeight;
                    if (realSize > size) {
                        temp.classList.add('element-body-task_resize');
                        temp.addEventListener('click', function() {
                            if (temp.classList.contains('element-body-task_resize')) {
                                temp.style.height = `${realSize}px`;
                                temp.style.zIndex = 100;
                                temp.classList.add('element-body-task_open');
                                temp.classList.remove('element-body-task_resize');
                            } else {
                                temp.style.height = `${size}px`;
                                temp.style.zIndex = 1;
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
}

/* Создание недельной сетки для указанной даты */
function createTable(userDate) {
    let table = document.getElementById('table');

    let firstDate = '';
    let lastDate = '';

    let currentDate = getDate(userDate.getDay() - 1);
    
    week.forEach((day, index) => {
        let templateTable = document.getElementById('table-template').content.cloneNode(true);
        table.append(templateTable);

        /* Наименование дня */
        let temp = document.getElementById('day');
        temp.innerText = day.toUpperCase();
        temp.removeAttribute('id');

        let date = getDate(index, userDate);
        if (firstDate === '') {
            firstDate = new Date(JSON.parse(JSON.stringify(date)));
        }        
        lastDate = date;

        /* Определние прошедших и текущего дня */
        temp = document.getElementById('template-table');
        if (date.getTime() < currentDate.getTime()) {
            temp.classList.add('form-body__element_last');
        } else if (date.getTime() === currentDate.getTime()) {
            temp.classList.add('form-body__element_current');
        }
        temp.removeAttribute('id');        

        /* Дата */
        temp = document.getElementById('date');        
        temp.innerText = getFullDate(date);
        temp.removeAttribute('id');

        /* Всего задач */
        temp = document.getElementById('total-tasks');
        temp.id = `${weekEN[index]}-total`;
        temp.innerHTML = '0';
        
        /* Заполнение временных строк */
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

/* Получение даты и её недельного окружения */
function getDate(index, date) {
    let currentDate = date ? date : new Date();

    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    let currentDay = currentDate.getDay() - 1;
    currentDay = currentDay === -1 ? 6: currentDay;

    let dateShift = index - currentDay;
    
    currentDate.setDate(currentDate.getDate() + dateShift);

    return currentDate;
}

/* Получение даты как строки */
function getFullDate(date) {
    let fullDate = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
    fullDate += '.';
    fullDate += (date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    fullDate += '.';
    fullDate += date.getFullYear();

    return fullDate;
}

/* Получение адреса */
function getFullAdress(adress) {
    return `ул. ${adress.street}, д. ${adress.house}, корп. ${adress.housing}, кв. ${adress.flat}`;
}