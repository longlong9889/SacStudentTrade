import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  getCustomers,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
  login,
  customerProfilePictureUrl
} from './client'

// Mock axios.create to return a mock instance
const { mockAxiosInstance } = vi.hoisted(() => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return { mockAxiosInstance }
})

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}))

describe('Client Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue('test-token')
  })

  describe('getCustomers', () => {
    it('should fetch customers', async () => {
      const mockCustomers = [
        { id: 1, name: 'John', email: 'john@test.com' },
        { id: 2, name: 'Jane', email: 'jane@test.com' }
      ]
      mockAxiosInstance.get.mockResolvedValue({ data: mockCustomers })

      const result = await getCustomers()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/customers')
      expect(result.data).toEqual(mockCustomers)
    })

    it('should throw error when fetch fails', async () => {
      const error = new Error('Network Error')
      mockAxiosInstance.get.mockRejectedValue(error)

      await expect(getCustomers()).rejects.toThrow('Network Error')
    })
  })

  describe('saveCustomer', () => {
    it('should post new customer data', async () => {
      const newCustomer = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        age: 25,
        gender: 'MALE'
      }
      mockAxiosInstance.post.mockResolvedValue({ data: { ...newCustomer, id: 1 } })

      const result = await saveCustomer(newCustomer)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/customers',
        newCustomer
      )
      expect(result.data).toHaveProperty('id')
    })
  })

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      const update = { name: 'Updated Name' }
      mockAxiosInstance.put.mockResolvedValue({ data: { id: 1, ...update } })

      await updateCustomer(1, update)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/api/v1/customers/1',
        update
      )
    })
  })

  describe('deleteCustomer', () => {
    it('should delete customer', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} })

      await deleteCustomer(1)

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/api/v1/customers/1'
      )
    })
  })

  describe('login', () => {
    it('should post login credentials', async () => {
      const credentials = { username: 'test@test.com', password: 'password' }
      const mockResponse = {
        data: {
          token: 'jwt-token',
          customerDTO: { id: 1, name: 'Test', email: 'test@test.com' }
        }
      }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await login(credentials)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/auth/login',
        credentials
      )
      expect(result.data).toHaveProperty('token')
    })

    it('should throw error on invalid credentials', async () => {
      const credentials = { username: 'test@test.com', password: 'wrong' }
      const error = { response: { status: 401, data: { message: 'Invalid credentials' } } }
      mockAxiosInstance.post.mockRejectedValue(error)

      await expect(login(credentials)).rejects.toEqual(error)
    })
  })

  describe('customerProfilePictureUrl', () => {
    it('should return correct profile picture URL', () => {
      const url = customerProfilePictureUrl(123)
      expect(url).toContain('/api/v1/customers/123/profile-image')
    })
  })
})
