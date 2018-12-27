/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.7.16-log : Database - exam
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`exam` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `exam`;

/*Table structure for table `college` */

DROP TABLE IF EXISTS `college`;

CREATE TABLE `college` (
  `id` varchar(255) DEFAULT NULL,
  `enname` varchar(255) DEFAULT NULL,
  `cnname` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `college` */

/*Table structure for table `course` */

DROP TABLE IF EXISTS `course`;

CREATE TABLE `course` (
  `id` varchar(255) NOT NULL,
  `parent_id` varchar(200) DEFAULT NULL,
  `enname` varchar(255) DEFAULT NULL,
  `cnname` varchar(255) DEFAULT NULL,
  `article_num` int(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `course` */

/*Table structure for table `system_user` */

DROP TABLE IF EXISTS `system_user`;

CREATE TABLE `system_user` (
  `id` varchar(255) NOT NULL COMMENT '用户id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `rose` varchar(255) DEFAULT NULL COMMENT '权限',
  `imgsrc` varchar(255) DEFAULT NULL COMMENT '用户头像',
  `logintime` datetime DEFAULT NULL COMMENT '登录时间',
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `system_user` */

insert  into `system_user`(`id`,`username`,`password`,`rose`,`imgsrc`,`logintime`,`createtime`) values ('YzY5NzhlZGYtYzY5Ny00NDdjLWJmNTYtNGRlZjZiYjZkOTVi','host','1q2w3e4r','1000','/assets/img/user.png','2018-09-26 21:29:28','2018-09-25 12:34:00');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
