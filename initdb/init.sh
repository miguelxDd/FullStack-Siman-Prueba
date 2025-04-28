#!/bin/bash
set -e

echo " Verificando si la base de datos ya tiene datos..."

EXISTE_DATA=$(psql -U postgres -d fullStackSiman -tAc "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';")

if [ "$EXISTE_DATA" -eq "0" ]; then
    

    echo " Restaurando backup..."
    pg_restore -U postgres -d fullStackSiman /docker-entrypoint-initdb.d/simanFullstack.sql
    echo "✅ Backup restaurado correctamente."

    
else
    echo " La base de datos ya tiene tablas, no se ejecutará el Script.sql ni el Backup."
fi
