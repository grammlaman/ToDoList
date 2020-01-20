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
    ]
};

class List{
    constructor(){
        const _ = this;
        //Свойства
        /*_.currentMonth = 0;
        _.currentDay = 0;*/
        _.currentLang = 'ru';
        _.tasks = {};
        _.lastTask = {};
        //_.getTask();
        _.currentFullDate = _.getCurrentDate();
        _.init();
    }
    //Методы выборки
    getMonthDays(month){}
    getLabels(day){}
    getCategories(){}
    getTasks(month){
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
        if(dateStr){
            date = new Date(dateStr);
        }
        let
            month = date.getMonth(),
            year = date.getFullYear(),
            monthDay = date.getDate(),
            weekDay = date.getDay();

        if( (month == 3) || (month == 5) || (month == 8) || (month == 10) )
            _.daysInMonth = 30;
        else if(month == 1)
            if((year%4) == 0){
                _.daysInMonth = 29;
            } else {
                _.daysInMonth = 28;
            }
        else
            _.daysInMonth = 31;

        _.currentMonth = month;
        _.currentDay = monthDay;
        _.currentYear = year;
        _.currentWeekDay = weekDay;

        month+=1;
        if(month < 10){
            month = '0' + month;
        }
        return year + '-' + month + '-' + monthDay;
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
    }
    addCategory(){}
    addMark(){}

    //Методы отрисовки
    drawTable(){
        const _ = this;
        let calendarBody = document.querySelector('.cal-control');
        let calendarHtml = '';
        let daysCnt = _.daysInMonth;
        for(let i = 1; i <= daysCnt; i++){
            let buffer = '<button class="cal-control-button">' +
                '<span class="cal-control-button-day">'+i+'</span>' +
                '<span class="cal-control-button-do">0</span></button>';
            calendarHtml += buffer;
        }
        calendarBody.innerHTML = calendarHtml;
    }
    getFirstDay() {
        let date = new Date(_.currentYear,_.currentMonth);
        let firstDay = date.getDay();
        let marginLeft = 0;
        if(firstDay === 0){
            marginLeft = 44 * 6 + 2;
        } else {
            marginLeft = 44 * (firstDay - 1) + 2;
        }
        let firstDayButton = document.querySelector('.cal-control-button');
        firstDayButton.style.margin = '3px 2px 0px ' + marginLeft + 'px';
    }
    //Методы редоктирования
    update(){}
    setMonthName(month=0){
        const _ = this;
        let monthCont = document.querySelector('.cal-choose-month');
        monthCont.textContent = months[_.currentLang][month];
    }
    setYearName(year=0){
        const _ = this;
        let monthCont = document.querySelector('.cal-choose-year');
        monthCont.textContent = year;
    }
    //Методы удаления
    removeCategory(){}
    removeMark(){}
    removeTask(){}
    // Инициализация программы
    init(){
        const _ = this;
        _.setMonthName(_.currentMonth);
        _.setYearName(_.currentYear);
        _.drawTable();
    }
}

let list = new List();
list.addTask({
    title: 'Покушать',
    description: 'Люблю кушать',
    catID: 2,
    date: '2019-12-31',
    marks: [1,3,4]
});
list.addTask({
    title: 'Пить',
    description: 'Люблю кушать',
    catID: 2,
    date: '2019-12-31',
    marks: [1,3,4]
});
list.addTask({
    title: 'Пить',
    description: 'Люблю кушать',
    catID: 2,
    date: '2025-10-31',
    marks: [1,3,4]
});















let date = new Date();
let calendar = {
    item : document.getElementById('calendar'),
    year : document.querySelector('.cal-choose-year'),
    month : document.querySelector('.cal-choose-month'),
    day : document.querySelector('.cal-control')
};
// Активный месяц и год по умолчанию
function calendarNewSelects() {
    let thisMonth = date.getMonth();
    let thisYear = date.getFullYear();
    calendar.month.options.selectedIndex = thisMonth;
    calendar.year.value = thisYear;
}
calendarNewSelects();
//Формирование кнопок дней в зависимости от месяца
function CreatCalendarButtons() {
    let calHTML = '';
    let month = calendar.month.options.selectedIndex;
    let year = calendar.year.value;
    let daysCnt = 0;
    if((month == 3)||(month == 5)||(month == 8)||(month == 10)){daysCnt = 30;}
    else if(month == 1){
        if((year % 4) == 0){
            daysCnt = 29
        } else {
            daysCnt = 28
        }
    }
    else {daysCnt = 31}
    for(let i = 1; i <= daysCnt; i++){
        let a = '<button class="cal-control-button">' +
            '<span class="cal-control-button-day">'+i+'</span>' +
            '<span class="cal-control-button-do">0</span></button>';
        calHTML += a;
    }
    calendar.day.innerHTML = calHTML;
    calendar.day.querySelector('button').classList.add('cal-control-button-first');
}
CreatCalendarButtons();

// Активный день по умолчанию
function calendarPickActive(){
    let calendarDays = calendar.day.querySelectorAll('.cal-control-button');
    let today = date.getDate();
    calendarDays[today-1].classList.add('cal-control-button-active');
}
calendarPickActive();

// Выбор дня недели на первое число
function getFirstDay() {
    let date = new Date(calendar.year.value,calendar.month.options.selectedIndex,1);
    let firstDay = date.getDay();
    let marginLeft = 0;
    if(firstDay === 0){
        marginLeft = 44 * 6 + 2;
    } else {
        marginLeft = 44 * (firstDay - 1) + 2;
    }
    let firstDayButton = document.querySelector('.cal-control-button-first');
    firstDayButton.style.margin = '3px 2px 0px ' + marginLeft + 'px';
}
getFirstDay();
calendar.month.addEventListener('change',function (el) {
    CreatCalendarButtons();
    getFirstDay();
});
calendar.year.addEventListener('change',function (el) {
    CreatCalendarButtons();
    getFirstDay();
});

// Переключение дня по клику
function dayClick(el) {
    let calendarDays = calendar.day.querySelectorAll('.cal-control-button');
    calendarDays.forEach(function (el) {
        if(el.classList.contains('cal-control-button-active')) el.classList.remove('cal-control-button-active');
    });
    el.classList.add('cal-control-button-active');
}
calendar.day.addEventListener('click',function (el) {
    let element = el.target;
    if(element != calendar.day){
        if(!(element.tagName == "BUTTON") ){
            while(element.tagName != 'BUTTON'){
                element = element.parentNode;
            }
        }
        dayClick(element);
    }
    let doDate = document.querySelector('.todayLink');
    let doDateDay = element.querySelector('.cal-control-button-day').textContent;
    if(doDateDay < 10) doDateDay = '0' + doDateDay;
    let doDateMonth = calendar.month.options.selectedIndex + 1;
    if(doDateMonth < 10) doDateMonth = '0' + doDateMonth;
    let doDateYear = calendar.year.value;
    doDate.textContent = doDateDay + '.' + doDateMonth + '.' + doDateYear;
});
