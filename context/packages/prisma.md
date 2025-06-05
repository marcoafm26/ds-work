# Prisma ORM - Documentação Completa

## O que é o Prisma?

O Prisma é um ORM (Object-Relational Mapping) moderno para Node.js e TypeScript que oferece:

-   **Segurança de Tipos**: Tipos TypeScript gerados automaticamente
-   **API Intuitiva**: Interface simples para consultas
-   **Gerenciamento de Schema**: Controle de versão do banco de dados
-   **Performance**: Otimização de consultas e pool de conexões
-   **Experiência do Desenvolvedor**: Excelentes ferramentas e documentação

## Recursos Principais

### 1. **Cliente com Type Safety**

-   Tipos TypeScript gerados automaticamente
-   Verificação de erros em tempo de compilação
-   Suporte a IntelliSense nas IDEs

### 2. **Gerenciamento de Schema**

-   Definição declarativa de schema
-   Migrações automatizadas
-   Introspecção de banco de dados
-   Suporte a múltiplos bancos

### 3. **Construtor de Queries**

-   API fluente para consultas complexas
-   Manipulação de relacionamentos
-   Suporte a transações
-   SQL puro quando necessário

## Integração com o Projeto

### 1. **DTOs (Data Transfer Objects)**

-   Conversão entre modelos Prisma e DTOs
-   Validação de dados com type safety
-   Separação clara entre banco e API

### 2. **Autenticação por Token**

-   Busca de usuários para validação
-   Middleware de verificação de token
-   Controle de acesso baseado no usuário

### 3. **Arquitetura em Camadas**

-   **Repository**: Operações de banco com Prisma
-   **Service**: Regras de negócio com Prisma + DTOs
-   **Controller**: Tratamento de requisições com DTOs validados

### 4. **Recursos de Segurança**

-   Queries parametrizadas por padrão
-   Validação de propriedade de recursos
-   Suporte a transações para operações críticas

### 5. **Escalabilidade**

-   Migrações de schema
-   Pool de conexões
-   Suporte multi-banco
-   Refatoração type-safe

## Comandos úteis

### Comandos básicos

```bash
# Gerar cliente após mudanças no schema
pnpm prisma generate

# Aplicar mudanças no banco (desenvolvimento)
pnpm prisma db push

# Criar migration
pnpm prisma migrate dev --name nome-da-migration

# Aplicar migrations em produção
pnpm prisma migrate deploy

# Visualizar dados no navegador
pnpm prisma studio

# Reset completo do banco (CUIDADO: apaga todos os dados)
pnpm prisma migrate reset

# Verificar status das migrations
pnpm prisma migrate status

# Criar migration sem aplicar
pnpm prisma migrate dev --create-only

# Introspecção do banco existente
pnpm prisma db pull
```

## Gerenciamento de Migrações

### 1. Criando uma Nova Migration

```bash
# Exemplo: Adicionando campo endereço
pnpm prisma migrate dev --name add-endereco-to-cliente
```

### 2. Estrutura de uma Migration

As migrations são armazenadas em `prisma/migrations/` e contêm:

-   **Arquivo SQL**: Comandos para alterar o banco
-   **Snapshot**: Estado do schema naquele momento

### 3. Exemplo de Migration Manual

```sql
-- Adicionando nova coluna
ALTER TABLE `tbCliente` ADD COLUMN `endereco` VARCHAR(200);

-- Renomeando coluna
ALTER TABLE `tbCliente` CHANGE `nome` `nomeCompleto` VARCHAR(100) NOT NULL;

-- Adicionando índice único
ALTER TABLE `tbCliente` ADD UNIQUE INDEX `tbCliente_email_key` (`email`);
```

## Trabalhando com Chaves Únicas

### 1. Definindo no Schema

```prisma
model TbCliente {
  id       Int    @id @default(autoincrement())
  nome     String @db.VarChar(100)
  cpf      String @unique @db.VarChar(11)  // Chave única simples
  email    String @unique @db.VarChar(100) // Chave única simples
  telefone String @db.VarChar(15)

  // Chave única composta
  @@unique([email, cpf], name: "unique_email_cpf")
  @@map("tbCliente")
}
```

### 2. Adicionando Chave Única Existente

```prisma
// Antes
model TbCliente {
  email String @db.VarChar(100)
}

// Depois
model TbCliente {
  email String @unique @db.VarChar(100)
}
```

