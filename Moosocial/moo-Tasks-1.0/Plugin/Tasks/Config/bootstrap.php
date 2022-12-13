<?php

App::uses('TasksListener', 'Tasks.Lib');
CakeEventManager::instance()->attach(new TasksListener());

define('PRIORITIES', array("Low" => 'Low', 'Normal' => 'Normal', 'High' => 'High', 'Critical' => 'Critical'));