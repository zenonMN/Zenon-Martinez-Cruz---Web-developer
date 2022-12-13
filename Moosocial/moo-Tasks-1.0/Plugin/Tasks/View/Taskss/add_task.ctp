<?php if($this->request->is('ajax')): ?>
<script type="text/javascript">
    require(["jquery","/moosocial/tasks/js/task.js"], function($,mooTask) {
        mooTask.initAssignFriend();
    });
</script>
<?php else: ?>
<?php $this->Html->scriptStart(array('inline' => false, 'domReady' => true, 'requires'=>array('jquery','/moosocial/tasks/js/task.js'), 'object' => array('$', '/moosocial/tasks/js/task.js'))); ?>
mooTask.initAssignFriend();
<?php $this->Html->scriptEnd(); ?>
<?php endif; ?>

<div class="modal-header">
    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>
    <div class="title-modal">
        <?php echo __('Create a new card')?>
    </div>
</div>
<div class="create_form">
    <form id="addTaskForm" class="form-horizontal">
        <div class="modal-body">
            <div class="modal-form-content">
                <div class="form-content">
                <?php if ($warning_msg): ?>
                    <div class="form-group">
                        <?php echo $warning_msg?>
                    </div>
                <?php else: ?>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="task_id"><?php echo __('Id')?></label>
                        <div class="col-sm-10">
                            <input class="form-control" name="task_id" value="<?php echo "1" ?>">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="board"><?php echo __('Board')?></label>
                        <div class="col-sm-10">
                        <?php echo $this->Form->select('board', $boards, array('value' => $boardId, 'class'=>'form-control')); ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="task_title"><?php echo __('Card title')?></label>
                        <div class="col-sm-10">
                            <input class="form-control" name="task_title" value="<?php echo "Card title" ?>">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="task_assignee"><?php echo __('Assignee')?></label>
                        <div class="col-sm-10">
                        <?php echo $this->Form->select('task_assignee', $friends, array('value' => $uid, 'class'=>'form-control')); ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="task_priority"><?php echo __('Priority')?></label>
                        <div class="col-sm-10">
                            <?php echo $this->Form->select('task_priority', $priorities, array('value' => 'Low', 'class'=>'form-control')); ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="summary"><?php echo __('Summary')?></label>
                        <div class="col-sm-10">
                            <?php echo $this->Form->textarea('summary', array('class' => 'form-control')); ?>
                        </div>
                    </div>
                <?php endif; ?>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <?php if (!$warning_msg): ?>
            <a class="btn btn-modal_save" href="javascript:void(0);" data-uid="<?php echo $userId ?>" id="sendReqAssignFriendBtn"><?php echo __('Assign')?></a>
            <?php endif; ?>
            <button type="button" class="btn btn-modal_close" data-dismiss="modal"><?php echo __('Cancel')?></button>
        </div>
    </form>
</div>