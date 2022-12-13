<?php

/*
 */
App::uses('TasksAppModel','Tasks.Model');
class KanbanBoard extends TasksAppModel {
    public function createDefaultBoard() {

    }

    /**
     * 
     */
    public function getDefaultBoard($uid) {
        $cond = array( 'KanbanBoard.title' => 'Personal', 'KanbanBoard.owner' => $uid);
        $defaultBoard = $this->find('first', array('conditions' => $cond)); 
        return $defaultBoard;
    }

    /*
	 * Return a list of boards for dropdown list
	 * @param int $uid
	 * @param array $excludes an array of user ids to exclude
	 */
	public function getBoardsList( $uid, $excludes = array() )
	{
		$cond = array( 'KanbanBoard.owner' => $uid);
		
		if ( !empty( $excludes ) )
			$cond['NOT'] = array( 'KanbanBoard.owner' => $excludes );
		
		$boards = $this->find( 'all', array( 'conditions' => $cond )); // have to do this because find(list) does not work with bindModel
		$board_options = array();

		foreach ($boards as $board)
			$board_options[$board['KanbanBoard']['id']] = $board['KanbanBoard']['title'];

		return $board_options;
	}
}