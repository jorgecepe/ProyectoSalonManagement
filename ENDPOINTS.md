# 📖 API Endpoints Documentation

Sistema de Gestión de Peluquería - API REST

**Base URL:** `http://localhost:3000`

**Version:** 1.0.0

---

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Clientes](#clientes)
- [Servicios](#servicios)
- [Códigos de Estado](#códigos-de-estado)
- [Estructura de Respuestas](#estructura-de-respuestas)
- [Ejemplos con cURL](#ejemplos-con-curl)
- [Ejemplos con PowerShell](#ejemplos-con-powershell)

---

## 🌐 Información General

### Base URL
```
http://localhost:3000
```

### Content-Type
Todas las peticiones que envían datos deben incluir:
```
Content-Type: application/json
```

### Formatos de Fecha
- **DateTime:** ISO 8601 format - `2025-11-01T21:04:41.364Z`
- **Date:** `YYYY-MM-DD` format - `2025-11-15`

---

## 🔐 Autenticación

**Estado actual:** No implementada (público)

**Próximamente:** JWT tokens en Día 3+

---

## 👥 Clientes

Base path: `/api/clients`

### 📋 Listar todos los clientes

```http
GET /api/clients
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "Roberto Silva",
      "email": "roberto.silva@email.com",
      "phone": "+1-555-1001",
      "notes": "Prefiere cortes clásicos",
      "created_at": "2025-11-01T20:00:00.000Z",
      "updated_at": "2025-11-01T20:00:00.000Z"
    }
  ]
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" | ConvertTo-Json -Depth 5
```

---

### 🔍 Buscar clientes

```http
GET /api/clients/search?q={término}
```

**Query Parameters:**
- `q` (string, required): Término de búsqueda

**Busca en:**
- Nombre del cliente
- Email
- Teléfono

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 2,
  "searchTerm": "silva",
  "data": [
    {
      "id": 1,
      "name": "Roberto Silva",
      "email": "roberto.silva@email.com",
      "phone": "+1-555-1001",
      "notes": "Prefiere cortes clásicos",
      "created_at": "2025-11-01T20:00:00.000Z",
      "updated_at": "2025-11-01T20:00:00.000Z"
    }
  ]
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/search?q=silva" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `400 Bad Request`: Parámetro `q` no proporcionado o vacío

---

### 👤 Obtener un cliente específico

```http
GET /api/clients/:id
```

**Path Parameters:**
- `id` (integer, required): ID del cliente

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Roberto Silva",
    "email": "roberto.silva@email.com",
    "phone": "+1-555-1001",
    "notes": "Prefiere cortes clásicos",
    "created_at": "2025-11-01T20:00:00.000Z",
    "updated_at": "2025-11-01T20:00:00.000Z"
  }
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/1" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `404 Not Found`: Cliente no encontrado

---

### 📅 Historial de citas de un cliente

```http
GET /api/clients/:id/history
```

**Path Parameters:**
- `id` (integer, required): ID del cliente

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "client": {
    "id": 1,
    "name": "Roberto Silva",
    "email": "roberto.silva@email.com",
    "phone": "+1-555-1001"
  },
  "appointments": [
    {
      "id": 1,
      "appointment_datetime": "2025-10-29T10:00:00.000Z",
      "status": "completed",
      "notes": "Cliente satisfecho",
      "staff_name": "Carlos Rodríguez",
      "service_name": "Corte de Cabello",
      "price": "15.00"
    }
  ],
  "totalAppointments": 3
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/1/history" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `404 Not Found`: Cliente no encontrado

---

### ➕ Crear nuevo cliente

```http
POST /api/clients
```

**Request Body:**
```json
{
  "name": "Pedro Sánchez",
  "email": "pedro@email.com",
  "phone": "+1-555-9999",
  "notes": "Cliente nuevo"
}
```

**Campos:**
- `name` (string, **required**): Nombre completo del cliente
- `email` (string, optional): Email válido (debe ser único)
- `phone` (string, **required**): Teléfono (formato: dígitos, espacios, +, -, (), permitidos)
- `notes` (string, optional): Notas adicionales

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {
    "id": 11,
    "name": "Pedro Sánchez",
    "email": "pedro@email.com",
    "phone": "+1-555-9999",
    "notes": "Cliente nuevo",
    "created_at": "2025-11-01T22:15:00.000Z",
    "updated_at": "2025-11-01T22:15:00.000Z"
  }
}
```

**Ejemplo PowerShell:**
```powershell
$body = @{
    name = "Pedro Sánchez"
    email = "pedro@email.com"
    phone = "+1-555-9999"
    notes = "Cliente nuevo"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `400 Bad Request`: Campos obligatorios faltantes o formato inválido
- `409 Conflict`: Email ya existe

---

### ✏️ Actualizar cliente

```http
PUT /api/clients/:id
```

**Path Parameters:**
- `id` (integer, required): ID del cliente

**Request Body (todos los campos son opcionales):**
```json
{
  "name": "Pedro Sánchez Actualizado",
  "email": "pedro.nuevo@email.com",
  "phone": "+1-555-8888",
  "notes": "Información actualizada"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Cliente actualizado exitosamente",
  "data": {
    "id": 11,
    "name": "Pedro Sánchez Actualizado",
    "email": "pedro.nuevo@email.com",
    "phone": "+1-555-8888",
    "notes": "Información actualizada",
    "created_at": "2025-11-01T22:15:00.000Z",
    "updated_at": "2025-11-01T22:20:00.000Z"
  }
}
```

**Ejemplo PowerShell (actualización parcial):**
```powershell
$body = @{
    phone = "+1-555-7777"
    notes = "Solo actualizo teléfono"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/clients/11" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `400 Bad Request`: Formato de datos inválido
- `404 Not Found`: Cliente no encontrado
- `409 Conflict`: Email ya existe (si se intenta cambiar a uno existente)

---

### 🗑️ Eliminar cliente

```http
DELETE /api/clients/:id
```

**Path Parameters:**
- `id` (integer, required): ID del cliente

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Cliente eliminado exitosamente",
  "data": {
    "id": 11,
    "name": "Pedro Sánchez",
    "email": "pedro@email.com",
    "phone": "+1-555-9999"
  }
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/11" -Method DELETE | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `404 Not Found`: Cliente no encontrado
- `409 Conflict`: Cliente tiene citas registradas (no se puede eliminar)

**Ejemplo de error 409:**
```json
{
  "success": false,
  "error": "No se puede eliminar. El cliente tiene 3 cita(s) registrada(s)",
  "appointmentCount": 3
}
```

---

## 💈 Servicios

Base path: `/api/services`

### 📋 Listar todos los servicios

```http
GET /api/services
```

**Query Parameters (opcionales):**
- `active` (boolean): Filtrar por estado
  - `?active=true` - Solo servicios activos
  - `?active=false` - Solo servicios inactivos
  - Sin parámetro - Todos los servicios

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "name": "Corte de Cabello",
      "description": "Corte básico de cabello",
      "duration_minutes": 30,
      "price": "15.00",
      "is_active": true,
      "created_at": "2025-11-01T20:00:00.000Z"
    }
  ]
}
```

**Ejemplos PowerShell:**
```powershell
# Todos los servicios
Invoke-RestMethod -Uri "http://localhost:3000/api/services" | ConvertTo-Json -Depth 5

# Solo activos
Invoke-RestMethod -Uri "http://localhost:3000/api/services?active=true" | ConvertTo-Json -Depth 5

# Solo inactivos
Invoke-RestMethod -Uri "http://localhost:3000/api/services?active=false" | ConvertTo-Json -Depth 5
```

---

### 🔥 Servicios más populares

```http
GET /api/services/popular
```

**Query Parameters (opcionales):**
- `limit` (integer, default: 5): Número máximo de servicios a retornar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Corte de Cabello",
      "description": "Corte básico de cabello",
      "price": "15.00",
      "duration_minutes": 30,
      "booking_count": "12",
      "total_revenue": "180.00"
    }
  ]
}
```

**Ejemplo PowerShell:**
```powershell
# Top 5 (default)
Invoke-RestMethod -Uri "http://localhost:3000/api/services/popular" | ConvertTo-Json -Depth 5

# Top 3
Invoke-RestMethod -Uri "http://localhost:3000/api/services/popular?limit=3" | ConvertTo-Json -Depth 5
```

---

### 💈 Obtener un servicio específico

```http
GET /api/services/:id
```

**Path Parameters:**
- `id` (integer, required): ID del servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Corte de Cabello",
    "description": "Corte básico de cabello",
    "duration_minutes": 30,
    "price": "15.00",
    "is_active": true,
    "created_at": "2025-11-01T20:00:00.000Z"
  }
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/services/1" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `404 Not Found`: Servicio no encontrado

---

### ➕ Crear nuevo servicio

```http
POST /api/services
```

**Request Body:**
```json
{
  "name": "Manicure Express",
  "description": "Manicure rápido con esmaltado",
  "duration_minutes": 20,
  "price": 15.00
}
```

**Campos:**
- `name` (string, **required**): Nombre del servicio
- `description` (string, optional): Descripción detallada
- `duration_minutes` (integer, **required**): Duración en minutos (1-480)
- `price` (decimal, **required**): Precio del servicio (≥ 0)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Servicio creado exitosamente",
  "data": {
    "id": 9,
    "name": "Manicure Express",
    "description": "Manicure rápido con esmaltado",
    "duration_minutes": 20,
    "price": "15.00",
    "is_active": true,
    "created_at": "2025-11-01T22:25:00.000Z"
  }
}
```

**Ejemplo PowerShell:**
```powershell
$body = @{
    name = "Manicure Express"
    description = "Manicure rápido con esmaltado"
    duration_minutes = 20
    price = 15.00
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/services" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `400 Bad Request`: Campos obligatorios faltantes o valores inválidos
  - Duración debe estar entre 1 y 480 minutos
  - Precio no puede ser negativo

---

### ✏️ Actualizar servicio

```http
PUT /api/services/:id
```

**Path Parameters:**
- `id` (integer, required): ID del servicio

**Request Body (todos los campos son opcionales):**
```json
{
  "name": "Manicure Premium",
  "description": "Manicure con tratamiento",
  "duration_minutes": 30,
  "price": 25.00,
  "is_active": true
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Servicio actualizado exitosamente",
  "data": {
    "id": 9,
    "name": "Manicure Premium",
    "description": "Manicure con tratamiento",
    "duration_minutes": 30,
    "price": "25.00",
    "is_active": true,
    "created_at": "2025-11-01T22:25:00.000Z"
  }
}
```

**Ejemplo PowerShell (actualización parcial):**
```powershell
$body = @{
    price = 20.00
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/services/9" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json" | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `400 Bad Request`: Valores inválidos
- `404 Not Found`: Servicio no encontrado

---

### ✅ Reactivar servicio

```http
PATCH /api/services/:id/activate
```

**Path Parameters:**
- `id` (integer, required): ID del servicio

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Servicio activado exitosamente",
  "data": {
    "id": 9,
    "name": "Manicure Express",
    "is_active": true
  }
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/services/9/activate" `
    -Method PATCH | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `404 Not Found`: Servicio no encontrado

---

### 🗑️ Eliminar servicio

```http
DELETE /api/services/:id
```

**Path Parameters:**
- `id` (integer, required): ID del servicio

**Query Parameters (opcionales):**
- `permanent` (boolean, default: false): Tipo de eliminación
  - Sin parámetro o `?permanent=false` - **Soft delete** (marca como inactivo)
  - `?permanent=true` - **Hard delete** (eliminación permanente)

**Respuesta exitosa - Soft delete (200):**
```json
{
  "success": true,
  "message": "Servicio desactivado exitosamente",
  "data": {
    "id": 9,
    "name": "Manicure Express",
    "is_active": false
  }
}
```

**Respuesta exitosa - Hard delete (200):**
```json
{
  "success": true,
  "message": "Servicio eliminado permanentemente",
  "data": {
    "id": 9,
    "name": "Manicure Express"
  }
}
```

**Ejemplos PowerShell:**
```powershell
# Soft delete (por defecto)
Invoke-RestMethod -Uri "http://localhost:3000/api/services/9" -Method DELETE | ConvertTo-Json -Depth 5

# Hard delete (permanente)
Invoke-RestMethod -Uri "http://localhost:3000/api/services/9?permanent=true" -Method DELETE | ConvertTo-Json -Depth 5
```

**Errores posibles:**
- `404 Not Found`: Servicio no encontrado
- `409 Conflict`: Servicio tiene citas activas (solo aplica para hard delete)

**Ejemplo de error 409:**
```json
{
  "success": false,
  "error": "No se puede eliminar permanentemente. El servicio tiene 5 cita(s) activa(s)",
  "appointmentCount": 5,
  "suggestion": "Usa soft delete (is_active = false) en su lugar"
}
```

---

## 🏥 Health Check

### Verificar estado del servidor

```http
GET /api/health
```

**Respuesta exitosa (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-11-01T22:30:00.000Z"
}
```

**Respuesta con error (503):**
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Error de conexión"
}
```

**Ejemplo PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" | ConvertTo-Json
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Uso en la API |
|--------|-------------|---------------|
| **200** | OK | Operación exitosa (GET, PUT, DELETE) |
| **201** | Created | Recurso creado exitosamente (POST) |
| **400** | Bad Request | Datos inválidos o campos faltantes |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (email duplicado, no se puede eliminar) |
| **500** | Internal Server Error | Error del servidor |
| **503** | Service Unavailable | Servicio no disponible (BD desconectada) |

---

## 📦 Estructura de Respuestas

### Respuesta Exitosa (success: true)

```json
{
  "success": true,
  "message": "Operación completada (opcional)",
  "data": { /* recurso o array de recursos */ },
  "count": 10  // Solo en listados
}
```

### Respuesta con Error (success: false)

```json
{
  "success": false,
  "error": "Descripción del error",
  "details": { /* información adicional (opcional) */ }
}
```

---

## 🔧 Ejemplos con cURL

### Listar clientes
```bash
curl http://localhost:3000/api/clients
```

### Crear cliente
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@email.com",
    "phone": "+1-555-0000"
  }'
```

### Actualizar cliente
```bash
curl -X PUT http://localhost:3000/api/clients/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1-555-1111"
  }'
```

### Eliminar cliente
```bash
curl -X DELETE http://localhost:3000/api/clients/1
```

### Buscar clientes
```bash
curl "http://localhost:3000/api/clients/search?q=silva"
```

---

## 💻 Ejemplos con PowerShell

### GET Request
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" | ConvertTo-Json -Depth 5
```

### POST Request
```powershell
$body = @{
    name = "Test User"
    email = "test@email.com"
    phone = "+1-555-0000"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | ConvertTo-Json -Depth 5
```

### PUT Request
```powershell
$body = @{
    phone = "+1-555-1111"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/clients/1" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json" | ConvertTo-Json -Depth 5
```

### DELETE Request
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/1" `
    -Method DELETE | ConvertTo-Json -Depth 5
```

---

## 🧪 Testing Guide

### Flujo de prueba completo

```powershell
# 1. Verificar salud del servidor
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# 2. Crear un cliente
$newClient = @{
    name = "Test Jorge"
    email = "jorge.test@email.com"
    phone = "+1-555-TEST"
} | ConvertTo-Json

$client = Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
    -Method POST -Body $newClient -ContentType "application/json"

# 3. Ver el cliente creado
$clientId = $client.data.id
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/$clientId"

# 4. Actualizar el cliente
$updateData = @{ notes = "Cliente de prueba" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/$clientId" `
    -Method PUT -Body $updateData -ContentType "application/json"

# 5. Buscar el cliente
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/search?q=jorge"

# 6. Ver historial
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/$clientId/history"

# 7. Eliminar el cliente (cleanup)
Invoke-RestMethod -Uri "http://localhost:3000/api/clients/$clientId" -Method DELETE
```

---

## 📝 Notas Adicionales

### Validaciones

**Clientes:**
- Email debe ser único
- Email debe tener formato válido
- Teléfono solo puede contener: dígitos, espacios, +, -, ()
- No se puede eliminar un cliente con citas registradas

**Servicios:**
- Duración debe estar entre 1 y 480 minutos (8 horas)
- Precio no puede ser negativo
- Por defecto se usa soft delete (is_active = false)
- Hard delete solo si no tiene citas activas

### Performance

- Todas las queries usan índices apropiados
- Pool de conexiones para manejo eficiente de BD
- COALESCE para actualizaciones parciales eficientes

### Seguridad

- Todas las queries usan parámetros ($1, $2) para prevenir SQL injection
- Validación de datos en el backend
- Manejo apropiado de errores sin exponer detalles internos

---

**Última actualización:** 01 de noviembre de 2025  
**Versión:** 1.0.0  
**Autor:** Jorge