param(
    [string]$Name
)

if (-not $Name) {
    Write-Host "Please provide a migration name"
    exit 1
}

# Validate migration name (no spaces, starts with a capital letter)
if ($Name -notmatch '^[A-Z][a-zA-Z0-9]*$') {
    Write-Host "Migration name must start with a capital letter and contain only letters and numbers"
    exit 1
}

# Generate migration using TypeORM CLI with verbose output
ts-node ./node_modules/typeorm/cli.js migration:generate -d migration-config.js "src/database/migrations/$Name" -p