import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoist mock function
const mockToast = vi.hoisted(() => vi.fn())

// Mock Chakra UI toast
vi.mock('@chakra-ui/toast', () => ({
  createStandaloneToast: () => ({
    toast: mockToast
  })
}))

// Import after mocking
import { successNotification, errorNotification } from './notification'

describe('Notification Service', () => {
  beforeEach(() => {
    mockToast.mockClear()
  })

  describe('successNotification', () => {
    it('should call toast with success status', () => {
      successNotification('Success Title', 'Success description')

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success Title',
        description: 'Success description',
        status: 'success',
        isClosable: true,
        duration: 4000
      })
    })
  })

  describe('errorNotification', () => {
    it('should call toast with error status', () => {
      errorNotification('Error Title', 'Error description')

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error Title',
        description: 'Error description',
        status: 'error',
        isClosable: true,
        duration: 4000
      })
    })
  })
})
