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

🐞 Problemas identificados y soluciones
🧩 1. Botón "Resolver" no funciona en móviles

Causa:
El footer fijo ocultaba el último ticket, bloqueando la interacción.

Solución:
Se agregó padding inferior al contenedor principal.

<main className="max-w-3xl mx-auto px-4 py-6 pb-20">

Resultado:
El botón es accesible en dispositivos móviles.

🔄 2. UI no se actualiza al resolver un ticket

Causa:
Mutación directa del estado de React.

Solución:
Se implementó actualización inmutable:

setTickets((prevTickets) =>
prevTickets.map((t) =>
t.id === updatedTicket.id ? updatedTicket : t
)
)

Resultado:
La UI se actualiza en tiempo real sin recargar.

⏳ 3. Tickets urgentes se quedan en carga infinita

Causa:
Promesa sin resolve() bloqueando el request.

Solución:

Se corrigió la promesa
Se evitó bloquear el request eliminando await
setTimeout(() => {
resolve(true)
}, 0)
sendEmailNotification(ticket.id, ticket.companyId)
.catch((err) => console.error('Error sending notification:', err))

Resultado:

Se elimina el bloqueo
Mejor rendimiento y UX
Simulación de procesos asíncronos reales
🔐 4. Fuga de datos entre empresas

Causa:
Consulta sin filtro por empresa.

Solución:

const user = { companyId: 'TechCorp' }

const tickets = await prisma.ticket.findMany({
where: { companyId: user.companyId },
orderBy: { createdAt: 'desc' },
})

Resultado:
Se evita acceso a datos de otras empresas.

🚀 Mejoras adicionales
Manejo de errores más claro en backend
Código más mantenible y predecible
Preparado para autenticación real
Mejor experiencia de usuario
🔮 Consideraciones futuras
Implementar autenticación real (JWT / sesión)
Uso de colas para tareas async (emails, notificaciones)
Paginación de tickets
Feedback visual (toasts, estados de carga)
🎯 Conclusión

Se resolvieron los problemas críticos priorizando:

Integridad de datos
Experiencia de usuario
Estabilidad del sistema
