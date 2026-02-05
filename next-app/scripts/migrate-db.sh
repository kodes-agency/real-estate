#!/bin/bash
set -e

# Database connection strings
LOCAL_DB="postgresql://bozhidardenev@localhost:5432/realestate"
EXTERNAL_DB="postgres://postgres:eAM0O5nDAwroLXp6CsRS7PYmIB4hqzO4apEa9jDVr7CCtZ7UmbJqVLCjZPWnEj5B@185.175.59.66:5462/postgres"

# Dump file location
DUMP_FILE="/tmp/realestate_dump.sql"
a
echo "🔄 Starting database migration..."
echo ""

# Step 1: Dump local database
echo "📦 Dumping local database..."
pg_dump "$LOCAL_DB" --no-owner --no-acl -f "$DUMP_FILE"
echo "✅ Local database dumped to $DUMP_FILE"
echo ""

# Step 2: Restore to external database
echo "📤 Restoring to external database..."
psql "$EXTERNAL_DB" -f "$DUMP_FILE"
echo "✅ Database restored to external server"
echo ""

# Step 3: Cleanup
echo "🧹 Cleaning up..."
rm "$DUMP_FILE"
echo "✅ Temporary dump file removed"
echo ""

echo "🎉 Migration complete!"
echo ""
echo "⚠️  Next steps:"
echo "1. Update DATABASE_URI in .env to:"
echo "   DATABASE_URI=$EXTERNAL_DB"
echo "2. Restart your application"
