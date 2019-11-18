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
    let day = 'пн';
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

    place.innerHTML = template;             
})();

function generationTable() {
    let table = document.getElementById('table');

    let week = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

    week.forEach(templateDay => {
        let rows = '';
        for (let i = 8; i <= 18; i++) {
            let row = 
                `<tr class="element-body__row">
                    <td class="element-body__cell">
                        ${i}:00
                    </td>
                    <td class="element-body__cell" id="${templateDay}-${i}"></td>
                </tr>`;
            rows += row;
        }

        let tableElementTemplate = 
         `<div class="form-body__element">
              <div class="element-header">
                  <div class="element-header__cell element-header__cell_day">
                      ${templateDay.toUpperCase()}
                  </div>
                  <div class="element-header__cell element-header__cell_data">
                      18.11.2019
                  </div>
                  <div class="element-header__cell element-header__cell_total-tasks">
                      Всего задач: 0
                      </div></div>
                 <table class="element-body">
                     <tr class="element-body__row">
                          <th class="element-body__cell">
                              Время
                          </th>
                          <th class="element-body__cell">
                              Детали задачи
                           </th>
                       </tr>
                    ${rows}
               </table>
           </div> `;
        table.innerHTML += tableElementTemplate;
    });
}