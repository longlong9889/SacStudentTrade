import { render } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'

function AllTheProviders({ children }) {
  return (
    <ChakraProvider>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </ChakraProvider>
  )
}

function customRender(ui, options) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
