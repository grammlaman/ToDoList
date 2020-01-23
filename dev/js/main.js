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
            doCont.classList.add('do-cont');
            body.classList.add('do-body');
            number.classList.add('do-number');
            if(i < 9){doNumber = '0' + doNumber}
            numberSpan.textContent = doNumber;
            console.log(doNumber);
            col.classList.add('do-col');
            row.classList.add('do-row');
            name.classList.add('do-name');
            name.textContent = arr[i].title;
            close.classList.add('do-close');
            close.setAttribute('for','close');
            close.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
            desc.classList.add('do-desc');
            radio.setAttribute('type','radio');
            radio.setAttribute('name','desc');
            radio.setAttribute('style','display:none');
            descSpan.textContent = arr[i].description;
            buttons.classList.add('do-buttons');
            redact.classList.add('do-buttons-red');
            done.classList.add('do-buttons-done');
            del.classList.add('do-buttons-del');
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
    date: '2020-01-23',
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

