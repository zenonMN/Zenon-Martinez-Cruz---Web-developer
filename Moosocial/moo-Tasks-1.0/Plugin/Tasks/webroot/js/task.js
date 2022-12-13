/**
 * 
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'mooPhrase', 'mooButton', 'mooAlert', 'mooPhoto', 'mooFileUploader', 'mooGlobal', 'tinyMCE'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.mooTask = factory();
    }
}(this, function ($, mooPhrase, mooButton, mooAlert, mooPhoto, mooFileUploader, mooGlobal, tinyMCE) {

    $(document).ready(() => {
        //Search 1
        var timer;
        $("#keyword_assigned_by").on("keyup", () => {
            clearTimeout(timer);
            let value = $("#keyword_assigned_by").val().toLowerCase();          
            timer = setTimeout(() => {
                console.log("Search input...", value);
                //
                let searchQuery = new ej.data.Query();
                if(value !== ''){
                    searchQuery = new ej.data.Query().search(value, ['Owner'], 'contains', true);
                }
                window.kanbanObj.query = searchQuery;
            }, 200);
        });
    });
    
    $('.sidebar-modal').on('show.bs.sidebarModal', function (e) {
        console.log("Sidebar model show...");
        document.getElementById("leftnav").classList.remove("sidebar_small");
        document.getElementById("center").classList.remove("main-content_large");
        document.getElementById("leftnav-content").classList.remove("hide");
        document.getElementById("leftnav-title").classList.remove("hide");

        let button = document.getElementById("closeLeftNav");
        button.removeChild(button.firstElementChild);
        let openBtn = document.createElement("span");
        openBtn.classList.add("menu-list-icon", "material-icons", "moo-icon");
        openBtn.classList.add("moo-icon-arrow_back_ios");
        openBtn.innerHTML="arrow_back_ios";  
        button.appendChild(openBtn);
    });

    //
    var initOnCreate = function() {
        var uploader = new mooFileUploader.fineUploader({
            element: $('#photos_upload')[0],
            autoUpload: false,
            text: {
                uploadButton: '<div class="upload-section"><span class="upload-section-icon material-icons moo-icon moo-icon-photo_camera">photo_camera</span>' + mooPhrase.__('drag_or_click_here_to_upload_photo') + '</div>'
            },
            validation: {
                allowedExtensions : mooConfig.photoExt,
                sizeLimit : mooConfig.sizeLimit
            },
            request: {
                endpoint: mooConfig.url.base + "/blog/blog_upload/images"
            },
            callbacks: {
                onError: mooGlobal.errorHandler,
                onComplete: function (id, fileName, response) {
                	$('#blog_photo_ids').val($('#blog_photo_ids').val() + ',' + response.photo_id);
                    tinyMCE.activeEditor.insertContent('<p align="center"><a href="' + response.large + '" class="attached-image"><img src="' + response.thumb + '"></a></p><br>');
                }
            }
        });
        $('#triggerUpload').unbind('click');
        $('#triggerUpload').click(function () {
            uploader.uploadStoredFiles();
        });
        var uploader1 = new mooFileUploader.fineUploader({
            element: $('#task_attachment_thumbnail')[0],
            multiple: false,
            text: {
                uploadButton: '<div class="upload-section"><span class="upload-section-icon material-icons moo-icon moo-icon-cloud_upload">cloud_upload</span>' + 'Suelta los archivos para adjuntarlos o buscar' + '</div>'
            },
            validation: {
                allowedExtensions: mooConfig.photoExt,
                sizeLimit: mooConfig.sizeLimit
            },
            request: {
                endpoint: mooConfig.url.base + "/blog/blog_upload/avatar"
            },
            callbacks: {
                onError: mooGlobal.errorHandler,
                onComplete: function (id, fileName, response) {
                    // $('#blog_thumnail_preview > img').attr('src', response.thumb);
                    // $('#blog_thumnail_preview > img').show();
                    // $('#thumbnail').val(response.file);
                }
            }
        });
        // toggleUploader
        $('#toggleUploader').unbind('click');
        $('#toggleUploader').on('click', function(){
            $('#images-uploader').slideToggle();
        });
    }

    // app/View/Taskss/add_task.ctp
    var initAssignFriend = function () {
        console.log("[mooTask] - initAssignFriend...");
        $('#sendReqAssignFriendBtn').unbind('click');
        $('#sendReqAssignFriendBtn').click(function () {
            console.log("[mooTask] - task assigned... ", $("#addTaskForm").serialize());
            var data = $(this).data();
            var uid = data.uid;
            $('#sendReqAssignFriendBtn').spin('small');

            mooButton.disableButton('sendReqAssignFriendBtn');

            $.post(mooConfig.url.base + "/taskss/ajax_sendRequest", $("#addTaskForm").serialize(), function (data) {

                mooButton.enableButton('sendReqAssignFriendBtn');

                $('#themeModal').modal('hide');

                mooAlert.alert(data);


                location.reload();
            });
            return false;
        });
    }

    window.getTags = function (data) {
        var tagDiv = '';
        var tags = data.split(',');
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            tagDiv += '<div class="e-card-tag-field e-tooltip-text">' + tag + '</div>';
        }
        return tagDiv;
    };
    window.getString = function (assignee) {
        return assignee.match(/\b(\w)/g).join('').toUpperCase();
    };
    window.getType = function (data) {
        return "e-story e-card-footer-css";
    };
    window.getPriority = function (data) {
        // console.log("Get priority: ", data);
        return "e-card-footer-css " + data["ClassName"];
    };

    window.getAvatar = function(data) {
        let user = getUser(window.friends, data["keyField"]);
        let avatar = user['User']['avatar'] !== "" ? '/moosocial/uploads/users/avatar/'+ user['User']['id'] + '/200_square_' + user['User']['avatar']: "/moosocial/user/img/noimage/Male-user-sm.png";
        return avatar;
    };

    window.getBorderLeftColor = function(data) {
        return "border-left:5px solid " + data["Color"];
    };

    var showKanbanBoard = function () {
        console.log("Get Cards...");
        $.get(mooConfig.url.base + "/taskss/ajax_get_cards/", function (data) {
            // console.log("Data response: ", data);
            let cardData = [];
            data = JSON.parse(data);
            let cards = data['cards'];
            let friends = data["friends"];
            window.userId = data['userId'];
            window.friends = data["friends"];
            for (let card in cards) {
                // console.log("Card: ", JSON.stringify(cards[card]));
                card = cards[card];
                user = getUser(data["friends"], card["KanbanCard"]["assigned_user"]);
                // console.log("USER avatar: ", user['User']['avatar'] !== "" ? 'uploads/users/avatar/'+ user['User']['id'] + '/200_square_' + user['User']['avatar']: "/moosocial/user/img/noimage/Male-user-sm.png");
                // console.log("USER assigned name: ", user['User']['name']);
                cardData.push({
                    Id: card['KanbanCard']['id'],
                    Title: card['KanbanCard']['title'],
                    Status: card['KanbanCard']['stack_id'],
                    Priority: card['KanbanCard']['priority'],
                    Assignee: user['User']['name'],
                    SwimlaneTitle: card['KanbanCard']['assigned_user'] ===  data['userId'] ? "Mis tareas" : user['User']['name'],
                    AssigneeId: card['KanbanCard']['assigned_user'],
                    Summary: card['KanbanCard']['description'],
                    Owner: card['KanbanCard']['owner'],
                    Avatar: user['User']['avatar'] !== "" ? '/moosocial/uploads/users/avatar/'+ user['User']['id'] + '/200_square_' + user['User']['avatar']: "/moosocial/user/img/noimage/Male-user-sm.png",
                    Color: getColorByPriority(card['KanbanCard']['priority']),
                    ClassName: "e-"+card['KanbanCard']['priority'].toLowerCase(),
                    Tags: ""
                });
                // console.log("Card data: ", cardData);
            }
            window.cardData = cardData;
            console.log("showKanbanBoard init...");
            var data = ej.base.extend([], window.cardData, null, true);
            var kanbanObj = new ej.kanban.Kanban({
                dataSource: data,
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', template: '#headerTemplate' },
                    { headerText: 'To Do', keyField: 'ToDo', template: '#headerTemplate' },
                    { headerText: 'Doing', keyField: 'Doing', template: '#headerTemplate' },
                    { headerText: 'Done', keyField: 'Done', template: '#headerTemplate' },
                    { headerText: 'Approved', keyField: 'Approved', template: '#headerTemplate' },
                ],
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id',
                    template: '#cardTemplate'
                },
                swimlaneSettings: {
                    keyField: 'AssigneeId',
                    textField: 'SwimlaneTitle',
                    template: '#swimlaneTemplate',
                    // allowDragAndDrop: true,
                    // showEmptyRow: true,
                    sortComparer: swimlaneComparer,
                    sortDirection: "Ascending"
                },
                dialogSettings: {
                    template: '#dialogTemplate'
                },
                dialogOpen: onDialogOpen,
                dataBound: OnDataBound,
                dragStop: dragStop,
                dragStart: dragStart
                // enablePersistence: true
            });
            kanbanObj.appendTo('#kanban-container');
            window.kanbanObj = kanbanObj;
            var statusData = ['Open', 'To Do','Doing', 'Done', 'Approved'];
            var priorityData = ['Low', 'Normal', 'Critical', 'High'];
            var assigneeData = getFriendsArray(friends);
            var cardSelected = {};
            function onDialogOpen(args) {
                console.log("ARGS: ", args);
                if (args.requestType !== 'Delete') {
                    var curData = args.data;
                    var filledTextBox = new ej.inputs.TextBox({});
                    filledTextBox.appendTo(args.element.querySelector('#Id'));
                    var titleTextBox = new ej.inputs.TextBox({
                        placeholder: 'Task title',
                        multiline: false
                    });
                    titleTextBox.appendTo(args.element.querySelector('#Title'));
                    // var numericObj = new ej.inputs.NumericTextBox({
                    //     value: curData.Estimate, placeholder: 'Estimate',
                    // });
                    // numericObj.appendTo(args.element.querySelector('#Estimate'));
                    var statusDropObj = new ej.dropdowns.DropDownList({
                        value: curData.Status, popupHeight: '300px',
                        dataSource: statusData, fields: { text: 'Status', value: 'Status' }, placeholder: 'Status'
                    });
                    console.log("Assignee Data: ", assigneeData, curData.Assignee);
                    statusDropObj.appendTo(args.element.querySelector('#Status'));
                    var assigneeDropObj = new ej.dropdowns.DropDownList({
                        value: curData.Assignee, popupHeight: '300px',
                        dataSource: assigneeData, fields: { text: 'Assignee', value: 'Assignee' }, placeholder: 'Assignee'
                    });
                    assigneeDropObj.appendTo(args.element.querySelector('#Assignee'));
                    var priorityObj = new ej.dropdowns.DropDownList({
                        value: curData.Priority, popupHeight: '300px',
                        dataSource: priorityData, fields: { text: 'Priority', value: 'Priority' }, placeholder: 'Priority'
                    });
                    priorityObj.appendTo(args.element.querySelector('#Priority'));
                    var textareaObj = new ej.inputs.TextBox({
                        placeholder: 'Summary',
                        multiline: true
                    });
                    textareaObj.appendTo(args.element.querySelector('#Summary'));
                }
            }
            function OnDataBound(args) {
                console.log("ARGS: ", args);
                let actionType = args.requestType;
                let data = {};
                switch (actionType) {
                    case 'cardChanged':
                        data = args.changedRecords[0];
                        console.log("STATUS: ", String(data["Status"]).toString().replace(" ", ""));
                        $.post(mooConfig.url.base + "/taskss/ajax_update_card/", {
                            id: data["Id"],
                            title: data["Title"],
                            description: data["Summary"],
                            owner: data["Owner"],
                            assigned_user: data["AssigneeId"],
                            priority: data["Priority"],
                            stack_id: String(data["Status"]).toString().replace(" ", "")
                        },function (data) {
                            console.log("save response: ", data);
                        });
                        break;

                    case 'cardRemoved':
                        data = args.deletedRecords[0];
                        $.post(mooConfig.url.base + "/taskss/ajax_remove_card/", {
                            id: data["Id"]
                        },function (data) {
                            console.log("Delete response: ", data);
                        });
                        break;
                    default:
                        break;
                }
            }
            function swimlaneComparer(cards) {
                // console.log("swimlaneComparer...",cards);
                cards.sort((a, b) => {
                    if(a["textField"] === "Mis tareas")
                        return -1;
                    else
                        return 1;
                });
                return cards;
            }
            function dragStart(args) {
                cardSelected = args.data[0];
            }
            function dragStop(args) {
                let data = args.data[0];
                console.log("Drag stop: ", args, cardSelected);
                
                if(data["AssigneeId"] === window.userId && data["Owner"] !== window.userId && data["Status"] === "Approved" ) {
                    args.cancel = true;
                } 
                else if(data["AssigneeId"] !== window.userId && data["Owner"] === window.userId) {
                    console.log("Cancel drop... ");
                    if(data["Status"] !== "Approved") {
                        args.cancel = true;
                    } else if(cardSelected["Status"] !== "Done") {
                        args.cancel = true;
                    }
                } 
            }            
        });

    }

    var getFriendsArray = function (friends) {
        let array = [];
        for(let friend in friends) {
            console.log(friend, friends[friend]);            
            array.push(friends[friend]["User"]["name"]);
        }
        // console.log("User names array: ", array);
        return array;
    }

    var getUser = function (friends, userId) {
        // console.log("Search: ", userId, friends);
        return friends.find((friend) => friend["User"]["id"] === userId);
    }

    var getColorByPriority = function(priority) {
        switch (priority) {
            case "Low": return "#02897B";
            case "Normal":return "#673AB8";
            case "High": return "#E64A19";
            case "Critical":return "#E64A19";
            default:
                break;
        }
    }

    var initFilters = () => {
        console.log("Init filters...");
    }

    var initUsersCheckboxListeners  = () => {
        let container = document.getElementById("checkbox-users");
        
    }

    return {
        initAssignFriend: initAssignFriend,
        showKanbanBoard: showKanbanBoard,
        initOnCreate: initOnCreate,
        initFilters: initFilters
    }
}));