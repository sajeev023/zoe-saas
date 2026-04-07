CREATE TABLE `adCreatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`headline` varchar(255) NOT NULL,
	`primaryText` text,
	`cta` varchar(100),
	`hook` text,
	`targetAudience` text,
	`format` varchar(50),
	`performance` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adCreatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100),
	`city` varchar(100),
	`website` varchar(255),
	`whatsappNumber` varchar(20),
	`mainOffer` text,
	`targetCustomer` text,
	`brandTone` varchar(100),
	`logo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('active','testing','paused','completed') NOT NULL DEFAULT 'testing',
	`goal` varchar(100),
	`platform` varchar(50) DEFAULT 'meta',
	`budget` decimal(10,2) DEFAULT '0',
	`spend` decimal(10,2) DEFAULT '0',
	`leads` int DEFAULT 0,
	`cpl` decimal(10,2) DEFAULT '0',
	`roas` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentCalendar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`type` varchar(50),
	`caption` text,
	`imagePrompt` text,
	`imageUrl` text,
	`scheduledAt` timestamp,
	`status` enum('draft','scheduled','published') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentCalendar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `growthProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`idealCustomer` text,
	`winningHooks` json,
	`bestCreativeFormat` varchar(100),
	`recommendedTargeting` json,
	`competitorWeakness` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `growthProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weeklyReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`week` varchar(20) NOT NULL,
	`leads` int DEFAULT 0,
	`spend` decimal(10,2) DEFAULT '0',
	`roas` decimal(5,2) DEFAULT '0',
	`bestAd` varchar(255),
	`cpl` decimal(10,2) DEFAULT '0',
	`actions` int DEFAULT 0,
	`report` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weeklyReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `zoeActions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` text,
	`description` text,
	`icon` varchar(50),
	`isPulse` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zoeActions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_openId_unique`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `supabaseId` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `plan` enum('free','growth','scale') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_supabaseId_unique` UNIQUE(`supabaseId`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `openId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;