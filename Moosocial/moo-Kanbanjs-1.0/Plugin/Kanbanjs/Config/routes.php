<?php
Router::connect('/kanbanjss/:action/*', array(
    'plugin' => 'Kanbanjs',
    'controller' => 'kanbanjss'
));

Router::connect('/kanbanjss/*', array(
    'plugin' => 'Kanbanjs',
    'controller' => 'kanbanjss',
    'action' => 'index'
));
