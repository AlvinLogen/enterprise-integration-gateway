IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'eig')
    CREATE DATABASE eig;
GO 

USE eig
GO

SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID('dbo.assets', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.assets (
        id          UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_assets_id DEFAULT NEWID(),
        name        NVARCHAR(120) NOT NULL,
        kind        NVARCHAR(20) NOT NULL CONSTRAINT CK_assets_kind CHECK (kind IN ('device', 'record', 'location')),
        created_at  DATETIME2(3) NOT NULL CONSTRAINT DF_assets_created DEFAULT SYSUTCDATETIME(),
        updated_at  DATETIME2(3) NOT NULL CONSTRAINT DF_assets_updated DEFAULT SYSUTCDATETIME(),
        is_deleted  BIT NOT NULL CONSTRAINT DF_assets_deleted DEFAULT 0,
        CONSTRAINT  PK_assets PRIMARY KEY (id)
    );
    CREATE INDEX IX_assets_kind ON dbo.assets (kind) WHERE is_deleted = 0;
END
GO