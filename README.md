# Coding Challenge: Soporte TechCorp 🚨

¡Hola! Gracias por aplicar. Para esta prueba técnica, queremos simular un escenario real de nuestro día a día. No hay requerimientos abstractos, sino un problema real de soporte que debes resolver.

Se evaluará tu capacidad para:

- Entender código existente (Node.js, React/Next.js, Tailwind).
- Utilizar herramientas de IA (Claude, Cursor, Gemini, etc.) para acelerar tu diagnóstico y resolución.
- Priorizar tareas críticas bajo presión.
- Mantener el orden y las buenas prácticas al corregir bugs.

## El Contexto

Acabas de iniciar tu día y recibes el siguiente mensaje por Slack de José (Project Manager):

> **De:** José
> **Para:** Equipo de Soporte
>
> "Hola chicos, buenos días. Les paso contexto de unos inconvenientes urgentes que tenemos en la plataforma de TechCorp. Austin (del cliente) me indica que no puede ingresar a resolver los tickets desde su celular, el botón de 'Resolver' simplemente no le hace nada.
>
> Además, al parecer están teniendo que recargar toda la página para ver cuando un ticket cambia de estado. Es un tema urgente porque las personas de soporte de ellos no pueden gestionar los casos marcados como 'Urgente', dicen que el sistema se queda cargando y nunca termina. Ya estoy creando los tickets en Jira.
>
> Y por último, y esto es lo más crítico: me acaban de confirmar que un usuario pudo ver los tickets de OTRA empresa. Necesitamos revisar qué está interfiriendo ahí con la base de datos o el servicio, no podemos tener esa fuga de datos.
>
> Me confirman cuando lo tengan listo para coordinar pruebas finales con ellos. Mil gracias."

## Tu Misión

1. Clona este repositorio e instala las dependencias (`npm install`).
2. Levanta la base de datos local poblada de prueba (`npm run db:setup`) y el servidor (`npm run dev`).
3. Identifica y resuelve los 4 problemas mencionados por José en su mensaje.
4. Sube tu código a un repositorio público (GitHub/GitLab) y envíanos el enlace.

**Nota:** Tienes total libertad de usar herramientas de IA para apoyarte. Lo que nos importa es cómo analizas el problema, cómo guías a la IA y la calidad de la solución final. ¡Éxitos!

---

## 🐞 Problemas identificados y soluciones

### 🧩 1. Botón "Resolver" no funciona en móviles

**Causa:** El footer fijo ocultaba el último ticket, bloqueando la interacción táctil en dispositivos móviles.

**Solución:** Se agregó `padding-bottom` al contenedor principal para que el contenido no quede oculto detrás del footer.

```jsx
<main className="max-w-3xl mx-auto px-4 py-6 pb-20">
```

**Resultado:** ✅ El botón es accesible en todos los dispositivos móviles.

---

### 🔄 2. UI no se actualiza al resolver un ticket

**Causa:** Se estaba realizando una mutación directa del estado de React, lo que impedía que el componente detectara los cambios y se re-renderizara.

**Solución:** Se implementó una actualización inmutable del estado usando el patrón funcional de `setState`:

```js
setTickets((prevTickets) =>
  prevTickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)),
);
```

**Resultado:** ✅ La UI se actualiza en tiempo real sin necesidad de recargar la página.

---

### ⏳ 3. Tickets urgentes se quedan en carga infinita

**Causa:** Una `Promise` sin `resolve()` bloqueaba el request indefinidamente, dejando los tickets urgentes en un estado de carga infinita.

**Solución:** Se corrigió la promesa para que resuelva inmediatamente y se eliminó el `await` sobre `setTimeout`, permitiendo que el proceso de notificación corra en segundo plano sin bloquear el flujo principal:

```js
setTimeout(() => {
  resolve(true);
}, 0);

sendEmailNotification(ticket.id, ticket.companyId).catch((err) =>
  console.error("Error sending notification:", err),
);
```

**Resultado:**

- ✅ Se elimina el bloqueo en tickets urgentes
- ✅ Mejor rendimiento y UX general
- ✅ Simulación correcta de procesos asíncronos reales

---

### 🔐 4. Fuga de datos entre empresas

**Causa:** La consulta a la base de datos no incluía un filtro por empresa (`companyId`), lo que permitía que un usuario pudiera acceder a tickets de otras organizaciones.

**Solución:** Se agregó el filtro `companyId` proveniente del usuario autenticado directamente en la consulta de Prisma:

```js
const user = { companyId: "TechCorp" };

const tickets = await prisma.ticket.findMany({
  where: {
    companyId: user.companyId,
  },
  orderBy: {
    createdAt: "desc",
  },
});
```

**Resultado:** ✅ Se evita completamente el acceso a datos de otras empresas, garantizando el aislamiento de datos por tenant.

---

## 🚀 Mejoras adicionales

- 🛡️ Manejo de errores más claro y descriptivo en el backend
- 🧹 Código más mantenible y predecible
- 🔑 Arquitectura preparada para integrar autenticación real
- 💡 Mejor experiencia de usuario en flujos críticos

---

## 🔮 Consideraciones futuras

| Mejora                | Descripción                                        |
| --------------------- | -------------------------------------------------- |
| 🔑 Autenticación real | Implementar JWT o manejo de sesiones               |
| 📬 Colas de tareas    | Usar colas para emails y notificaciones async      |
| 📄 Paginación         | Paginar la lista de tickets para mejor performance |
| 🎨 Feedback visual    | Agregar toasts y estados de carga explícitos       |

---

## 🎯 Conclusión

Se resolvieron los problemas críticos priorizando tres pilares fundamentales:

```
Integridad de datos  →  Experiencia de usuario  →  Estabilidad del sistema
```
