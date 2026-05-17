-- Align the deployed database with the current Prisma schema.
ALTER TABLE `User`
  ADD COLUMN `username` VARCHAR(50) NULL,
  ADD COLUMN `must_change_password` BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

ALTER TABLE `Patient`
  ADD COLUMN `registry_number` VARCHAR(10) NULL;

ALTER TABLE `Doctor`
  ADD COLUMN `room_number` VARCHAR(20) NULL,
  ADD COLUMN `position_title` VARCHAR(100) NULL,
  ADD COLUMN `profile_image_url` VARCHAR(255) NULL,
  ADD COLUMN `experience_years` INTEGER NULL;
