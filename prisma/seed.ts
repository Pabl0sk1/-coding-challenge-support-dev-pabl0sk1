import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.ticket.deleteMany()

  // Tickets de TechCorp (Compañía actual del usuario en la simulación)
  await prisma.ticket.create({
    data: {
      title: 'El dashboard principal no carga',
      description: 'Cuando intento entrar al dashboard se queda en blanco.',
      status: 'Abierto',
      priority: 'Urgente',
      companyId: 'TechCorp',
    },
  })

  await prisma.ticket.create({
    data: {
      title: 'Cambio de contraseña',
      description: 'Necesito cambiar mi contraseña por favor.',
      status: 'Abierto',
      priority: 'Normal',
      companyId: 'TechCorp',
    },
  })

  // Tickets de Otra Empresa (Fuga de datos, el usuario de TechCorp NO debería ver esto)
  await prisma.ticket.create({
    data: {
      title: 'Fallo en facturación',
      description: 'Las facturas de este mes salieron con un monto incorrecto.',
      status: 'Abierto',
      priority: 'Urgente',
      companyId: 'Orosi',
    },
  })

  await prisma.ticket.create({
    data: {
      title: 'Acceso denegado a reportes',
      description: 'No tengo permisos para ver los reportes mensuales.',
      status: 'Resuelto',
      priority: 'Normal',
      companyId: 'Orosi',
    },
  })

  console.log('Seed ejecutado exitosamente.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
