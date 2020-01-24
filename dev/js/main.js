function Counter(x = 0){
    i = x;
    return function(){
        return i = i + 1;
    }
}
let idGenerate = Counter();
class Task{
    constructor(taskData){
        const _ = this;
        //Свойства
        if(!taskData) taskData = {};

        _.id = idGenerate();
        _.title = taskData['title'] || '';
        _.description = taskData['description'] || '';
        _.catID = taskData['catID'] || 0;	//ID Категории
        _.date = taskData['date'];
        _.marks = taskData['marks'] || [];	//Массив идентификаторов меток
        if(!taskData['date']){
            _.date = data.getYear + '-' + data.getMonth + '-' + data.getDate;
        }
        _.bufferId();
    }
    bufferId(){
        const _ = this;
        localStorage.setItem('bufferId', _.id);
    }
}
let months = {
    'ru': [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ],
    'en' : [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'october',
        'November',
        'December',
    ]
};



class List{
    constructor(){
        const _ = this;
        //Свойства
        _.currentLang = 'ru';
        _.tasks = {};
        _.lastTask = {};
        _.calendar = {
            body : document.querySelector('.cal-control'),
            monthSelect : document.querySelector('.cal-choose-month'),
            yearSelect : document.querySelector('.cal-choose-year'),
            link : document.querySelector('.todayLink')
        };
        _.currentFullDate = _.getCurrentDate();
        _.getTask();
        _.init();
    }
    //Методы выборки
    getMonthDays(month){}
    getLabels(day){}
    getCategories(){}
    getTask(month){
        const _ = this;
        if(localStorage.getItem('tasks')){
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            for(let prop in tasks){
                let currentTasks = tasks[prop];
                for(let i=0;i < currentTasks.length;i++){
                    _.addTask(currentTasks[i]);
                }
            }
            //_.tasks = JSON.parse(localStorage.getItem('tasks'));
        }
    }
    getCurrentDate(dateStr=''){
        const _ = this;
        let date = new Date();
        if(dateStr){date = new Date(dateStr);}
        let month = date.getMonth(),
            year = date.getFullYear(),
            monthDay = date.getDate(),
            weekDay = date.getDay();

        if((month == 3) || (month == 5) || (month == 8) || (month == 10)){_.daysInMonth = 30;}
        else if(month == 1)
            if((year%4) == 0){_.daysInMonth = 29;}
            else {_.daysInMonth = 28;}
        else{_.daysInMonth = 31;}

        _.currentMonth = month;
        _.currentDay = monthDay;
        _.currentYear = year;
        _.currentWeekDay = weekDay;
        _.savedDay = _.currentDay;
        month += 1;
        if(month < 10){month = '0' + month;}
        return year + '-' + month + '-' + monthDay;
    }
    getFirstDay() {
        const _ = this;
        let date = new Date(_.currentYear + '-' + (_.currentMonth + 1)),
            firstDay = date.getDay();
        let marginLeft = 44 * (firstDay - 1) + 2;
        if(firstDay === 0){marginLeft = 44 * 6 + 2;}
        let firstDayButton = _.calendar.body.querySelector('.cal-control-button');
        firstDayButton.style.margin = '3px 2px 0px ' + marginLeft + 'px';
    }
    saveActiveDay(){
        const _ = this;
        for(let i = 0; i < _.calendar.body.children.length; i++){
            if(_.calendar.body.children[i].classList.contains('cal-control-button-active')){
                _.savedDay = _.calendar.body.children[i].querySelector('.cal-control-button-day').textContent;
            }
        }
    }
    clearActiveDay(){
        const _ = this;
        for(let i = 0; i < _.calendar.body.children.length; i++){
            if(_.calendar.body.children[i].classList.contains('cal-control-button-active')){
                _.calendar.body.children[i].classList.remove('cal-control-button-active')
            }
        }
    }
    //Методы отрисовки
    drawActiveDay(){
        const _ = this;
        for(let i = 0; i < _.calendar.body.children.length; i++){
            if(_.calendar.body.children[i].querySelector('.cal-control-button-day').textContent == _.savedDay){
                _.calendar.body.children[i].classList.add('cal-control-button-active')
            }
        }
    }
    drawDays(){
        const _ = this;
        _.calendar.body.innerHTML = '';
        let daysCnt = _.daysInMonth;
        let month = _.currentMonth + 1;
        if(month < 10){month = '0' + month}
        for(let i = 1; i <= daysCnt; i++){
            let dayNumber = i;
            if(i < 10){dayNumber = '0' + dayNumber}
            let btn = document.createElement('BUTTON');
            btn.classList.add('cal-control-button');
            let span = document.createElement('SPAN');
            span.classList.add('cal-control-button-day');
            span.textContent = dayNumber;
            btn.append(span);
            span = document.createElement('SPAN');
            span.classList.add('cal-control-button-do');
            let str = _.currentYear + '-' + month + '-' +  dayNumber;
            let doCnt = _.tasks[str];
            if(doCnt){span.textContent = doCnt.length;}
            else {span.textContent = '0';}
            btn.append(span);
            _.calendar.body.append(btn);
        }
        _.getFirstDay();
    }
    //Методы редоктирования
    update(){}

