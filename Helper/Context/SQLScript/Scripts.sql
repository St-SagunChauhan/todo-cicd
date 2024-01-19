--SAGUN CHAUHAN: 17/01/2024

ALTER TABLE [dbo].[JobRecords] ALTER COLUMN JobUrl NVARCHAR(100) NULL;

ALTER TABLE [dbo].[MarketPlaceAccounts] ALTER COLUMN Name NVARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[MarketPlaceAccounts] ALTER COLUMN Accounts int NOT NULL;
ALTER TABLE [dbo].[MarketPlaceAccounts] ALTER COLUMN MarketPlaceAccountsStatus int NOT NULL;

ALTER TABLE [dbo].[Projects] ALTER COLUMN ContractName NVARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN ClientId UNIQUEIDENTIFIER NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN HoursPerWeek NVARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN BillingType int NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN ContractType int NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN ProjectUrl NVARCHAR(MAX) NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN StartDate DATETIME NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN HiredId UNIQUEIDENTIFIER NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN Status INT NOT NULL;
ALTER TABLE [dbo].[Projects] ALTER COLUMN Accounts INT NOT NULL;

ALTER TABLE [dbo].[Clients] ALTER COLUMN ClientName NVARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[Clients] ALTER COLUMN Country NVARCHAR(MAX) NOT NULL;
ALTER TABLE [dbo].[Clients] ALTER COLUMN MarketPlaceAccountId UNIQUEIDENTIFIER NOT NULL;
ALTER TABLE [dbo].[Clients] ALTER COLUMN Accounts NVARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[Clients] ALTER COLUMN BidId UNIQUEIDENTIFIER NOT NULL;

--SHWETA: 17/01/2024

ALTER TABLE [dbo].[Clients] DROP CONSTRAINT [FK_Clients_MarketPlaceAccounts];
ALTER TABLE [dbo].[Projects] DROP CONSTRAINT [FK_Projects_MarketPlaceAccounts];
ALTER TABLE [dbo].[Projects] DROP CONSTRAINT [FK_Projects_MarketPlaceAccounts1];

ALTER TABLE [dbo].[JobRecords] DROP COLUMN[HiredProfile];
ALTER TABLE [dbo].[JobRecords] DROP COLUMN[CommunicationProfile];
ALTER TABLE [dbo].[JobRecords] ADD CommunicationMode nvarchar(500) NULL;
ALTER TABLE [dbo].[Clients] DROP COLUMN[CommunicationId];
ALTER TABLE [dbo].[Projects] DROP COLUMN [CommunicationId];
ALTER TABLE [dbo].[Projects] DROP COLUMN[HiredId];
ALTER TABLE [dbo].[Clients] DROP COLUMN [Communication];

--SAGUN CHAUHAN: 18/01/2024

EXEC sp_rename '[dbo].[Clients].Remarks', 'LastFollowUpRemark', 'COLUMN';
ALTER TABLE [dbo].[Clients] ADD LastFollowUpDate DATETIME;