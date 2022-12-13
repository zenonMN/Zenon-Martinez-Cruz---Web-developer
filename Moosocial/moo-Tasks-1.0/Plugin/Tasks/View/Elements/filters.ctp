<script type="text/javascript" src="/moosocial/tasks/js/actions.js"></script>
<div id="filters-container" class="filters-ctn">
    <div class="create_form">
        <div id="filterForm" class="form-filter" method="">
            <div class="form-content">
                <div class="form-group flex-container">
                    <span></span>
                    <span>Clear filters</span>
                </div>
                <div class="form-group">
                    <label class="checkbox-control">
                        <?php echo $this->Form->checkbox('task', array('checked' => '')); ?>
                        <?php echo __('Task')?>
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div class="form-group flex-container">
                    <span>ASSIGNED BY</span>
                    <span>all</span>
                </div>
                <div class="form-group flex-container">
                    <?php echo $this->Form->text( 'keyword_assigned_by', array( 'placeholder' => __('Search'), 'class' => 'form-control advanced-search-keyword json-view icon-inside-input') );?>
                    <span class="material-icons moo-icon moo-icon-search icon-inside">search</span>
                </div>
                <div id="checkbox-users" class="form-group flex-container-column">
                    <?php 
                        if (!empty($friends)&& count($friends) >0) {
                            $i = 1;
                            foreach ($friends as $friend):
                    ?>

                     <label class="checkbox-control mg-b-10">
                        <?php echo $this->Form->checkbox('user'.$friend["User"]['id'], array('checked' => 'true', 'user-data' => $friend["User"]['id'], 'onclick' => 'checkboxOnChange(this)')); ?>
                        <?php echo $friend["User"]["name"]?>
                        <span class="checkmark"></span>
                    </label>
                    <?php
                            $i++;
                            endforeach;
                        }
                        else
                            echo '<div class="">' . __( 'No more results found').'</div>';
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>