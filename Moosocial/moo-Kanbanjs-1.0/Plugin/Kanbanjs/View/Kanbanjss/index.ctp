<?php
echo $this->Html->css(array('Kanbanjs.base/material', 'Kanbanjs.buttons/material', 'Kanbanjs.dropdowns/material', 'Kanbanjs.inputs/material', 'Kanbanjs.kanban/material', 'Kanbanjs.layouts/material', 'Kanbanjs.navigations/material', 'Kanbanjs.popups/material'), array('inline' => false));
echo $this->Html->css(array('Kanbanjs.header-kanban', 'Kanbanjs.card', 'Kanbanjs.swimlane'), array('inline' => false));
// echo $this->Html->script(array('Kanbanjs.base/ej2-base.min', 'Kanbanjs.buttons/ej2-buttons.min', 'Kanbanjs.dropdowns/ej2-dropdowns.min'), array('inline' => false)); //No funciona
 ?>
<script type="text/javascript" src="/moosocial/kanbanjs/js/base/ej2-base.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/data/ej2-data.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/inputs/ej2-inputs.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/buttons/ej2-buttons.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/popups/ej2-popups.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/layouts/ej2-layouts.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/splitbuttons/ej2-splitbuttons.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/lists/ej2-lists.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/navigations/ej2-navigations.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/dropdowns/ej2-dropdowns.min.js"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/kanban/ej2-kanban.min.js"></script>

<div>
    <div id="kanban-container" style="padding-top:10px;"></div>
</div>
<script id="headerTemplate" type="text/x-jsrender">
    <div class="header-template-wrap">
        <div class="header-icon e-icons ${keyField}"></div>
        <div class="header-text"> ${headerText}</div>
    </div>
</script>
<script id="cardTemplate" type="text/x-jsrender">
    <div class='card-template' >
    <div class="card-template-wrap">
        <table class="card-template-wrap">
            <tbody>
            <tr>
                <td class="CardHeader">Id:</td>
                <td>${Id}</td>
            </tr>
            <tr>
                <td class="CardHeader">Type</td>
                <td>${Type}</td>
            </tr>
            <tr>
                <td class="CardHeader">Priority</td>
                <td>${Priority}</td>
            </tr>
            <tr>
                <td class="CardHeader">Summary</td>
                <td>${Summary}</td>
            </tr>
            </tbody>
        </table>
    </div>
    </div>
</script>
<script id="dialogTemplate" type="text/x-template">
    <table>
        <tbody >
        <tr>
    <td class="e-label">ID</td>
    <td>
        <input id="Id" name="Id" type="text" class="e-field" value="${Id}" disabled required/>
</td>
</tr>
<tr>
<td class="e-label">Status</td>
        <td>
            <input type="text" name="Status" id="Status" class="e-field" value=${Status} required />
</td>
</tr>
<tr>
<td class="e-label">Assignee</td>
            <td>
                <input type="text" name="Assignee" id="Assignee" class="e-field" value=${Assignee} />
</td>
</tr>
<tr>
<td class="e-label">Priority</td>
                <td>
                    <input type="text" name="Priority" id="Priority" class="e-field" value=${Priority} />
</td>
</tr>
<tr>
<td class="e-label">Summary</td>
                    <td>
                        <textarea type="text" name="Summary" id="Summary" class="e-field" value=${Summary}>${Summary}</textarea>
<span class="e-float-line"></span>
                    </td>
                </tr>
        </tbody> 
    </table>
</script>
<script id="swimlaneTemplate" type="text/x-jsrender">
    <div class='swimlane-template e-swimlane-template-table'>
        <div class="e-swimlane-row-text"><img src="//ej2.syncfusion.com/javascript/demos/src/kanban/images/${keyField}.png" alt=""/><span>${textField}</span></div>
    </div>
</script>
<script src="/moosocial/kanbanjs/js/datasource.js" type="text/javascript"></script>
<script type="text/javascript" src="/moosocial/kanbanjs/js/kanban.js"></script>
