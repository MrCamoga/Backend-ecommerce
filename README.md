# Backend-ecommerce-api

Backend de una tienda online desarrollado con **Node.js**, **Express**, y **Sequelize**. Esta API gestiona productos, categorías, pedidos y usuarios, permitiendo operaciones típicas de una tienda online.

---

## 🚀 Tecnologías

- Node.js
- Express
- Sequelize
- MariaDB

---

## ⚙️ Instalación y configuración

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/MrCamoga/Backend-ecommerce.git
   cd Backend-ecommerce
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   npm install sequelize-cli -g
   ```

3. **Configura la base de datos:**

   Asegúrate de tener MySQL corriendo y edita `config/config.js` con tus credenciales.

4. **Crea la base de datos:**

   ```bash
   sequelize db:create
   ```

5. **Ejecuta las migraciones:**

   ```bash
   sequelize db:migrate
   ```

6. **Ejecuta los seeders (datos de prueba):**

   ```bash
   sequelize db:seed:all
   ```

7. **Ejecuta el servidor:**

   ```bash
   npm run dev
   ```

---

## Endpoints disponibles

### Productos

- `GET /products?price=&minPrice=&maxPrice=&name=`

  Lista todos los productos y sus categorías filtrando por precio y nombre.

- `GET /products/:id`

  Obtiene los detalles de un producto específico y sus categorías.

- `POST /products`

  Crea un nuevo producto.
  ```json
  {
    "name": "product name",		// string, required
    "description": "description",		// string, required
    "price": 1999,			// integer, required, price in pennies
    "categories": [1,2,3]			// int/int[], optional
  }
  ```

- `PUT /products/:id`

  Actualiza un producto existente.

- `DELETE /products/:id`

  Elimina un producto.

---

### Categorías

- `GET /categories`

  Lista todas las categorías y los productos que pertenecen a éstas.

- `GET /categories/:id`

  Lista los detalles de una categoría.

- `POST /categories`

  Crea una nueva categoría.
  ```json
  {
    "name": "category name",	// string, required, unique
    "parent_category": 1		// int, optional
  }
  ```

- `PUT /categories/:id`

  Actualiza una categoría.

- `DELETE /categories/:id`

  Elimina una categoría.

---

### Pedidos

- `GET /orders`

  Lista todos los pedidos de todos los usuarios

- `POST /orders`

  Crea un nuevo pedido
  ```json
  {
    "items": [		// array of tuples [productId,quantity]
      [1,3],
      [2,10],
      [4,1]
    ]
  }
  ```
---

### Auth

- `GET /auth/confirm/:token`

  Endpoint para verificar un correo

- `POST /auth/login`

  Logea a un usuario con correo y contraseña y retorna un token jwt
  ```json
  {
    "email": "user@example.com",	// string, required
    "password": "123456"		// string, required
  }
  ```

- `DELETE /auth/logout`

  Desautoriza un token jwt

---

### Users

- `GET /users/orders`

  Obtiene todos los pedidos de un usuario logueado

- `POST /users`

  Registra a un nuevo usuario
  ```json
  {
    "first_name": "name",		// string, required, 1-50 chars
    "last_name": "surname",	// string, required, 1-50 chars
    "email": "user@example.com",	// string, required, must be valid email
    "password": "123456"		// string, required, no validation in backend
  }
  ```

---

### Reviews

- `GET /reviews/:id`

  Obtiene detalles de una review por id.

- `GET /products/:id/reviews`

  Obtiene todas las reviews de un producto.

- `POST /reviews`

  Crea una nueva review.
  ```json
  {
    "ProductId": 2,		// integer, required
    "textReview": "blablabla",	// string, required, 20-255 characters
    "stars": 7,			// integer, required, 0-10
  }
  ```

- `PUT /reviews/:id`

  Actualiza una review existente
  ```json
  {
    "textReview": "blabla",	// string, required, 20-255 characters
    "stars": 8,			// integer, required, 0-10
  }
  ```

- `DELETE /reviews/:id`

  Elimina una review por id.

---

## Autores

- [@MrCamoga](https://github.com/MrCamoga)