### 3. Migration para Chave Única

```bash
pnpm prisma migrate dev --name add-unique-email
```

SQL gerado:

```sql
ALTER TABLE `tbCliente` ADD UNIQUE INDEX `tbCliente_email_key` (`email`);
```

## Exemplos Práticos

### 1. Adicionando Campo com Valor Padrão

```prisma
model TbCliente {
  id        Int      @id @default(autoincrement())
  nome      String   @db.VarChar(100)
  cpf       String   @unique @db.VarChar(11)
  email     String   @unique @db.VarChar(100)
  telefone  String   @db.VarChar(15)
  ativo     Boolean  @default(true)        // Novo campo com padrão
  criadoEm  DateTime @default(now())       // Data de criação

  contas TbConta[]
  @@map("tbCliente")
}
```

### 2. Relacionamentos com Chaves Estrangeiras

```prisma
model TbConta {
  id        Int    @id @default(autoincrement())
  numero    String @unique @db.VarChar(20)
  saldo     Float  @default(0)
  idCliente Int

  // Relacionamento com cliente
  cliente TbCliente @relation(fields: [idCliente], references: [id], onDelete: Cascade)

  // Índice para performance
  @@index([idCliente])
  @@map("tbConta")
}
```

### 3. Enum para Tipos

```prisma
enum TipoLancamento {
  CREDITO
  DEBITO
}

model TbLancamento {
  id        Int             @id @default(autoincrement())
  valor     Float
  tipo      TipoLancamento
  descricao String?         @db.VarChar(255)
  data      DateTime        @default(now())
  idConta   Int

  conta TbConta @relation(fields: [idConta], references: [id])

  @@map("tbLancamento")
}
```

### 4. Consultas com Relacionamentos

```javascript
// Buscar cliente com suas contas
const clienteComContas = await prisma.tbCliente.findUnique({
    where: { id: 1 },
    include: {
        contas: {
            include: {
                lancamentos: {
                    orderBy: { data: 'desc' },
                    take: 10
                }
            }
        }
    }
});

// Buscar contas com saldo positivo
const contasComSaldo = await prisma.tbConta.findMany({
    where: {
        saldo: { gt: 0 }
    },
    include: {
        cliente: {
            select: { nome: true, email: true }
        }
    }
});
```

### 5. Transações

```javascript
// Transferência entre contas
const transferencia = await prisma.$transaction(async (tx) => {
    // Debitar conta origem
    await tx.tbConta.update({
        where: { id: contaOrigemId },
        data: { saldo: { decrement: valor } }
    });

    // Creditar conta destino
    await tx.tbConta.update({
        where: { id: contaDestinoId },
        data: { saldo: { increment: valor } }
    });

    // Registrar lançamentos
    await tx.tbLancamento.createMany({
        data: [
            {
                valor: -valor,
                tipo: 'DEBITO',
                descricao: 'Transferência enviada',
                idConta: contaOrigemId
            },
            {
                valor: valor,
                tipo: 'CREDITO',
                descricao: 'Transferência recebida',
                idConta: contaDestinoId
            }
        ]
    });
});
```

## Boas Práticas

### 1. Nomenclatura

-   Use nomes descritivos para migrations
-   Mantenha consistência nos nomes dos campos
-   Use `@@map()` para mapear nomes diferentes

### 2. Performance

-   Adicione índices em campos de busca frequente
-   Use `select` para buscar apenas campos necessários
-   Implemente paginação em listas grandes

### 3. Segurança

-   Sempre valide dados antes de inserir
-   Use transações para operações críticas
-   Implemente soft delete quando necessário

### 4. Desenvolvimento

-   Teste migrations em ambiente de desenvolvimento
-   Faça backup antes de aplicar em produção
-   Use `--create-only` para revisar SQL antes de aplicar

## Troubleshooting

### Problemas Comuns

1. **Migration falha por dados existentes**

    ```bash
    # Limpar e recriar (desenvolvimento)
    pnpm prisma migrate reset
    ```

2. **Schema fora de sincronia**

    ```bash
    # Sincronizar schema com banco
    pnpm prisma db pull
    pnpm prisma generate
    ```

3. **Conflitos de migration**
    ```bash
    # Verificar status
    pnpm prisma migrate status
    # Resolver manualmente ou reset
    ```
