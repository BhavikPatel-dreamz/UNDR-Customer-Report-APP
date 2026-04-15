-- AlterTable Registration: add new columns
ALTER TABLE "Registration" ADD COLUMN "shop"              TEXT NOT NULL DEFAULT '';
ALTER TABLE "Registration" ADD COLUMN "shopifyOrderId"    TEXT;
ALTER TABLE "Registration" ADD COLUMN "shopifyCustomerId" TEXT;

-- CreateTable Report
CREATE TABLE "Report" (
    "id"             TEXT         NOT NULL,
    "registrationId" TEXT         NOT NULL,
    "status"         TEXT         NOT NULL DEFAULT 'pending',
    "csvFileName"    TEXT,
    "reportData"     TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable ReportRow
CREATE TABLE "ReportRow" (
    "id"       TEXT             NOT NULL,
    "reportId" TEXT             NOT NULL,
    "element"  TEXT             NOT NULL,
    "rawValue" DOUBLE PRECISION NOT NULL,
    "ppmValue" DOUBLE PRECISION NOT NULL,
    "unit"     TEXT             NOT NULL DEFAULT 'ppm',
    "category" TEXT             NOT NULL DEFAULT '',
    CONSTRAINT "ReportRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (unique registrationId on Report)
CREATE UNIQUE INDEX "Report_registrationId_key" ON "Report"("registrationId");

-- AddForeignKey Report → Registration
ALTER TABLE "Report" ADD CONSTRAINT "Report_registrationId_fkey"
    FOREIGN KEY ("registrationId") REFERENCES "Registration"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey ReportRow → Report
ALTER TABLE "ReportRow" ADD CONSTRAINT "ReportRow_reportId_fkey"
    FOREIGN KEY ("reportId") REFERENCES "Report"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
