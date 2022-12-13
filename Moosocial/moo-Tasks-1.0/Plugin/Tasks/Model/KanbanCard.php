<?php

/*
 */
App::uses('TasksAppModel','Tasks.Model');
class KanbanCard extends TasksAppModel {

    /*
	 * Return a list of cards for displaying
	 */
    public function getAllCards($uid) {
        $cond = array(
            'OR' => array(
                array(
                    'KanbanCard.owner' => $uid
                ),
                array(
                    "KanbanCard.assigned_user" => $uid
                )
            )
        );
        $cards = $this->find('all',array("conditions" => $cond));
        return $cards;
    }

    /*
	 * Delete a card
	 */
    public function deleteCard($card) {
        $this->delete($card['KanbanCard']['id']);
    }
}