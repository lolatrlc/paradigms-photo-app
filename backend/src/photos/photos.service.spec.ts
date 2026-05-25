import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { PrismaService } from '../prisma.service';

describe('PhotosService', () => {
  let service: PhotosService;

  const mockPrismaService = {
    photo: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('should forbid deleting another user photo', async () => {
  mockPrismaService.photo.findUnique.mockResolvedValue({
    id: 1,
    userId: 999,
    url: 'uploads/test.jpg',
  });

  await expect(
    service.delete(1, 1, 'USER'),
  ).rejects.toThrow('You are not allowed to delete this photo.');
});
});