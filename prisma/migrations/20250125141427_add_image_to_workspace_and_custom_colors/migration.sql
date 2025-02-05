-- CreateEnum
CREATE TYPE "CustomColors" AS ENUM ('PURPLE', 'RED', 'GREEN', 'BLUE', 'PINK', 'YELLOW', 'ORANGE', 'CYAN', 'LIME', 'EMERALD', 'INDIGO', 'FUCHSIA');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "color" "CustomColors" NOT NULL DEFAULT 'BLUE',
ADD COLUMN     "image" TEXT;
