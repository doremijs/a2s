/**
 * mock省市区
 */

interface Province {
  name: string
  code: string
  cities: City[]
}

interface City {
  name: string
  code: string
  districts: District[]
}

interface District {
  name: string
  code: string
}

export function mockProvinces(): Province[] {
  //
}

export function mockCities(provinceCode: string): City[] {
  //
}

export function mockDistricts(cityCode: string): District[] {
  //
}
