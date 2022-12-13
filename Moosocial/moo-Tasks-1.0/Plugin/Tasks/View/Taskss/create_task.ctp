<?php if($this->request->is('ajax')): ?>
<script type="text/javascript">
    require(["jquery","/moosocial/tasks/js/task.js"], function($,mooTask) {
        mooTask.initAssignFriend();
        mooTask.initOnCreate();
    });
</script>
<?php else: ?>
<?php $this->Html->scriptStart(array('inline' => false, 'domReady' => true, 'requires'=>array('jquery','/moosocial/tasks/js/task.js'), 'object' => array('$', 'mooTask'))); ?>
mooTask.initAssignFriend();
mooTask.initOnCreate();
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
                    <div class="task-section-create">
                    <div class="form-group task-title">
                        <label class="col-sm-2-cs col-sm-2-cs-2 control-label task-title-label" for="task_title"><?php echo __('Task')?></label>
                        <div class="col-xs-6 task-title-input">
                            <input class="form-control" name="task_title" value="">
                        </div>
                    </div>
                    <div class="form-group task-priority">
                        <label class="col-sm-2-cs control-label mg-r-20" for="task_priority"><?php echo __('Priority')?></label>
                        <div class="col-xs-6 task-priority-input">
                            <?php echo $this->Form->select('task_priority', $priorities, array('value' => 'Low', 'class'=>'form-control')); ?>
                        </div>
                    </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="attachment"><?php echo __('Attachment')?></label>
                        <div class="col-sm-10">
                            <div id="task_attachment_thumbnail" class="control-upload"></div>
                            <div id="task_attachment_thumnail_preview" class="control-upload-review">
                                
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                    <label for="summary" class="col-sm-2 control-label"><?php echo __('Summary') ?></label>
                        <div class="col-sm-10 tiny_desc">
                            <?php echo $this->Form->tinyMCE('summary', array('value' => "", 'id' => 'taskEditor', 'width' => '100%'), $this); ?>
                            <div class="toggle_image_wrap">
                                <div id="images-uploader" style="display: none;">
                                    <div class="form-group">
                                        <div class="col-xs-12">
                                            <div id="photos_upload"></div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-xs-12">
                                            <a href="javascript:void(0);" class="btn btn-success btn-sm" id="triggerUpload"><?php echo __('Upload Queued Files') ?></a>
                                        </div>
                                    </div>
                                </div>
                                <?php //if (empty($isMobile)): ?>
                                <a id="toggleUploader" class="btn-toggle-image" href="javascript:void(0)"><?php echo __('Upload photos into editor') ?></a>
                                <?php //endif; ?>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="curse" class="col-sm-2 control-label"><?php echo __('Curse') ?></label>
                        <div class="col-sm-10">
                            <?php echo $this->Form->text('curse', array('value' => "", 'class' => 'form-control', 'placeholder' => '')); ?>
                        </div>
                    </div>
                    <div class="task-section-create">
                    <div class="form-group task-priority">
                        <label for="requester" class="col-sm-2-cs control-label"><?php echo __('Requester') ?></label>
                        <div class="col-sm-10">
                            <?php echo "(Me)" ?>
                        </div>
                    </div>
                    <div class="form-group task-title">
                        <label class="col-sm-2-cs  control-label" for="task_assignee"><?php echo __('Requestee')?></label>
                        <div class="col-sm-10">
                        <?php echo $this->Form->text('task_assignee', array('value' => "", 'class' => 'form-control', 'placeholder' => '')); ?>
                        </div>
                    </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-sm-2 control-label"><?php echo __('Assigned to') ?></label>
                        <fieldset>
                            <input type="radio" name="type" value="job"> Job
                            <input type="radio" name="type" value="project"> Project
                            <?php echo $this->Form->text('type', array('value' => "", 'class' => 'form-control', 'placeholder' => '')); ?>
                            <input type="radio" name="type" value="process"> Process
                            <?php echo $this->Form->text('process', array('value' => "", 'class' => 'form-control', 'placeholder' => '')); ?>
                        </fieldset>
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