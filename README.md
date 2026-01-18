# 💰 Personal Finance API

Una API REST robusta y escalable para gestión de finanzas personales, desarrollada con Node.js, Express y MongoDB. Permite a los usuarios administrar tarjetas de crédito, transacciones, cuotas y presupuestos de manera eficiente y segura.

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
- **JWT Authentication** - Autenticación segura con tokens
- **Biometric Support** - Integración con autenticación biométrica
- **Firebase Integration** - Notificaciones push y servicios de Firebase
- **Bcrypt Encryption** - Encriptación segura de contraseñas
- **Helmet Security** - Headers de seguridad HTTP

### 💳 Gestión de Tarjetas de Crédito
- **CRUD Completo** - Crear, leer, actualizar y eliminar tarjetas
- **Límites y Balances** - Control de límites de crédito y disponible
- **Múltiples Bancos** - Soporte para tarjetas de diferentes bancos
- **Fechas de Corte** - Gestión de fechas de corte y pago

### 📊 Transacciones e Instalments
- **Transacciones** - Registro y seguimiento de gastos
- **Cuotas (Installments)** - Manejo de compras a plazos
- **Estados de Pago** - Control de pagos pendientes y realizados
- **Historial Completo** - Seguimiento detallado de movimientos

### 📈 Presupuestos Inteligentes
- **Presupuestos Mensuales** - Planificación financiera por mes/año
- **Categorías Flexibles** - Secciones personalizables (ingresos, gastos, ahorros)
- **Seguimiento en Tiempo Real** - Monitoreo de gastos vs presupuesto
- **Reportes Automáticos** - Análisis de cumplimiento de metas

### 📱 Notificaciones
- **Push Notifications** - Alertas en tiempo real
- **Recordatorios** - Fechas de pago y vencimientos
- **Cron Jobs** - Tareas programadas automáticas

## 🛠️ Stack Tecnológico

### Core
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Seguridad
- **JWT** - JSON Web Tokens para autenticación
- **Bcrypt** - Hash de contraseñas
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso entre dominios

### Servicios Externos
- **Firebase Admin** - Notificaciones push y servicios
- **Nodemailer** - Envío de emails
- **Multer** - Manejo de archivos

### Utilidades
- **Moment.js** - Manipulación de fechas
- **AJV** - Validación de esquemas JSON
- **Morgan** - Logging de HTTP
- **Node-cron** - Tareas programadas

## 📋 Requisitos Previos

- **Node.js** >= 16.0.0
- **MongoDB** >= 4.4
- **pnpm** >= 8.0.0 (recomendado)
- **Firebase Project** (para notificaciones)

## ⚡ Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Back
```

### 2. Instalar Dependencias
```bash
pnpm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Base de Datos
MONGO_URI=mongodb://localhost:27017/personal-finance
MONGO_DB_NAME=personal-finance

# JWT
JWT_SECRET=tu-jwt-secret-super-seguro
JWT_EXPIRES_IN=7d

# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com

# Email (Opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Iniciar el Servidor
```bash
# Desarrollo (con nodemon)
pnpm run dev

# Producción
pnpm start
```

## 📁 Estructura del Proyecto

```
Back/
├── config/                 # Configuraciones
│   ├── app.js              # Configuración de Express
│   ├── env.js              # Variables de entorno
│   ├── firebase.js         # Configuración Firebase
│   └── mongo.js            # Conexión MongoDB
├── src/
│   ├── middleware/         # Middlewares personalizados
│   ├── modules/            # Módulos de la aplicación
│   │   ├── budgets/        # Gestión de presupuestos
│   │   ├── creditCards/    # Gestión de tarjetas
│   │   ├── users/          # Gestión de usuarios
│   │   └── test/           # Endpoints de prueba
│   ├── services/           # Servicios externos
│   └── utils/              # Utilidades comunes
├── index.js                # Punto de entrada
├── package.json            # Dependencias y scripts
└── .env.example            # Plantilla de variables
```

## 🔌 API Endpoints

### 🔐 Autenticación
```http
POST   /api/auth/register     # Registro de usuario
POST   /api/auth/login        # Inicio de sesión
POST   /api/auth/biometric    # Login biométrico
GET    /api/auth/profile      # Perfil del usuario
PUT    /api/auth/profile      # Actualizar perfil
```

### 💳 Tarjetas de Crédito
```http
GET    /api/credit-cards           # Listar tarjetas
POST   /api/credit-cards           # Crear tarjeta
GET    /api/credit-cards/:id       # Detalle de tarjeta
PUT    /api/credit-cards/:id       # Actualizar tarjeta
DELETE /api/credit-cards/:id       # Eliminar tarjeta
```

### 💰 Transacciones
```http
GET    /api/credit-cards/:id/transactions     # Listar transacciones
POST   /api/credit-cards/:id/transactions     # Crear transacción
PUT    /api/transactions/:id                  # Actualizar transacción
DELETE /api/transactions/:id                  # Eliminar transacción
POST   /api/transactions/:id/pay              # Marcar como pagada
```

### 📊 Cuotas (Installments)
```http
GET    /api/credit-cards/:id/installments     # Listar cuotas
POST   /api/credit-cards/:id/installments     # Crear plan de cuotas
PUT    /api/installments/:id                  # Actualizar cuota
DELETE /api/installments/:id                  # Eliminar cuota
POST   /api/installments/:id/pay              # Pagar cuota
```

### 📈 Presupuestos
```http
GET    /api/budgets           # Listar presupuestos
POST   /api/budgets           # Crear presupuesto
GET    /api/budgets/:id       # Detalle de presupuesto
PUT    /api/budgets/:id       # Actualizar presupuesto
DELETE /api/budgets/:id       # Eliminar presupuesto
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con recarga automática
pnpm run dev

# Producción
pnpm start

# Ejecutar tests (cuando estén implementados)
pnpm test
```

## 🌐 Configuración de Producción

### Variables de Entorno Críticas
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=super-secure-random-string-256-bits
```

### Consideraciones de Seguridad
- Usar HTTPS en producción
- Configurar CORS apropiadamente
- Implementar rate limiting
- Monitorear logs y errores
- Backup regular de la base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Damian Garcia** - Desarrollador Full Stack

---

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de la API
2. Verifica las variables de entorno
3. Consulta los logs del servidor
4. Abre un issue en el repositorio

## 🔄 Changelog

### v1.0.0
- ✅ Sistema completo de autenticación
- ✅ CRUD de tarjetas de crédito
- ✅ Gestión de transacciones y cuotas
- ✅ Sistema de presupuestos
- ✅ Notificaciones push
- ✅ API REST completa y documentada