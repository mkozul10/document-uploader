GRANT ALL PRIVILEGES ON *.* TO `user`@`%`;
FLUSH PRIVILEGES;

DROP DATABASE if exists `database`;
CREATE DATABASE `database`;
USE `database`;