import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse } from "../types/api.types";

export interface AddressPayload {
  id?: string | number;
  full_name?: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  address_type?: "home" | "office" | "other" | string;
  is_default?: boolean;
}

export const addressService = {
  async getAddresses(): Promise<ApiResponse<AddressPayload[]>> {
    const response = await apiClient.get(API_ENDPOINTS.ADDRESSES.BASE);
    return response.data;
  },

  async getAddressById(id: string | number): Promise<ApiResponse<AddressPayload>> {
    const response = await apiClient.get(API_ENDPOINTS.ADDRESSES.BY_ID(id));
    return response.data;
  },

  async createAddress(address: AddressPayload): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.ADDRESSES.BASE, address);
    return response.data;
  },

  async updateAddress(id: string | number, address: AddressPayload): Promise<ApiResponse<any>> {
    const response = await apiClient.put(API_ENDPOINTS.ADDRESSES.BY_ID(id), address);
    return response.data;
  },

  async deleteAddress(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.ADDRESSES.BY_ID(id));
    return response.data;
  },

  async setDefaultAddress(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ADDRESSES.DEFAULT(id));
    return response.data;
  },
};
