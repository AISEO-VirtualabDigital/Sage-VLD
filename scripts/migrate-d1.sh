#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Sage — D1 Migration Script
# Applies the Prisma-generated SQL to Cloudflare D1.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

DB_NAME="${1:-sage-db}"
MIGRATION_FILE="prisma/migrations/d1_init.sql"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Sage D1 Migration                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Database: $DB_NAME"
echo "Migration: $MIGRATION_FILE"
echo ""

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  echo "   Run: bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > $MIGRATION_FILE"
  exit 1
fi

if ! command -v npx &> /dev/null; then
  echo "❌ npx not found. Install Node.js first."
  exit 1
fi

echo "📋 Applying migration to D1..."
npx wrangler d1 execute "$DB_NAME" --file="$MIGRATION_FILE" --remote

echo ""
echo "✅ Migration applied successfully."
echo ""
echo "Next steps:"
echo "  1. Run the seed script against D1:"
echo "     npx wrangler d1 execute $DB_NAME --file=./scripts/seed-d1.sql --remote"
echo "  2. Deploy the app:"
echo "     ./scripts/deploy-cf.sh"
