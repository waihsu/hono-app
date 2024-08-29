-- CreateEnum
CREATE TYPE "AccountStatusType" AS ENUM ('SUSPENDED', 'ACTIVE', 'BAN');

-- CreateEnum
CREATE TYPE "Match_Status" AS ENUM ('SCHEDULED', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('OPEN', 'CLOSE');

-- CreateEnum
CREATE TYPE "Bet_Status" AS ENUM ('PENDING', 'WON', 'LOST', 'CANCLED');

-- CreateEnum
CREATE TYPE "Payment_Method" AS ENUM ('WAVEPAY', 'KPAY');

-- CreateEnum
CREATE TYPE "Transation_Status" AS ENUM ('COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "account_status" "AccountStatusType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leagues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "id" TEXT NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "match_date" TEXT NOT NULL,
    "match_status" "Match_Status" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BettingMarkets" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "market_type" TEXT NOT NULL,
    "market_status" "MarketStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BettingMarkets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Odds" (
    "id" TEXT NOT NULL,
    "betting_market_id" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "odd_value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Odds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "betting_market_id" TEXT NOT NULL,
    "odd_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "bet_status" "Bet_Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_method" "Payment_Method" NOT NULL,
    "amount" INTEGER NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "kpay_tran_id" TEXT NOT NULL,
    "transation_status" "Transation_Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "User"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Matches_home_team_id_away_team_id_key" ON "Matches"("home_team_id", "away_team_id");

-- CreateIndex
CREATE INDEX "BettingMarkets_match_id_idx" ON "BettingMarkets"("match_id");

-- CreateIndex
CREATE INDEX "Odds_betting_market_id_idx" ON "Odds"("betting_market_id");

-- CreateIndex
CREATE INDEX "Transactions_user_id_idx" ON "Transactions"("user_id");

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "Leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BettingMarkets" ADD CONSTRAINT "BettingMarkets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Odds" ADD CONSTRAINT "Odds_betting_market_id_fkey" FOREIGN KEY ("betting_market_id") REFERENCES "BettingMarkets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets" ADD CONSTRAINT "Bets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets" ADD CONSTRAINT "Bets_betting_market_id_fkey" FOREIGN KEY ("betting_market_id") REFERENCES "BettingMarkets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bets" ADD CONSTRAINT "Bets_odd_id_fkey" FOREIGN KEY ("odd_id") REFERENCES "Odds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
