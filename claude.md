# Verificar instalaciones
node --version
npm --version
git --version
docker --version

# Navegar al proyecto
cd "C:\Users\jorge\OneDrive - Grupo Security\_Personal\Consultoria\ProyectoTiendaOnline"

# Iniciar servidor backend
cd backend
npm run dev

# Ver logs de Docker (si aplica)
docker logs postgres-salon

# Conectar a PostgreSQL local
psql -U postgres -d salon_db