// __tests__/api.test.ts
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from '../../services/api';
import { supabase } from '../../services/supabase';

jest.mock('../../services/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('API service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listProducts should call supabase.from with correct table and ordering', async () => {
    const mockData = [{ id: '1', name: 'Prod' }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: (cb: any) => cb({ data: mockData, error: null }),
    });
    const { data, error } = await listProducts();
    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(error).toBeNull();
    expect(data).toEqual(mockData);
  });

  it('createProduct should insert product and return data', async () => {
    const newProduct = { name: 'Test', price: 10, image_url: 'url', description: '' };
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      then: (cb: any) => cb({ data: { id: '123', ...newProduct }, error: null }),
    });
    const { data, error } = await createProduct(newProduct as any);
    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(error).toBeNull();
    expect(data).toMatchObject(newProduct);
  });
});
