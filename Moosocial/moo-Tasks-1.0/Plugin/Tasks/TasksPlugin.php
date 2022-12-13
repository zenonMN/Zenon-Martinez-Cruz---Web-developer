<?php 
App::uses('MooPlugin','Lib');
class TasksPlugin implements MooPlugin{
    public function install(){}
    public function uninstall(){}
    public function settingGuide(){}
    public function menu()
    {
        return array(
            'General' => array('plugin' => 'tasks', 'controller' => 'taskss', 'action' => 'admin_index'),
            'Settings' => array('plugin' => 'tasks', 'controller' => 'tasks_settings', 'action' => 'admin_index'),
        );
    }
    /*
    Example for version 1.0: This function will be executed when plugin is upgraded (Optional)
    public function callback_1_0(){}
    */
}