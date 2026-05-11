IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Produtos] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(max) NOT NULL,
    [Categoria] nvarchar(max) NOT NULL,
    [UnidadePeso] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [DataFabricacao] datetime2 NOT NULL,
    [Validade] datetime2 NOT NULL,
    CONSTRAINT [PK_Produtos] PRIMARY KEY ([Id])
);

CREATE TABLE [Propriedades] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(max) NOT NULL,
    [RazaoSocial] nvarchar(max) NOT NULL,
    [Cnpj] nvarchar(450) NOT NULL,
    [Uf] nvarchar(max) NOT NULL,
    [EhFranqueadora] bit NOT NULL,
    [TaxaRoyalties] decimal(5,2) NOT NULL,
    [DataAbertura] datetime2 NOT NULL,
    CONSTRAINT [PK_Propriedades] PRIMARY KEY ([Id])
);

CREATE TABLE [Estoques] (
    [Id] int NOT NULL IDENTITY,
    [PropriedadeId] int NOT NULL,
    [ProdutoId] int NOT NULL,
    [QuantidadeAtual] decimal(18,2) NOT NULL,
    [MinimoSugerido] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Estoques] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Estoques_Produtos_ProdutoId] FOREIGN KEY ([ProdutoId]) REFERENCES [Produtos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Estoques_Propriedades_PropriedadeId] FOREIGN KEY ([PropriedadeId]) REFERENCES [Propriedades] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Estoques_ProdutoId] ON [Estoques] ([ProdutoId]);

CREATE INDEX [IX_Estoques_PropriedadeId] ON [Estoques] ([PropriedadeId]);

CREATE UNIQUE INDEX [IX_Propriedades_Cnpj] ON [Propriedades] ([Cnpj]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260419224022_InitialCreate', N'10.0.6');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Estoques] ADD [DataFabricacao] datetime2 NULL;

ALTER TABLE [Estoques] ADD [Unidade] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Estoques] ADD [Validade] datetime2 NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260505185256_AdicionarCamposEstoque', N'10.0.6');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260510191132_FixCascadeFinal', N'10.0.6');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Propriedades] ADD [Senha] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Produtos] ADD [PropriedadeId] int NOT NULL DEFAULT 0;

CREATE INDEX [IX_Produtos_PropriedadeId] ON [Produtos] ([PropriedadeId]);

ALTER TABLE [Produtos] ADD CONSTRAINT [FK_Produtos_Propriedades_PropriedadeId] FOREIGN KEY ([PropriedadeId]) REFERENCES [Propriedades] ([Id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260511122923_AdicionarSenhaNaPropriedade', N'10.0.6');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260511142303_AdicionarSenhaFinal', N'10.0.6');

COMMIT;
GO

