﻿-- Sagun 5/11/2023

sp_rename '[STCRM_DB].[dbo].[Leaves].Date', 'StartDate', 'COLUMN';
sp_rename '[STCRM_DB].[dbo].[Leaves].End_Date', 'EndDate', 'COLUMN';

-- Sagun 5/12/2023

ALTER TABLE [STCRM_DB].[dbo].[Connects] DROP CONSTRAINT DF__Connects__Reason__403A8C7D;
ALTER TABLE [STCRM_DB].[dbo].[Connects] DROP COLUMN Reason;

ALTER TABLE [STCRM_DB].[dbo].[Projects] ADD Reason NVARCHAR(259) NULL

-- Sagun 5/17/2023

ALTER TABLE [STCRM_DB].[dbo].[Projects] DROP COLUMN Reason;

sp_rename '[STCRM_DB].[dbo].[Clients].MarketPlaceAccountsId', 'MarketPlaceAccountId', 'COLUMN';
sp_rename '[STCRM_DB].[dbo].[Connects].MarketPlaceAccountsId', 'MarketPlaceAccountId', 'COLUMN';

-- Sagun 5/23/2023

CREATE TRIGGER dbo.LeaveTableTrigger ON [STCRM_DB].[dbo].[Leaves]
FOR INSERT, UPDATE, DELETE
AS
DECLARE @Operation VARCHAR(15)
 
IF EXISTS (SELECT 0 FROM inserted)
BEGIN
   IF EXISTS (SELECT 0 FROM deleted)
   BEGIN 
      SELECT @Operation = 'UPDATE'
   END ELSE
   BEGIN
      SELECT @Operation = 'INSERT'
   END
END ELSE 
BEGIN
   SELECT @Operation = 'DELETE'
END

-- Ankit 8/11/2023

ALTER TABLE [STCRM_DB].[dbo].[Connects] DROP COLUMN Week;

ADD DealsWon INT NULL,
    MarketingQualifiedLeads INT NULL,
    SalesQualifiedLeads INT NULL,
    Technology NVARCHAR(100) NULL



-- Ankit 8/25/2023
USE [STCRM_DB]
DROP TABLE AssetCategories;



-- Ankit 8/25/2023
USE [STCRM_DB]
GO

/****** Object:  Table [dbo].[AssetCategories]    Script Date: 8/25/2023 10:51:52 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[AssetCategories](
	[CategoryId] [uniqueidentifier] NOT NULL,
	[CategoryName] [nvarchar](50) NULL,
	[IsActive] [bit] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[LastModified] [datetime] NULL,
	[LastModifiedBy] [uniqueidentifier] NULL,
 CONSTRAINT [PK_AssetCategories] PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO



-- Ankit 9/11/2023

USE [STCRM_DB]
GO

/****** Object:  Table [dbo].[Assets]    Script Date: 9/11/2023 4:46:41 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Assets](
	[AssetId] [uniqueidentifier] NOT NULL,
	[CategoryId] [uniqueidentifier] NULL,
	[ManufacturerName] [int] NULL,
	[PurchasedDate] [datetime] NULL,
	[SerialNumber] [nvarchar](max) NULL,
	[ModelNumber] [nvarchar](max) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[LastModified] [datetime] NULL,
	[LastModifiedBy] [uniqueidentifier] NULL,
	[AssetStatus] [int] NULL,
	[IdentificationNumber] [nvarchar](max) NULL,
	[Remarks] [nvarchar](max) NULL,
	[AssetName] [nvarchar](50) NULL,
 CONSTRAINT [PK_Assets] PRIMARY KEY CLUSTERED 
(
	[AssetId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Assets]  WITH CHECK ADD  CONSTRAINT [FK_Assets_AssetCategories] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[AssetCategories] ([CategoryId])
GO

ALTER TABLE [dbo].[Assets] CHECK CONSTRAINT [FK_Assets_AssetCategories]
GO


/****** Object:  Table [dbo].[HandoverAsset]    Script Date: 9/11/2023 4:47:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[HandoverAsset](
	[HandoverId] [uniqueidentifier] NOT NULL,
	[AssetId] [uniqueidentifier] NULL,
	[EmployeeId] [uniqueidentifier] NULL,
	[HandoverStatus] [int] NULL,
	[AssignedDate] [datetime] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [uniqueidentifier] NULL,
	[LastModified] [datetime] NULL,
	[LastModifiedBy] [uniqueidentifier] NULL,
 CONSTRAINT [PK_HandoverAsset] PRIMARY KEY CLUSTERED 
(
	[HandoverId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[HandoverAsset]  WITH CHECK ADD  CONSTRAINT [FK_HandoverAsset_Assets] FOREIGN KEY([AssetId])
REFERENCES [dbo].[Assets] ([AssetId])
GO

ALTER TABLE [dbo].[HandoverAsset] CHECK CONSTRAINT [FK_HandoverAsset_Assets]
GO

ALTER TABLE [dbo].[HandoverAsset]  WITH CHECK ADD  CONSTRAINT [FK_HandoverAsset_Employees] FOREIGN KEY([EmployeeId])
REFERENCES [dbo].[Employees] ([EmployeeId])
GO

ALTER TABLE [dbo].[HandoverAsset] CHECK CONSTRAINT [FK_HandoverAsset_Employees]
GO


