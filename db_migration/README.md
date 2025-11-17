# Database Migration with Go-Migrate

this guide help you migrate database schema with [Go-Migrate]



## Installation

```bash
# MacOS
brew install golang-migrate
migrate --version        
```
other OS please reference the document on [GitHub](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate#installation)

## Usage

我們使用 Node.js 腳本來管理 Flyway 遷移。以下 npm 腳本可用：

- `npm run migrate`: 運行所有待處理的遷移
- `npm run clean`: 刪除配置的 schema 中的所有對象
- `npm run info`: 打印所有遷移的詳細信息和狀態
- `npm run validate`: 驗證已應用的遷移與可用的遷移
- `npm run baseline`: 為現有數據庫設置基線
- `npm run repair`: 修復 schema 歷史表
```bash
# Create new migration files
migrate create -ext sql -dir ./db_migration/scripts -seq monthly_consumption_totals

# Check current migrate version
export MIGRATING_PG_CONFIG="postgresql://local:administrator@localhost:5433/qride?sslmode=disable"
migrate -path ./db_migration/scripts -database "$MIGRATING_PG_CONFIG" version

# Migrate to next version
migrate -path ./db_migration/scripts -database "$MIGRATING_PG_CONFIG" up

# Downgrade 1 version
migrate -path ./db_migration/scripts -database "$MIGRATING_PG_CONFIG" down 1
# Drop all migration
migrate -path ./db_migration/scripts -database "$MIGRATING_PG_CONFIG" down

```


## Directory

- `scripts/`: includes the `.up` and `.down` sql files to migrate and downgrade the database

## 最佳實踐

1. 始終對遷移腳本進行版本控制。
2. 為遷移文件使用描述性名稱。
3. 保持遷移小而集中，每次只關注一個變更。
4. 在應用到生產環境之前徹底測試遷移。
5. 避免修改現有的遷移文件；為變更創建新的遷移。

## 故障排除

如果遇到問題：

1. 檢查 `.env` 文件中的數據庫連接設置。
2. 確保您有運行遷移的必要權限。
3. 查看 Flyway 輸出以獲取具體的錯誤信息。
4. OWNER TO `local`: 請換成個環境的 admin username 再進行 migration

有關更多信息，請參閱 [Flyway 文檔](https://flywaydb.org/documentation/)。

## 環境變量

確保在 `.env` 文件中設置以下變量：

- `DATABASE_URL`: 數據庫連接字符串，例如 `jdbc:postgresql://localhost:5432/your_database`
- `DATABASE_SCHEMA`: 數據庫 schema 名稱，通常是 `public`

