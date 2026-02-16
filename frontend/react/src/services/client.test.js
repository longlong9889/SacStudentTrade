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

// Mock axios
vi.mock('axios')

describe('Client Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue('test-token')
  })

  describe('getCustomers', () => {
    it('should fetch customers with auth header', async () => {
      const mockCustomers = [
        { id: 1, name: 'John', email: 'john@test.com' },
        { id: 2, name: 'Jane', email: 'jane@test.com' }
      ]
      axios.get.mockResolvedValue({ data: mockCustomers })

      const result = await getCustomers()

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/customers'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' }
        })
      )
      expect(result.data).toEqual(mockCustomers)
    })

    it('should throw error when fetch fails', async () => {
      const error = new Error('Network Error')
      axios.get.mockRejectedValue(error)

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
      axios.post.mockResolvedValue({ data: { ...newCustomer, id: 1 } })

      const result = await saveCustomer(newCustomer)

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/customers'),
        newCustomer
      )
      expect(result.data).toHaveProperty('id')
    })
  })

  describe('updateCustomer', () => {
    it('should update customer with auth header', async () => {
      const update = { name: 'Updated Name' }
      axios.put.mockResolvedValue({ data: { id: 1, ...update } })

      await updateCustomer(1, update)

      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/customers/1'),
        update,
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' }
        })
      )
    })
  })

  describe('deleteCustomer', () => {
    it('should delete customer with auth header', async () => {
      axios.delete.mockResolvedValue({ data: {} })

      await deleteCustomer(1)

      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/customers/1'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' }
        })
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
      axios.post.mockResolvedValue(mockResponse)

      const result = await login(credentials)

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/login'),
        credentials
      )
      expect(result.data).toHaveProperty('token')
    })

    it('should throw error on invalid credentials', async () => {
      const credentials = { username: 'test@test.com', password: 'wrong' }
      const error = { response: { status: 401, data: { message: 'Invalid credentials' } } }
      axios.post.mockRejectedValue(error)

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
