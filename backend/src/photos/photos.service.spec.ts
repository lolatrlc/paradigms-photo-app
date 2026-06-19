import { Test, TestingModule } from '@nestjs/testing'; //environment for testing NestJS applications
import { PhotosService } from './photos.service'; //service being tested
import { PrismaService } from '../prisma.service'; //service normally used for database interactions, will be mocked in tests

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
  mockPrismaService.photo.findUnique.mockResolvedValue({ //we simulate a photo
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

  mockPrismaService.photo.delete.mockResolvedValue({ //we simulate the deletion of a photo
    id: 1,
  });

  const result = await service.delete(1, 1, 'ADMIN'); //we simulate an admin deleting a photo

  expect(result).toEqual({ //we expect the result to be the deleted photo
    id: 1,
  });

  expect(mockPrismaService.photo.delete).toHaveBeenCalled(); //we expect the delete method to have been called
  });



  it('should refuse upload when FREE package limit is reached', async () => {
  const fakePhotos = [ //we simulate 5 photos already uploaded today
    { createdAt: new Date() },
    { createdAt: new Date() },
    { createdAt: new Date() },
    { createdAt: new Date() },
    { createdAt: new Date() },
  ];

  mockPrismaService.photo.findMany.mockResolvedValue(fakePhotos); //we simulate the database returning 5 photos for today

  await expect(
    service.create( //we simulate a user trying to upload a new photo
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
  mockPrismaService.photo.findUnique.mockResolvedValue(null); //we simulate the database returning null, meaning the photo does not exist

  await expect(
    service.update( //we simulate a user trying to update a photo that does not exist
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


  it('should allow PRO user even above FREE limit', async () => {

  const fakePhotos = Array(20).fill({ //we simulate 20 photos already uploaded today
    createdAt: new Date(),
  });

  mockPrismaService.photo.findMany.mockResolvedValue( //we simulate the database returning 20 photos for today
    fakePhotos,
  );

  mockPrismaService.photo.create.mockResolvedValue({ //we simulate the database returning the newly created photo
    id: 2,
    title: 'PRO photo',
  });

  const result = await service.create(
    {
      title: 'PRO photo',
      description: 'test',
      hashtags: ['pro'],
      url: 'uploads/pro.jpg',
      userId: 1,
    },
    'PRO',
  );

  expect(result.title).toBe('PRO photo'); //we expect the result to be the newly created photo

  expect(
    mockPrismaService.photo.create, //we expect the create method to have been called
  ).toHaveBeenCalled();
  });
});