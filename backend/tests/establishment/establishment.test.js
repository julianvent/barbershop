import express from 'express';
import { test, vi } from 'vitest';
import { requestApp } from '../helpers/request.js';

const establishmentRepoMock = {
  getAll: vi.fn(),
  getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

vi.mock('../../repositories/establishment.repository.js', () => ({
  EstablishmentRepository: establishmentRepoMock,
}));

vi.mock('../../middlewares/require.auth.middleware.js', () => ({
  default: (req, res, next) => next(),
}));

vi.mock('../../middlewares/require.admin.middleware.js', () => ({
  requireRole: () => (req, res, next) => next(),
}));

const establishmentRouter = (await import('../../routes/establishment.routes.js')).default;

function createApp() {
    const app = express();
    app.use(express.json());
    app.use('/establishments', establishmentRouter);
    return app;
}

test('GET/ establishments from an Account', async () => {
    const rows = [
        {
            id: 1,
            name: 'Test Establishment',
            address: '123 Test St',
            phone_number: '123-456-7890',
        },
    ];
    establishmentRepoMock.getAll.mockResolvedValue({
        data: rows,
        page: 1,
        pageSize: 20,
        total: 1,
        totalPage: 1,
    });
    const response = await requestApp(createApp(), { path: '/establishments' });

    expect(response.status).toBe(200);