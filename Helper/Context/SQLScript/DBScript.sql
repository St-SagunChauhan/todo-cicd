USE [STCRM_DB]
GO

INSERT [dbo].[AccountTypes] ([AccountTypesName]) VALUES (N'Agency')
GO
INSERT [dbo].[AccountTypes] ([AccountTypesName]) VALUES (N'Freelancer')
GO
INSERT [dbo].[AccountTypes] ([AccountTypesName]) VALUES (N'OutOfUpwork')
GO
INSERT [dbo].[AccountTypes] ([AccountTypesName]) VALUES (N'AgencyAndFreelancer')
GO

INSERT [dbo].[BillingTypes] ([BillingTypesName]) VALUES (N'UpworkBillingOnSystem')
GO
INSERT [dbo].[BillingTypes] ([BillingTypesName]) VALUES (N'UpworkManualHours')
GO
INSERT [dbo].[BillingTypes] ([BillingTypesName]) VALUES (N'OutOfUpwork')
GO
INSERT [dbo].[BillingTypes] ([BillingTypesName]) VALUES (N'Milestone')
GO
INSERT [dbo].[BillingTypes] ([BillingTypesName]) VALUES (N'Clockify')
GO

INSERT [dbo].[ConnectStatus] ([ConnectStatusName]) VALUES (N'Applied')
GO
INSERT [dbo].[ConnectStatus] ([ConnectStatusName]) VALUES (N'Lead')
GO
INSERT [dbo].[ConnectStatus] ([ConnectStatusName]) VALUES (N'Hired')
GO

INSERT [dbo].[ContractStatus] ([ContractStatusName]) VALUES (N'FullTime')
GO
INSERT [dbo].[ContractStatus] ([ContractStatusName]) VALUES (N'PartTime')
GO
INSERT [dbo].[ContractStatus] ([ContractStatusName]) VALUES (N'ActiveButNoWork')
GO
INSERT [dbo].[ContractStatus] ([ContractStatusName]) VALUES (N'Completed')
GO
INSERT [dbo].[ContractStatus] ([ContractStatusName]) VALUES (N'Closed')
GO

INSERT [dbo].[ContractType] ([ContractTypesName]) VALUES (N'Hourly')
GO
INSERT [dbo].[ContractType] ([ContractTypesName]) VALUES (N'Fixed')
GO

INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Python technology', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Javascript Framework Technology Department', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Creative and Digital Marketing Department', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Dot Net Framework Technology Department', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Business Development', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Management', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'PHP Technology Department', 1)
GO
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentName], [IsActive]) VALUES (NEWID(), N'Quality Analysis Department', 1)
GO

INSERT [dbo].[Gender] ([GenderType]) VALUES (N'Male')
GO
INSERT [dbo].[Gender] ([GenderType]) VALUES (N'Female')
GO

INSERT [dbo].[LeaveTypes] ([LeaveTypeName]) VALUES (N'SickLeave')
GO
INSERT [dbo].[LeaveTypes] ([LeaveTypeName]) VALUES (N'CasualLeave')
GO
INSERT [dbo].[LeaveTypes] ([LeaveTypeName]) VALUES (N'HalfDay')
GO
INSERT [dbo].[LeaveTypes] ([LeaveTypeName]) VALUES (N'ShortLeave')
GO

INSERT [dbo].[ProjectHealthRate] ([ProjectHealthRateName]) VALUES (N'Green')
GO
INSERT [dbo].[ProjectHealthRate] ([ProjectHealthRateName]) VALUES (N'Yellow')
GO
INSERT [dbo].[ProjectHealthRate] ([ProjectHealthRateName]) VALUES (N'Red')
GO

INSERT [dbo].[ProjectStatus] ([ProjectStatusName]) VALUES (N'Completed')
GO
INSERT [dbo].[ProjectStatus] ([ProjectStatusName]) VALUES (N'Active')
GO
INSERT [dbo].[ProjectStatus] ([ProjectStatusName]) VALUES (N'OnHold')
GO
INSERT [dbo].[ProjectStatus] ([ProjectStatusName]) VALUES (N'ActiveButNoWork')
GO

INSERT [dbo].[Roles] ([RoleName]) VALUES (N'Admin')
GO
INSERT [dbo].[Roles] ([RoleName]) VALUES (N'TeamLead')
GO
INSERT [dbo].[Roles] ([RoleName]) VALUES (N'HR')
GO
INSERT [dbo].[Roles] ([RoleName]) VALUES (N'Employee')
GO
INSERT [dbo].[Roles] ([RoleName]) VALUES (N'BD')
GO
INSERT [dbo].[Roles] ([RoleName]) VALUES (N'BDM')
GO
