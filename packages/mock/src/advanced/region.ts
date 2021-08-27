/**
 * mock省市区
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/region.json')

function provinces() {
  const randomProvinces = []
  const randomCode = []
  const randomCity = []
  data.forEach(element => {
    randomProvinces.push(element.name)
    randomCode.push(element.code)
    randomCity.push(element.cities)
  })
  const index = Math.floor(Math.random() * randomProvinces.length)
  return {
    province: randomProvinces[index],
    code: randomCode[index],
    city: randomCity[index]
  }
}

function citys(findeCode) {
  const proCode = []
  const City = []
  const randomCity = []
  const randomCode = []
  const randomCounty = []
  data.forEach(element => {
    proCode.push(element.code)
    City.push(element.cities)
  })
  if (proCode.includes(findeCode)) {
    const codeIndex = ele => ele === findeCode
    const proIndex = proCode.findIndex(codeIndex)
    if (City[proIndex].cities) {
      randomCity.push(City[proIndex].name)
      randomCode.push(City[proIndex].code)
      randomCounty.push(City[proIndex].districts)
    } else {
      City[proIndex].forEach(item => {
        randomCity.push(item.name)
        randomCode.push(item.code)
        randomCounty.push(item.districts)
      })
    }
  } else {
    const randomIndex = Math.floor(Math.random() * proCode.length)
    City[randomIndex].forEach(item => {
      randomCity.push(item.name)
      randomCode.push(item.code)
      randomCounty.push(item.districts)
    })
  }
  const index = Math.floor(Math.random() * randomCity.length)
  return {
    city: randomCity[index],
    code: randomCode[index],
    county: randomCounty[index]
  }
}

function districts(findeCode) {
  const City = []
  const cityCode = []
  const randomCounty = []
  const county = []
  const code = []
  data.forEach(element => {
    City.push(element.cities)
  })
  for (let i = 0; i < City.length; i++) {
    if (City[i].length) {
      City[i].forEach(ele => {
        cityCode.push(ele.code)
        randomCounty.push(ele.districts)
      })
    } else {
      cityCode.push(City[i].code)
      randomCounty.push(City[i].districts)
    }
  }
  if (cityCode.includes(findeCode)) {
    const codeIndex = ele => ele === findeCode
    const proIndex = cityCode.findIndex(codeIndex)
    randomCounty[proIndex].forEach(item => {
      county.push(item.name)
      code.push(item.code)
    })
    return {
      name: String(county),
      code: String(code)
    }
  } else {
    const index = Math.floor(Math.random() * cityCode.length)
    randomCounty[index].forEach(item => {
      county.push(item.name)
      code.push(item.code)
    })
    return {
      name: String(county),
      code: String(code)
    }
  }
}
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
  const obj = provinces()
  return [
    {
      name: obj.province,
      code: obj.code,
      cities: obj.city
    }
  ]
}

export function mockCities(provinceCode: string): City[] {
  const obj = citys(provinceCode)
  return [
    {
      name: obj.city,
      code: obj.code,
      districts: obj.county
    }
  ]
}

export function mockDistricts(cityCode: string): District[] {
  const obj = districts(cityCode)
  return [
    {
      name: obj.name,
      code: obj.code
    }
  ]
}
