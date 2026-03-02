import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_ADDRESS_API_URL

export interface Province {
  name: string
  code: number
  division_type: string
  codename: string
  phone_code: number
}

export interface District {
  name: string
  code: number
  division_type: string
  codename: string
  province_code: number
}

export interface Ward {
  name: string
  code: number
  division_type: string
  codename: string
  district_code: number
}

export const addressService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await axios.get(`${import.meta.env.VITE_ADDRESS_API_URL}/provinces`)
    return response.data.data.provinceList
  },

  getWards: async (provinceId: number): Promise<Ward[]> => {
    const response = await axios.get(`${API_BASE_URL}/provinces/${provinceId}/wards`)
    return response.data.data.wardList
  }
}
