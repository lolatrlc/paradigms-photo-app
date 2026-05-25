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



  it('should allow admin to delete any photo', async () => {
  mockPrismaService.photo.findUnique.mockResolvedValue({
    id: 1,
    userId: 999,
    url: 'uploads/test.jpg',
  });

  mockPrismaService.photo.delete.mockResolvedValue({
    id: 1,
  });

  const result = await service.delete(1, 1, 'ADMIN');

  expect(result).toEqual({
    id: 1,
  });

  expect(mockPrismaService.photo.delete).toHaveBeenCalled();
  });



  it('should refuse upload when FREE package limit is reached', async () => {
  const fakePhotos = [
    { createdAt: new Date() },
    { createdAt: new Date() },
    { createdAt: new Date() },
    { createdAt: new Date() },
    { createdAt: new Date() },
  ];

  mockPrismaService.photo.findMany.mockResolvedValue(fakePhotos);

  await expect(
    service.create(
      {
        title: 'Test',
        description: 'Test',
        hashtags: ['test'],
        url: 'uploads/test.jpg',
        userId: 1,
      },
      'FREE',
    ),
  ).rejects.toThrow(
    'Limit reached : Your package FREE only allows 5 photos per day.',
  );
  });



  it('should throw error if photo does not exist when updating', async () => {
  mockPrismaService.photo.findUnique.mockResolvedValue(null);

  await expect(
    service.update(
      999,
      {
        title: 'Updated',
        description: 'Updated',
        hashtags: 'test',
      },
      1,
      'USER',
    ),
  ).rejects.toThrow('Photo not found');
  });
});