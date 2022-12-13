<?php 
class TaskssController extends TasksAppController{
    
    public function beforeFilter() {
        parent::beforeFilter();
        $this->loadModel("Tasks.KanbanBoard");
        $this->loadModel("Tasks.KanbanAssignedUser");
        $this->loadModel("Tasks.KanbanCard");
        $this->loadModel("Tasks.KanbanStack");
        $this->loadModel('Friend');
    }

    public function admin_index()
    {
    }
    public function index()
    {
        $uid = $this->Auth->user('id');
        if(!$uid){
            $this->set('board', null);
            return;
        }
    
        //load Personal Kanban
        $personalBoard = $this->KanbanBoard->getDefaultBoard($uid);
        $this->set('board', $personalBoard);
        $friends = $this->getFriendsFilter1();
        $this->set('friends', $friends);
    }

    public function create() {
        $uid = $this->Auth->user('id');
        $warning_msg = '';
        $friends = $this->Friend->getFriendsList($uid);
        $friends[$uid] = $this->Auth->user('name');
        $this->set('priorities', PRIORITIES);
        $this->set('warning_msg', $warning_msg);
        $this->set('friends', $friends);
        $this->set('userId', $uid);
        $this->set('boards', $this->KanbanBoard->getBoardsList($uid));

        //load Personal Kanban
        $personalBoard = $this->KanbanBoard->getDefaultBoard($uid);
        $this->set('boardId', $personalBoard['KanbanBoard']['id']);
        //options
        $options = array('0'=>__('Job'),'1'=>__('Project'), '2' => __('Process'));
        $this->set('options', $options);
    }

    public function add_task() {
        $uid = $this->Auth->user('id');
        $warning_msg = '';
        $friends = $this->Friend->getFriendsList($uid);
        $friends[$uid] = $this->Auth->user('name');
        $this->set('priorities', PRIORITIES);
        $this->set('warning_msg', $warning_msg);
        $this->set('friends', $friends);
        $this->set('userId', $uid);
        $this->set('boards', $this->KanbanBoard->getBoardsList($uid));

        //load Personal Kanban
        $personalBoard = $this->KanbanBoard->getDefaultBoard($uid);
        $this->set('boardId', $personalBoard['KanbanBoard']['id']);
        //options
        $options = array('0'=>__('Job'),'1'=>__('Project'), '2' => __('Process'));
        $this->set('options', $options);

    }

    public function create_task() {
        $uid = $this->Auth->user('id');
        $warning_msg = '';
        $friends = $this->Friend->getFriendsList($uid);
        $friends[$uid] = $this->Auth->user('name');
        $this->set('priorities', PRIORITIES);
        $this->set('warning_msg', $warning_msg);
        $this->set('friends', $friends);
        $this->set('userId', $uid);
        $this->set('boards', $this->KanbanBoard->getBoardsList($uid));

        //load Personal Kanban
        $personalBoard = $this->KanbanBoard->getDefaultBoard($uid);
        $this->set('boardId', $personalBoard['KanbanBoard']['id']);
        //options
        $options = array('0'=>__('Job'),'1'=>__('Project'), '2' => __('Process'));
        $this->set('options', $options);
    }

    public function ajax_sendRequest($isEcho=true) {
        $this->autoRender = false;

        $uid = $this->Auth->user('id');
        $tmp = new DateTime();
        $cuser = $this->_getUser();
        $requestdata = $this->request->data;
        // if ($uid == $requestdata['task_assignee']) {
        //     echo __('You cannot send friend request to yourself');
        // } else {
        //     echo __('Task assigned successfull...');
        // }

        $newCard = array("title" => $requestdata['task_title'], 
        "description" => $requestdata['summary'], 
        "owner" => $uid,
        "assigned_user" => $requestdata['task_assignee'],
        "last_modified" => $tmp->getTimestamp(),
        "priority" => $requestdata['task_priority'],
        "stack_id" => "Open"
        );

        $this->save($newCard);
    }

    /**
     * Save add/edit card
     */
    public function save($card) {
        $uid = $this->Auth->user('id');
        $this->KanbanCard->create();
        $this->KanbanCard->set($card);
        $this->KanbanCard->save();

        //send a notification to the friend
        $this->loadModel('Notification');
        $this->Notification->record(array('recipients' => $card["assigned_user"],
                'sender_id' => $uid,
                'action' => 'task_assign',
                'url' => '/taskss',
                'plugin' => 'tasks'
            ));
    }

    public function ajax_get_cards() {
        $this->autoRender = false;
        $cond['OR'] = array();
        //load cards
        $cards = $this->KanbanCard->getAllCards($this->Auth->user('id'));
        foreach($cards as &$card) {
            $a = array("Friend.user_id" => $card["KanbanCard"]["assigned_user"]);
            if(!in_array($cond['OR'], $a))
                $cond['OR'][] = array("Friend.user_id" => $card["KanbanCard"]["assigned_user"]);
        }
        $friends = $this->Friend->find("all", array("conditions" => $cond));
        usort($friends, function($obj_a, $obj_b){
            $obj_a["Friend"]["id"] = "delete";
            if($obj_a["Friend"]["user_id"] == $obj_b["Friend"]["user_id"]) {
                $obj_a["Friend"]["id"] = "delete";
            }
            return 1;
        });
        $data = array("cards" => $cards, "friends" => $friends, "userId" => $this->Auth->user('id'));
        return json_encode($data);
    }

    public function ajax_remove_card() {
        $this->autoRender = false;
        $card = $this->KanbanCard->findById($this->request->data["id"]);
        $this->_checkExistence($card);
        $this->KanbanCard->deleteCard($card);
        return "Card deleted...";
    }

    public function ajax_update_card() {
        $this->autoRender = false;
        $requestdata = $this->request->data;
        $tmp = new DateTime();
        $this->KanbanCard->id = $requestdata['id'];
        $card = array("title" => $requestdata['title'], 
            "description" => $requestdata['description'], 
            "owner" => $requestdata['owner'],
            "assigned_user" => $requestdata['assigned_user'],
            "last_modified" => $tmp->getTimestamp(),
            "priority" => $requestdata['priority'],
            "stack_id" => $requestdata['stack_id']
        );
        $this->KanbanCard->set($card);
        if($this->KanbanCard->save()) {
            return "Task updated...";
        } 
        return "Task update failed...";
    }

    public function getFriendsFilter1() {
        $cond['OR'] = array();
        //load cards
        $cards = $this->KanbanCard->getAllCards($this->Auth->user('id'));
        foreach($cards as &$card) {
            $a = array("Friend.user_id" => $card["KanbanCard"]["assigned_user"]);
            if($card["KanbanCard"]["assigned_user"] != $this->Auth->user('id') && !in_array($cond['OR'], $a))
            $cond['OR'][] = $a;
        }
        
        $friends = $this->Friend->find("all", array("conditions" => $cond));
        $i = 0;
        foreach($friends as &$friend) {
            $count = 0;
            foreach($friends as &$f) {
                if($friend["Friend"]["user_id"] == $f["Friend"]["user_id"])
                    $count++;
            }
            if($count > 1){
                unset($friends[$i]);
            }
            $i++;
        }
        $friends[] = ["User" => $this->Auth->user()];
        return $friends;
    }
}