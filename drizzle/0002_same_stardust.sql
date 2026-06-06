CREATE TABLE `notifications_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'submission',
	`status` varchar(50) NOT NULL DEFAULT 'sent',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_log_id` PRIMARY KEY(`id`)
);
