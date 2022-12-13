window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("closeLeftNav").addEventListener('click', () => {
        toogleNav();
    });
})
function toogleNav() {
    console.log("toogle nav...");
    document.getElementById("leftnav").classList.toggle("sidebar_small");
    document.getElementById("center").classList.toggle("main-content_large");
    document.getElementById("leftnav-content").classList.toggle("hide");
    document.getElementById("leftnav-title").classList.toggle("hide");
    
    let button = document.getElementById("closeLeftNav");
    let isOpen = button.firstElementChild.classList.contains("moo-icon-arrow_back_ios");
    button.removeChild(button.firstElementChild);
    let openBtn = document.createElement("span");
    openBtn.classList.add("menu-list-icon", "material-icons", "moo-icon");
    if(isOpen) {
        openBtn.classList.add("moo-icon-arrow_forward_ios");
        openBtn.innerHTML="arrow_forward_ios";
    }else {
        openBtn.classList.add("moo-icon-arrow_back_ios");
        openBtn.innerHTML="arrow_back_ios";
    }   
    
    button.appendChild(openBtn);
}

function checkboxOnChange(checkboxItem) {
    console.log("Click in checkbox: ", checkboxItem, ej.base.getComponent("kanban-container", "kanban"));
    let kanbanObj = ej.base.getComponent("kanban-container", "kanban");
    console.log("Check box status: ", checkboxItem.checked, kanbanObj.query);
    let userId = checkboxItem.attributes["user-data"].value;
    let filterQuery = new ej.data.Query();
    let predicate = new ej.data.Predicate('Owner', "notequal", userId);
    if(kanbanObj.query) {   //
        query = kanbanObj.query.clone();
        if(!predicateExists(predicate, query.queries, 'onWhere')) {//
            if(!checkboxItem.checked)
                query.queries.push({fn:'onWhere', e: predicate});
            filterQuery = query;
        }
    } else {
        if(!checkboxItem.checked) {
            filterQuery = new ej.data.Query().where(predicate);
        }
    }
    
    kanbanObj.query = filterQuery;
}

function predicateExists(predicate, queries, fn) {
    return queries.find(x => (x.e.value === predicate.value && x.e.field === predicate.field && x.e.operator === predicate.operator && fn === x.fn));
}