    //Методы создания Select'ов
    setMonthName(){
        const _ = this;
        let monthArr = months[_.currentLang];
        _.calendar.monthSelect.innerHTML = '';
        let value = 0;
        for (let i = 0; i < monthArr.length; i++){
            value = (i + 1);
            if(i < 9){
                value = '0' + value
            }
            _.calendar.monthSelect.append(document.createElement('OPTION'));
            _.calendar.monthSelect.querySelectorAll('option')[i].textContent = monthArr[i];
            _.calendar.monthSelect.querySelectorAll('option')[i].setAttribute('value',value);
        }
    }
    setYearName(){
        const _ = this;
        _.calendar.yearSelect.innerHTML = '';
        let currentYear = _.currentYear;
        for (let i = 0; i < 10; i++){
            _.calendar.yearSelect.append(document.createElement('OPTION'));
            _.calendar.yearSelect.querySelectorAll('option')[i].textContent = (currentYear + i);
            _.calendar.yearSelect.querySelectorAll('option')[i].setAttribute('value',(currentYear + i));
        }
    }
    //Методы добавления
    addTask(taskData){
        const _ = this;
        let t = new Task(taskData);
        if(!_.tasks[t.date]){
            _.tasks[t.date] = [];
        }
        _.tasks[t.date].push(t);
        _.lastTask = t;
        localStorage.clear();
        localStorage.setItem(t,JSON.stringify.t);
        _.drawDays();
        _.drawActiveDay();
        _.showTasks()
    }
    addCategory(){}
    addMark(){}
    drowTask(arr){
        let cont = document.querySelector('.do-list');
        cont.innerHTML = '';
        for (let i = 0; i < arr.length; i++){
            let doCont = document.createElement('DIV'),
                body = document.createElement('DIV'),
                number = document.createElement('DIV'),
                numberSpan = document.createElement('SPAN'),
                doNumber = i + 1 + '.',
                col = document.createElement('DIV'),
                row = document.createElement('DIV'),
                name = document.createElement('SPAN'),
                close = document.createElement('LABEL'),
                desc = document.createElement('DIV'),
                label = document.createElement('LABEL'),
                radio = document.createElement('INPUT'),
                descSpan = document.createElement('SPAN'),
                buttons = document.createElement('DIV'),
                redact = document.createElement('BUTTON'),
                done = document.createElement('BUTTON'),
                del = document.createElement('BUTTON');
            doCont.className = 'do-cont';
            body.className = 'do-body';
            number.className = 'do-number';
            if(i < 9){doNumber = '0' + doNumber}
            numberSpan.textContent = doNumber;
            col.className = 'do-col';
            row.className = 'do-row';
            name.className = 'do-name';
            name.textContent = arr[i].title;
            close.className = 'do-close';
            close.setAttribute('for','close');
            close.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
            desc.className = 'do-desc';
            radio.setAttribute('type','radio');
            radio.setAttribute('name','desc');
            radio.setAttribute('style','display:none');
            descSpan.textContent = arr[i].description;
            buttons.className = 'do-buttons';
            redact.className = 'do-buttons-red';
            redact.innerHTML = `<svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
                                <style type="text/css">
                                .st0{fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10;}
                                .st1{fill:none;stroke:#000000;stroke-miterlimit:10;}
                                </style>
                                <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 4.4866 19.4534)" class="st0" cx="25.7" cy="4.3" rx="1.9" ry="4.4"></ellipse>
                                <path class="st0" d="M12.1,24.1c-0.7,0.7-2.7,0-4.4-1.7S5.2,18.7,6,18"></path>
                                <line class="st1" x1="22.6" y1="1.2" x2="5.9" y2="17.9"></line>
                                <line class="st1" x1="12.1" y1="24.1" x2="28.8" y2="7.4"></line>
                                <path d="M3.7,26.3c0.9,0.9,2.6,0.4,3.4,0.1l-5.9,2.7c-0.2,0-0.3-0.1-0.3-0.3L3.6,23C3.2,23.9,2.8,25.4,3.7,26.3z"></path>
                                <path class="st1" d="M3.7,22.8C3.7,22.8,3.7,22.7,3.7,22.8"></path>
                                <path class="st1" d="M7.1,26.4c-0.8,0.3-2.5,0.8-3.4-0.1S3.2,23.9,3.6,23"></path>
                                <path class="st1" d="M7.3,26.3C7.3,26.3,7.2,26.3,7.3,26.3"></path>
                                <path class="st1" d="M12.1,24.1l-4.9,2.2l-0.1,0.1l-5.9,2.7c-0.2,0-0.3-0.1-0.3-0.3L3.6,23l0.1-0.2l2.2-4.9"></path>
                                </svg>`;
            done.className = 'do-buttons-done';
            done.innerHTML = `<svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
                                <path d="M29.3,0.4l-16,19.9c-0.3,0.4-0.9,0.5-1.4,0.2L0.8,13.9c-0.3-0.2-0.7,0.2-0.4,0.5l11,14.9c0.5,0.6,1.4,0.6,1.8-0.1L29.6,0.6
                                C29.8,0.4,29.4,0.1,29.3,0.4z"></path>
                                </svg>`;
            del.className = 'do-buttons-del';
            del.innerHTML = `<svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
                                <style type="text/css">
                                .st0{fill:none;stroke:#000000;stroke-miterlimit:10;}
                                </style>
                                <polygon class="st0" points="5.3,28.8 24.7,28.8 27.2,10 2.8,10 "></polygon>
                                <path class="st0" d="M23,4.1H7c-3.3,0-5.9,2.7-5.9,5.9l0,0H29l0,0C28.9,6.7,26.3,4.1,23,4.1z"></path>
                                <path class="st0" d="M8.1,4.1L8.1,4.1c0-1.7,1.2-3,2.7-3h8.4c1.5,0,2.7,1.4,2.7,3"></path>
                                <polygon class="st0" points="6.3,13 12,13 12.6,25.8 8.3,25.8 "></polygon>
                                <polygon class="st0" points="23.7,13 18,13 17.4,25.8 21.7,25.8 "></polygon>
                                </svg>`;
            doCont.append(body);
            doCont.append(buttons);
            body.append(number);
            body.append(col);
            number.append(numberSpan);
            col.append(row);
            col.append(desc);
            row.append(name);
            row.append(close);
            desc.append(label);
            label.append(radio);
            label.append(descSpan);
            buttons.append(redact);
            buttons.append(done);
            buttons.append(del);
            cont.append(doCont);
        }
    }
    showTasks(elem){
        const _ = this;
        let calendarDay = '';
        if(elem){calendarDay = elem.querySelector('.cal-control-button-day').textContent;}
        else{calendarDay = _.savedDay}
        let doDate = _.calendar.yearSelect.value + '-' + _.calendar.monthSelect.value + '-' + calendarDay;
        let tasks = [];
        tasks = _.tasks[doDate];
        if(tasks){_.drowTask(tasks);}

    }
    //Методы удаления
    removeCategory(){}
    removeMark(){}
    removeTask(){}
    // Инициализация программы
    init(){
        const _ = this;
        _.setMonthName();
        _.setYearName();
        _.drawDays();
        _.saveActiveDay();
        _.drawActiveDay();
        _.showTasks()
    }
}

