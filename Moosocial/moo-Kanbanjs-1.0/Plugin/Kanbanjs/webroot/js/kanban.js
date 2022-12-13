var data = ej.base.extend([], window.cardData, null, true);
var kanbanObj = new ej.kanban.Kanban({
    dataSource: data,
    keyField: 'Status',
    columns:[
        {headerText: 'Backlog', keyField: 'Open', template: '#headerTemplate', allowToggle: true},
        {headerText: 'In Progress', keyField: 'InProgress', template: '#headerTemplate', allowToggle: true},
        {headerText: 'Review', keyField: 'Review', template: '#headerTemplate', allowToggle: true},
        {headerText: 'Done', keyField: 'Close', template: '#headerTemplate', allowToggle: true},
    ],
    cardSettings:{
        contentField: 'Summary',
        headerField: 'Id',
        template: '#cardTemplate'
    },
    swimlaneSettings: {
        keyField: 'Assignee',
        template: '#swimlaneTemplate',
        allowDragAndDrop: true,
        // enableFrozenRows: true => provoca fallos
    },
    dialogSettings: {
        template: '#dialogTemplate'
    },
    enablePersistence: true
});
kanbanObj.appendTo('#kanban-container');