<?php 
App::uses('MooPlugin','Lib');
class KanbanjsPlugin implements MooPlugin{
    public function install(){}
    public function uninstall(){}
    public function settingGuide(){}
    public function menu()
    {
        return array(
            'General' => array('plugin' => 'kanbanjs', 'controller' => 'kanbanjss', 'action' => 'admin_index'),
            'Settings' => array('plugin' => 'kanbanjs', 'controller' => 'kanbanjs_settings', 'action' => 'admin_index'),
        );
    }
    /*
    Example for version 1.0: This function will be executed when plugin is upgraded (Optional)
    public function callback_1_0(){}
    */
}