<h1 align="center">Gestor de Deudas - MVP 👋</h1>

<p align="center">
  Aplicación para registrar, consultar, editar y pagar deudas entre usuarios.
</p>

---

## 📝 Contexto del proyecto

Esta aplicación fue desarrollada como prueba técnica para **Double V Partners NYX**.  
Permite gestionar deudas entre amigos, registrarlas, marcarlas como pagadas y consultarlas filtrando por estado.  

La prueba técnica consistía en construir un **MVP funcional** siguiendo estas condiciones:

- Backend: Node.js con Prisma, PostgreSQL, Jest para tests.
- Frontend: React + TailwindCSS.
- Persistencia: PostgreSQL, con relación de usuarios y deudas.
- Funcionalidades: Login/Registro, CRUD de deudas, marcar deudas como pagadas, exportar CSV, filtros de deudas.

---

## 🛠 Tecnologías usadas

**Backend:**

- Node.js
- Prisma ORM
- PostgreSQL
- Jest (tests unitarios)

**Frontend:**

- React
- TailwindCSS
- Vite

---

## ⚡ Instalación y ejecución

### Requisitos

- Node.js >= 18
- PostgreSQL en funcionamiento
- Git

### Clonar el repositorio

```bash
git clone https://github.com/tuusuario/frontend.git
cd frontend
Configurar la base de datos
Crear una base de datos PostgreSQL y obtener la URL de conexión:

env
Copiar código
DATABASE_URL="postgresql://usuario:password@localhost:5432/deudas_db"
Colocar la URL en .env en la raíz del proyecto.

Backend
bash
Copiar código
cd backend
npm install

# Migrar la base de datos
npx prisma migrate dev --name init

# Llenar la base con datos de prueba
npm run seed

# Ejecutar el backend
npm run dev
Frontend
bash
Copiar código
cd frontend
npm install
npm run dev
La aplicación debería abrirse en http://localhost:5173.

Usuario de prueba: test@example.com / 123456

🚀 Uso
Iniciar sesión con el usuario de prueba o registrar uno nuevo.

Crear nuevas deudas usando el formulario.

Filtrar deudas por pendientes o pagadas.

Editar o eliminar deudas.

Exportar deudas a CSV usando el botón correspondiente.

Cerrar sesión para volver a la pantalla de login.

🧪 Tests
El backend incluye tests unitarios con Jest.

bash
Copiar código
cd backend
npm test
📦 Estructura del proyecto
pgsql
✨ Decisiones técnicas
Prisma para manejar la base de datos y relaciones entre User y Debt.

Hash de passwords con bcrypt.

Frontend con React y TailwindCSS por rapidez y facilidad de diseño responsivo.

Toasts personalizados para feedback de acciones.

Gestión de sesión simple usando localStorage para el token.

📬 Entrega
Esta prueba fue desarrollada como ejercicio para evaluar habilidades técnicas y buenas prácticas de desarrollo.
El objetivo no solo era completar la prueba, sino demostrar arquitectura escalable, uso correcto de ORM, frontend moderno y pruebas unitarias.

👤 Autor
CRISTHIAN BERMUDEZ

GitHub: @bermudezcristhian

💖 Agradecimientos
Gracias a Double V Partners NYX por la oportunidad de participar en este reto técnico.
Se recomienda probar la aplicación a fondo para entender el flujo de usuario y la lógica implementada.

This README was created as part of the technical test with ❤️ by Cristihian Bermudez.