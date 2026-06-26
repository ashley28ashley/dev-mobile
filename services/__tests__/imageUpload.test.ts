import { uploadImage } from '../../services/imageUpload';
import { supabase } from '../../services/supabase';

jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn().mockResolvedValue('ZmFrZWltYWdl'),
  EncodingType: { Base64: 'base64' },
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

describe('uploadImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload image and return public URL', async () => {
    const fakeUri = 'file:///tmp/photo.jpg';
    const fakeFileName = '123.jpg';
    const mockPath = `product_images/${fakeFileName}`;

    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: { path: mockPath }, error: null }),
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: `https://example.supabase.co/storage/v1/object/public/${mockPath}` },
      }),
    });

    const url = await uploadImage(fakeUri, fakeFileName);

    expect(supabase.storage.from).toHaveBeenCalledWith('product_images');
    const storageInstance = (supabase.storage.from as jest.Mock).mock.results[0].value;
    expect(storageInstance.upload).toHaveBeenCalledWith(
      fakeFileName,
      expect.any(Uint8Array),
      { contentType: 'image/jpeg', cacheControl: '3600', upsert: true }
    );
    expect(url).toContain('https://example.supabase.co');
  });

  it('should throw error when upload fails', async () => {
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: null, error: new Error('Upload failed') }),
      getPublicUrl: jest.fn(),
    });

    await expect(uploadImage('file:///tmp/photo.jpg', 'error.jpg'))
      .rejects.toThrow('Upload failed');
  });
});