let list = new List();
list.addTask({
    title: 'Покушать',
    description: 'Люблю кушать',
    catID: 2,
    date: '2020-01-31',
    marks: [1,3,4]
});
list.addTask({
    title: 'Покушать',
    description: 'Завтра надо встать пораньше, чтобы успеть сделать зарядку и сходить в банк до работы.',
    catID: 2,
    date: list.getCurrentDate(),
    marks: [1,3,4]
});
list.addTask({
    title: 'Покушать',
    description: 'Завтра надо встать пораньше, чтобы успеть сделать зарядку и сходить в банк до работы.',
    catID: 2,
    date: '2020-02-23',
    marks: [1,3,4]
});


list.calendar.monthSelect.addEventListener('change',function (el) {
    let dateStr = list.calendar.yearSelect.value + '-' + list.calendar.monthSelect.value;
    list.getCurrentDate(dateStr);
    list.drawDays();
});
list.calendar.yearSelect.addEventListener('change',function (el) {
    let dateStr = list.calendar.yearSelect.value + '-' + list.calendar.monthSelect.value;
    list.getCurrentDate(dateStr);
    list.drawDays();
});
list.calendar.body.addEventListener('click',function (el) {
    let clickTarget = el.target;
    if(clickTarget.tagName == 'DIV') return;
    if(clickTarget.tagName == 'SPAN'){clickTarget = clickTarget.parentElement;}

    list.clearActiveDay();
    clickTarget.classList.add('cal-control-button-active');
    list.saveActiveDay();
    list.showTasks(clickTarget)
});

