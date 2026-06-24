# 1.5 — Usuarios Compartidos

> **Tipo C — Marketplace**

El sistema utiliza **Clerk** como servicio centralizado de autenticación. Los usuarios se autentican a través de Clerk independientemente de qué app estén usando, y la identidad se propaga entre servicios mediante el token JWT emitido por Clerk.

---

## ¿Qué apps comparten usuarios?

| Usuario | Apps donde puede autenticarse |
|---------|------------------------------|
|Comprador|Buyer App, Payments App|
|Vendedor|Seller App, Payments App|
|Administrador|Payments App|

<!-- Definir claramente qué roles de usuario existen y en qué apps pueden autenticarse. Un mismo usuario de Clerk puede tener acceso a más de una app. Por ejemplo, ¿un usuario puede ser comprador y vendedor al mismo tiempo? -->

---

## Claims del JWT relevantes por app

| App | Claims utilizados | Para qué |
|-----|------------------|----------|
| Buyer App | `sub` (user ID), `role` | Identificar comprador, verificar rol `buyer` |
| Seller App | `sub` (user ID), `role` | Identificar vendedor, verificar rol `seller` |
| Payments App | `sub` (user ID), `role` | Asociar transacciones al usuario autenticado y controlar permisos |

<!-- Definir si los roles se gestionan como metadata en Clerk (publicMetadata) o de otra forma. -->

---

## Estrategia de roles
Los roles de los usuarios se gestionarán en Clerk mediante `publicMetadata`, donde se almacenarán los roles asignados a cada usuario.

Ejemplo:
```JSON
{
  "role": ["buyer", "seller"]
}
```
De esta manera, el token JWT emitido por Clerk incluirá el claim `role`, permitiendo que cada aplicación valide los permisos del usuario autenticado.

Esto permite que:
- un usuario tenga únicamente rol `buyer`
- un usuario tenga únicamente rol `seller`
- un usuario tenga ambos roles (`buyer` y `seller`)
- un usuario administrador tenga rol `admin`

Cada aplicación verificará el claim `role` para autorizar las acciones correspondientes:
- Buyer App → requiere `buyer`
- Seller App → requiere `seller`
- Payments App → permite `buyer`, `seller` y `admin` según la operación



<!-- Describir cómo se define si un usuario es comprador, vendedor, operador logístico o administrador.
Opciones comunes:
- Metadata en Clerk: `publicMetadata.role = "buyer" | "seller" | "logistics" | "admin"`
- Roles múltiples: `publicMetadata.roles = ["buyer", "seller"]` (si un usuario puede tener ambos roles)
- Organización separada por tipo de usuario en Clerk
- Roles gestionados localmente en cada app
-->
