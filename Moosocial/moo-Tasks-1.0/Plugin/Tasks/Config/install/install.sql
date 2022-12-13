CREATE TABLE IF NOT EXISTS `{PREFIX}kanban_boards` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `owner` VARCHAR(50) NOT NULL,
    `color` VARCHAR(50),
    `last_modified` DATETIME DEFAULT 0,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `{PREFIX}kanban_stacks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `board_id` INT UNSIGNED NOT NULL,
  `order` INT UNSIGNED NOT NULL,
  `last_modified` DATETIME DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `{PREFIX}kanban_cards` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `stack_id` VARCHAR(50) NOT NULL,
  `priority` VARCHAR(50) NOT NULL,
  `owner` VARCHAR(50) NOT NULL,
  `assigned_user` VARCHAR(50) NOT NULL,
  `last_modified` DATETIME DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `{PREFIX}kanban_assigned_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `card_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
);

