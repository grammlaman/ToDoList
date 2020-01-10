
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
        let data = new Date;
        if(!taskData['date']){
            _.date = data.getYear + '-' + data.getMonth + '-' + data.getDate;
        }
        _.marks = taskData['marks'] || [];	//Массив идентификаторов меток
    }
}

function Counter(x = 0){
    i = x;
    return function(){
        return i = i + 1;
    }
}
let idGenerate = Counter();


class List{
    constructor(){
        const _ = this;
        //Свойства
        _.currentMonth = 0;
        _.currentDay = 0;

        _.tasks = {};
        _.currentTask = {};
    }
    //Методы выборки
    getCategory(){}
    getMark(){}
    getCurrent(){}
    getDay(){}
    getMonth(){}
    getYear(){}
    getAll(){}

    //Методы добавления
    addTask(taskData){
        const _ = this;
        let t = new Task(taskData);
        if(!_.tasks[t.date]){
            _.tasks[t.date] = [];
        }
        _.tasks[t.date].push(t);
        _.currentTask = t;
        localStorage.setItem(t,JSON.stringify.t);
    }
    addCategory(){}
    addMark(){}

    //Методы редоктирования
    update(){}

    //Методы удаления
    removeCategory(){}
    removeMark(){}
    removeTask(){}
}


let list = new List()
list.addTask({
    title: 'Покушать',
    description: 'Люблю кушать',
    catID: 2,
    date: '2019-12-31',
    marks: [1,3,4]
})
list.addTask({
    title: 'Пить',
    description: 'Люблю кушать',
    catID: 2,
    date: '2019-12-31',
    marks: [1,3,4]
})
list.addTask({
    title: 'Пить',
    description: 'Люблю кушать',
    catID: 2,
    date: '2025-10-31',
    marks: [1,3,4]
})
