CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('consulta','busqueda','cotizacion','permuta') NOT NULL,
	`name` varchar(120) NOT NULL,
	`whatsapp` varchar(40) NOT NULL,
	`vehicleId` int,
	`message` text,
	`status` enum('nuevo','contactado','negociacion','cerrado','descartado') NOT NULL DEFAULT 'nuevo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(120) NOT NULL,
	`location` varchar(180) NOT NULL,
	`whatsapp` varchar(40),
	`instagram` varchar(180),
	`openingHours` varchar(180),
	`address` varchar(240),
	`email` varchar(320),
	`heroTitle` varchar(180),
	`heroSubtitle` text,
	`defaultWhatsappMessage` text,
	`financingInfo` text,
	`permutaEnabled` int NOT NULL DEFAULT 1,
	`sellVehicleEnabled` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`altText` varchar(220),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isCover` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicle_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_valuations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`whatsapp` varchar(40) NOT NULL,
	`vehicleType` enum('moto','auto','utilitario') NOT NULL,
	`brand` varchar(80) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` int,
	`mileage` int,
	`engineCc` int,
	`conditionSummary` text,
	`hasDocumentation` int NOT NULL DEFAULT 0,
	`acceptsTrade` int NOT NULL DEFAULT 0,
	`expectedPrice` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicle_valuations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`type` enum('moto','auto','utilitario') NOT NULL,
	`brand` varchar(80) NOT NULL,
	`model` varchar(100) NOT NULL,
	`version` varchar(120),
	`year` int NOT NULL,
	`mileage` int,
	`engineCc` int,
	`fuel` varchar(60),
	`transmission` varchar(60),
	`price` int,
	`priceNote` varchar(220),
	`status` enum('disponible','reservado','vendido','permutado') NOT NULL DEFAULT 'disponible',
	`acceptsTrade` int NOT NULL DEFAULT 0,
	`description` text,
	`conditionSummary` text,
	`documentation` text,
	`featured` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_vehicleId_vehicles_id_fk` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicle_images` ADD CONSTRAINT `vehicle_images_vehicleId_vehicles_id_fk` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE cascade ON UPDATE no action;