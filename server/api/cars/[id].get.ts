import { findCarRepository } from '../../repositories/cars'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const car = id ? await findCarRepository(id) : undefined

  if (!car) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Car not found'
    })
  }

  return {
    data: car
  }
})
