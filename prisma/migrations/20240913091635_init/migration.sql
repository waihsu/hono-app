/*
  Warnings:

  - The values [ONGOING] on the enum `Match_Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `match_id` on the `BettingMarkets` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `Teams` table. All the data in the column will be lost.
  - You are about to drop the column `league_id` on the `Teams` table. All the data in the column will be lost.
  - You are about to drop the column `kpay_tran_id` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `Transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Leagues` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[home_team_id,away_team_id,match_date]` on the table `Matches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_id` to the `Bets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish_match_id` to the `BettingMarkets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flag` to the `Countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Leagues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `Leagues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Leagues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Leagues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `league_code` to the `Matches` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `match_date` on the `Matches` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `team_id` to the `Odds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubColors` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `founded` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tla` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Transation_Type" AS ENUM ('DEPOSIT', 'WITHDRAW');

-- AlterEnum
BEGIN;
CREATE TYPE "Match_Status_new" AS ENUM ('SCHEDULED', 'LIVE', 'IN_PLAY', 'PAUSED', 'FINISHED', 'POSTPONED', 'SUSPENDED', 'CANCELLED', 'TIMED');
ALTER TABLE "Matches" ALTER COLUMN "match_status" DROP DEFAULT;
ALTER TABLE "Matches" ALTER COLUMN "match_status" TYPE "Match_Status_new" USING ("match_status"::text::"Match_Status_new");
ALTER TYPE "Match_Status" RENAME TO "Match_Status_old";
ALTER TYPE "Match_Status_new" RENAME TO "Match_Status";
DROP TYPE "Match_Status_old";
ALTER TABLE "Matches" ALTER COLUMN "match_status" SET DEFAULT 'SCHEDULED';
COMMIT;

-- AlterEnum
ALTER TYPE "Transation_Status" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "BettingMarkets" DROP CONSTRAINT "BettingMarkets_match_id_fkey";

-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_country_id_fkey";

-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_league_id_fkey";

-- DropIndex
DROP INDEX "BettingMarkets_match_id_idx";

-- DropIndex
DROP INDEX "Matches_home_team_id_away_team_id_key";

-- AlterTable
ALTER TABLE "Bets" ADD COLUMN     "admin_id" TEXT NOT NULL,
ALTER COLUMN "bet_status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "BettingMarkets" DROP COLUMN "match_id",
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publish_match_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Countries" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "flag" TEXT NOT NULL,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Leagues" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "country_id" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Matches" ADD COLUMN     "away_team_scroe" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "home_team_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "league_code" TEXT NOT NULL,
DROP COLUMN "match_date",
ADD COLUMN     "match_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Odds" ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teams" DROP COLUMN "country_id",
DROP COLUMN "league_id",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "clubColors" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "founded" INTEGER NOT NULL,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shortName" TEXT NOT NULL,
ADD COLUMN     "tla" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "venue" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "kpay_tran_id",
DROP COLUMN "payment_method",
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_id" TEXT NOT NULL,
ADD COLUMN     "transaction_type" "Transation_Type" NOT NULL,
ADD COLUMN     "transfer_id" TEXT,
ALTER COLUMN "phone_number" SET DATA TYPE TEXT,
ALTER COLUMN "transation_status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_role" "UserRole" NOT NULL DEFAULT 'USER',
ALTER COLUMN "account_status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "SocialMediaLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningLeague" (
    "id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadMember" (
    "id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SquadMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "section" TEXT,
    "position" TEXT,
    "shirt_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishMatch" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "payment_name" TEXT NOT NULL,
    "payment_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublishMatch_user_id_idx" ON "PublishMatch"("user_id");

-- CreateIndex
CREATE INDEX "Payment_admin_id_idx" ON "Payment"("admin_id");

-- CreateIndex
CREATE INDEX "BettingMarkets_publish_match_id_idx" ON "BettingMarkets"("publish_match_id");

-- CreateIndex
CREATE UNIQUE INDEX "Leagues_code_key" ON "Leagues"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Matches_home_team_id_away_team_id_match_date_key" ON "Matches"("home_team_id", "away_team_id", "match_date");

-- AddForeignKey
ALTER TABLE "SocialMediaLink" ADD CONSTRAINT "SocialMediaLink_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leagues" ADD CONSTRAINT "Leagues_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningLeague" ADD CONSTRAINT "RunningLeague_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "Leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadMember" ADD CONSTRAINT "SquadMember_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_league_code_fkey" FOREIGN KEY ("league_code") REFERENCES "Leagues"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishMatch" ADD CONSTRAINT "PublishMatch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishMatch" ADD CONSTRAINT "PublishMatch_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BettingMarkets" ADD CONSTRAINT "BettingMarkets_publish_match_id_fkey" FOREIGN KEY ("publish_match_id") REFERENCES "PublishMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Odds" ADD CONSTRAINT "Odds_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets" ADD CONSTRAINT "Bets_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
