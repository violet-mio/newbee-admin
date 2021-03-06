import request from '@/utils/request'

export function fetchCarouselList(query) {
  return request({
    url: '/carousels',
    params: query
  })
}

export function createCarousel(data) {
  return request({
    url: '/carousels',
    method: 'post',
    data
  })
}

export function updateCarousel(data) {
  return request({
    url: '/carousels',
    method: 'put',
    data
  })
}

export function fetchCarousel(id) {
  return request({
    url: `/carousels/${id}`,
    method: 'get'
  })
}

export function deleteCarousel(ids) {
  return request({
    url: `/carousels`,
    data: {
      ids,
    },
    method: 'delete'
  })
}

export function fetchIndexConfigList(query) {
  return request({
    url: '/indexConfigs',
    params: query
  })
}

export function createIndexConfig(data) {
  return request({
    url: '/indexConfigs',
    method: 'post',
    data
  })
}

export function updateIndexConfig(data) {
  return request({
    url: '/indexConfigs',
    method: 'put',
    data
  })
}

export function fetchIndexConfig(id) {
  return request({
    url: `/indexConfigs/${id}`,
    method: 'get'
  })
}

export function deleteIndexConfig(ids) {
  return request({
    url: `/indexConfigs`,
    data: {
      ids,
    },
    method: 'delete'
  })
}
