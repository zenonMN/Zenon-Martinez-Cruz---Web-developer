<?php
Router::connect('/taskss/:action/*', array(
    'plugin' => 'Tasks',
    'controller' => 'taskss'
));

Router::connect('/taskss/*', array(
    'plugin' => 'Tasks',
    'controller' => 'taskss',
    'action' => 'index'
));
