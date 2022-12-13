<?php
/*
 */
App::uses('CakeEventListener', 'Event');

class TasksListener implements CakeEventListener{
    public function implementedEvents() {
        return array('Auth.afterIdentify' => 'createDefaultBoard');
    }

    public function createDefaultBoard($event) {
        $boardModel = Moocore::getInstance()->getModel('KanbanBoard');
        $personalBoard = $boardModel->find('count', array('conditions' => array('KanbanBoard.title' => 'Personal', 'KanbanBoard.owner' => AuthComponent::user('id'))));
        if($personalBoard == 0) {
            $tmp = new DateTime();
            //Personal kanban
            $boardModel->create();
            $boardModel->set(array(
                'title' => 'Personal',
                'owner' => AuthComponent::user('id'),
                'color' => '0087C5',
                'last_modified' => $tmp->getTimestamp()
            ));
            $boardModel->save();
            //Backlog
            $boardId = $boardModel->id;
            $stackModel = Moocore::getInstance()->getModel('KanbanStack');
            $stackModel->create();
            $stackModel->set(array(
                'title' => 'Backlog',
                'board_id' => $boardId,
                'order' => 1,
                'last_modified' => $tmp->getTimestamp()
            ));
            $stackModel->save();
            //To Do
            $stackModel->create();
            $stackModel->set(array(
                'title' => 'To Do',
                'board_id' => $boardId,
                'order' => 1,
                'last_modified' => $tmp->getTimestamp()
            ));
            $stackModel->save();
            //Doing
            $stackModel->create();
            $stackModel->set(array(
                'title' => 'Doing',
                'board_id' => $boardId,
                'order' => 1,
                'last_modified' => $tmp->getTimestamp()
            ));
            $stackModel->save();
            //Done
            $stackModel->create();
            $stackModel->set(array(
                'title' => 'Done',
                'board_id' => $boardId,
                'order' => 1,
                'last_modified' => $tmp->getTimestamp()
            ));
            $stackModel->save();
        }
    }
}