<?php
echo $this->Html->css(array('Tasks.kanban'), array('inline' => false));
 ?>
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

<div class="bar-content">
    <div class="box2 bar-content-warp">
        <div class="box_header mo_breadcrumb">
            <div class="box_header_main">
                <h1 class="box_header_title"><?php echo __('Create a new card')?></h1>
            </div>
        </div>

        <div class="box_content">
            <div class="create_form">
            <form id="addTaskForm" class="form-horizontal">
                <?php if ($warning_msg): ?>
                    <div class="form-group">
                        <?php echo $warning_msg ?>
                    </div>
                <?php else: ?>
                    <div class="form-group">
                    <label class="col-sm-2 control-label" for="task_title"><?php echo __('Task') ?></label>
                    
                    <div class="assigned-to" >
                        <div class="col-xs-6 task-title-input">
                            <input class="form-control" name="task_title" value="">
                        </div>
                        <div class="flex-container-2 col-xs-6-cs ">
                        <label class="col-sm-2-cs control-label mg-r-20" for="task_priority"><?php echo __('Priority') ?></label>
                        <div class="task-priority-input">
                            <?php echo $this->Form->select('task_priority', $priorities, array('value' => 'Low', 'class' => 'form-control')); ?>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="attachment"><?php echo __('Attachment') ?></label>
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
                    <div class="form-group">
                    <label for="requester" class="col-sm-2 control-label"><?php echo __('Requester') ?></label>
                    <div class="assigned-to">
                        <div class="col-sm-8">
                            <?php echo "(Me) Zenón Martínez Cruz" ?>
                        </div>
                        <div class="flex-container-2 col-xs-12-cs" >
                        <label class="col-sm-2-cs  control-label mg-r-20" for="task_assignee"><?php echo __('Requestee') ?></label>
                        <div class="col-sm-10-cs">
                        <?php echo $this->Form->text('task_assignee', array('value' => "", 'class' => 'form-control', 'placeholder' => '')); ?>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="form-group">
                        <label for="type" class="col-sm-2 control-label"><?php echo __('Assigned to') ?></label>
                        <fieldset class = "assigned-to pd-l-10">
                            <div class="mg-b-10">
                            <input class="mg-r-10" type="radio" name="type" value="job"> <span class="mg-l-10 type">Job</span>
                            </div>
                            <div class="flex-container mg-b-10">
                            <input class="mg-r-10"type="radio" name="type" value="project"> <span class="mg-l-10 type">Project</span>
                            <div class="flex-container mg-l-10">
                                <?php echo $this->Form->text( 'keyword_projects', array( 'placeholder' => __('Enter keyword to search'), 'rel' => 'tasks', 'class' => 'form-control advanced-search-keyword json-view icon-inside-input') );?>
                                <span class="material-icons moo-icon moo-icon-search icon-inside">search</span>
                            </div>
                            </div>
                            <div class="flex-container mg-b-10">
                            <input class="mg-r-10" type="radio" name="type" value="process"> <span class="mg-l-10 type">Process</span>
                            <div class="flex-container mg-l-10">
                                <?php echo $this->Form->text( 'keyword_process', array( 'placeholder' => __('Enter keyword to search'), 'rel' => 'tasks', 'class' => 'form-control advanced-search-keyword json-view icon-inside-input') );?>
                                <span class="material-icons moo-icon moo-icon-search icon-inside">search</span>
                            </div>
                            </div>                           
                        </fieldset>
                    </div>

                    <div class="row">
                        <div class="col-sm-offset-2 col-sm-10">
                        <div class="create-form-actions">
                        <?php if (!$warning_msg): ?>
                            <a class="btn btn-modal_save" href="javascript:void(0);" data-uid="<?php echo $userId ?>" id="sendReqAssignFriendBtn"><?php echo __('Assign') ?></a>
                        <?php endif;?>
                        <button type="button" class="btn btn-modal_close" data-dismiss="modal"><?php echo __('Cancel') ?></button>
                        </div>
                        </div>
                        
                    </div>
                <?php endif;?>
    </form>
            </div>
        </div>
    </div>
</div>