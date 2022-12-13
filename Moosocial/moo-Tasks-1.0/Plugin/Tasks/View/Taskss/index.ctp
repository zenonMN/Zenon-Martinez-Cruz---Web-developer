<!-- Syncfusion -->
<?php
echo $this->Html->css(array('Tasks.base/material', 'Tasks.buttons/material', 'Tasks.dropdowns/material', 'Tasks.inputs/material', 'Tasks.kanban/material', 'Tasks.layouts/material', 'Tasks.navigations/material', 'Tasks.popups/material'), array('inline' => false));
echo $this->Html->css(array('Tasks.header-kanban', 'Tasks.card', 'Tasks.swimlane', 'Tasks.kanban'), array('inline' => false));
// echo $this->Html->script(array('tinymce/tinymce.min'), array('inline' => false));
// echo $this->Html->script(array('Tasks.base/ej2-base.min', 'Tasks.buttons/ej2-buttons.min', 'Tasks.dropdowns/ej2-dropdowns.min'), array('inline' => false)); //No funciona
 ?>
<script type="text/javascript" src="/moosocial/tasks/js/base/ej2-base.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/data/ej2-data.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/inputs/ej2-inputs.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/buttons/ej2-buttons.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/popups/ej2-popups.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/layouts/ej2-layouts.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/splitbuttons/ej2-splitbuttons.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/lists/ej2-lists.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/navigations/ej2-navigations.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/dropdowns/ej2-dropdowns.min.js"></script>
<script type="text/javascript" src="/moosocial/tasks/js/kanban/ej2-kanban.min.js"></script>
<!-- End -->

<?php $this->setNotEmpty('west');?>
<?php $this->start('west'); ?>
<div class="box2 bar-content-warp">
    <div class="box_header">
        <div class="box_header_main">
            <h3 id="leftnav-title" class="box_header_title text-nowrap"><?php echo __('Great Job Team!') ?></h3>
            <a id ="closeLeftNav" class="menu-list-link no-ajax">
                <span class="menu-list-icon material-icons moo-icon moo-icon-arrow_back_ios">arrow_back_ios</span>
            </a>
        </div>
    </div>
    <div id="leftnav-content" class="box_content box_menu text-nowrap">
        <?php echo $this->element('options_list')?>
        <?php echo $this->element('filters')?>
    </div>
</div>
<?php $this->end(); ?>
<?php echo $this->element('browse_tabs')?>

<div class="box2 box_browse bar-content-warp">
    <div class="box_header">
        <div class="box_header_main">
        	<?php 
        		$title = __('Kanban board');
                if($board) {
                    $title = $board['KanbanBoard']['title'];
                }
        	?>
            <h1 class="box_header_title text-ellipsis"><?php echo $title ?></h1>
            <div class="box_action">
            <a class="btn btn-modal_save" href="<?php echo $this->request->base?>/taskss/create" title="<?php echo __('New task')?>">
            <span class="menu-list-icon material-icons moo-icon moo-icon-event_note">event_note</span>
            <span class="menu-list-text">New task</span>
            </a>
            </div>
        </div>
    </div>
    <div id="kanban-container" class="box_content"></div>
    <script id="headerTemplate" type="text/x-jsrender">
    <div class="header-template-wrap">
        <div class="header-icon e-icons ${keyField}"></div>
        <div class="header-text"> ${headerText}</div>
    </div>
</script>
<script id="cardTemplate" type="text/x-jsrender">
    <div class='card-template' style="${getBorderLeftColor(data)}">
            <div class='e-card-header'>
                <div class='e-card-header-caption'>
                     <div class='e-card-header-title e-tooltip-text'>${Title}</div>
                </div>
            </div>
            <div class='e-card-content e-tooltip-text'>
                <div class='e-text'>${Summary}</div>
            </div>
            <div class='e-card-custom-footer'>
                <div class='${getType(data)}'></div>
                <div class='${getPriority(data)}'></div>
                <div class='e-card-avatar'> ${getString(data.Assignee)}</div>
            </div>
        </div>
</script>
<script id="dialogTemplate" type="text/x-template">
<table>
        <tbody>
            <tr>
                <td class="e-label">ID</td>
                <td>
                    <input id="Id" name="Id" type="text" class="e-field" value="${Id}" disabled required/>
                </td>
            </tr>
            <tr>
                <td class="e-label">Title</td>
                <td>
                    <textarea type="text" name="Title" id="Title" class="e-field" value=${Title}>${Title}</textarea>
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
                    <input type="text" name="Assignee" id="Assignee" class="e-field" value=${AssigneeId} /> 
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
        <div class="e-swimlane-row-text"><img src="${getAvatar(data)}" alt=""/><span>${textField}</span></div>
    </div>
</script>
</div>

<?php if($board): ?>
    <?php $this->Html->scriptStart(array('inline' => false, 'domReady' => true, 'requires' => array('jquery', '/moosocial/tasks/js/task.js'), 'object' => array('$', 'mooTask'))); ?>
    mooTask.showKanbanBoard();

    <?php $this->Html->scriptEnd(); ?>
    <!-- <script type="text/javascript" src="/moosocial/tasks/js/task.js"></script>
    <script type="text/javascript">
        window.kanbanData = [];
        mooTask.showKanbanBoard();
    </script> -->
<?php else: ?>
    <script type="text/javascript">
        console.log("No hay tablero");
    </script>
<?php endif; ?>
<script type="text/javascript" src="/moosocial/tasks/js/actions.js"></script>