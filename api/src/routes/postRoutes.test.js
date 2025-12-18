import request from 'supertest';
import express from 'express';
import routes from './postRoutes.js';

// Dados simulados
const postMock = {
    _id: '123',
    titulo: 'Post de Teste',
    descricao: 'Descrição do post',
    autor: 'Claudio',
    postAtivo: true,
    dataCriacao: '2025-10-06',
    dataAtualizacao: '2025-10-06',
    comentarios: [
        {
            _id: '456',
            usuario: 'User',
            texto: 'Comentário de teste',
            data: '2025-10-06'
        }
    ]
};

// Mock completo do controller
jest.mock('../controllers/postController.js', () => ({
    listarPosts: jest.fn((req, res) => res.status(200).json([postMock])),
    listarPostsProfessor: jest.fn((req, res) => res.status(200).json([postMock])),
    listarPostPorFiltro: jest.fn((req, res) => res.status(200).json([postMock])),
    listarPostPorId: jest.fn((req, res) => res.status(200).json(postMock)),
    cadastrarPost: jest.fn((req, res) => res.status(201).json(postMock)),
    atualizarPost: jest.fn((req, res) => res.status(200).json(postMock)),
    excluirPost: jest.fn((req, res) => res.status(200).json({ message: 'Post excluído' })),
    listarComentarios: jest.fn((req, res) => res.status(200).json(postMock.comentarios)),
    adicionarComentario: jest.fn((req, res) => res.status(201).json(postMock.comentarios[0])),
    editarComentario: jest.fn((req, res) => res.status(200).json(postMock.comentarios[0])),
    excluirComentario: jest.fn((req, res) => res.status(200).json({ message: 'Comentário excluído' })),
}));

const app = express();
app.use(express.json());
app.use(routes);

describe('PostController Routes', () => {

    // POSTS
    it('GET /posts should return array of posts', async () => {
        const res = await request(app).get('/posts');
        expect(res.status).toBe(200);
        expect(res.body[0].titulo).toBe('Post de Teste');
    });

    it('GET /posts/professor should return array of posts', async () => {
        const res = await request(app).get('/posts/professor');
        expect(res.status).toBe(200);
        expect(res.body[0].autor).toBe('Claudio');
    });

    it('GET /posts/busca should return filtered posts', async () => {
        const res = await request(app).get('/posts/busca?titulo=Teste');
        expect(res.status).toBe(200);
        expect(res.body[0].titulo).toContain('Teste');
    });

    it('GET /posts/:id should return a single post', async () => {
        const res = await request(app).get('/posts/123');
        expect(res.status).toBe(200);
        expect(res.body._id).toBe('123');
    });

    it('POST /posts should create a new post', async () => {
        const res = await request(app).post('/posts').send({ titulo: 'Novo Post' });
        expect(res.status).toBe(201);
        expect(res.body.titulo).toBe('Post de Teste');
    });

    it('PUT /posts/:id should update a post', async () => {
        const res = await request(app).put('/posts/123').send({ titulo: 'Atualizado' });
        expect(res.status).toBe(200);
        expect(res.body.titulo).toBe('Post de Teste');
    });

    it('DELETE /posts/:id should delete a post', async () => {
        const res = await request(app).delete('/posts/123');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Post excluído');
    });

    // COMENTÁRIOS
    it('GET /posts/:id/comentarios should return comments', async () => {
        const res = await request(app).get('/posts/123/comentarios');
        expect(res.status).toBe(200);
        expect(res.body[0].texto).toBe('Comentário de teste');
    });

    it('POST /posts/:id/comentarios should add a comment', async () => {
        const res = await request(app).post('/posts/123/comentarios').send({ usuario: 'User', texto: 'Comentário de teste' });
        expect(res.status).toBe(201);
        expect(res.body.texto).toBe('Comentário de teste');
    });

    it('PUT /posts/:postId/comentarios/:comentarioId should edit a comment', async () => {
        const res = await request(app).put('/posts/123/comentarios/456').send({ usuario: 'User', novoTexto: 'Comentário editado' });
        expect(res.status).toBe(200);
        expect(res.body.texto).toBe('Comentário de teste');
    });

    it('DELETE /posts/:postId/comentarios/:comentarioId should delete a comment', async () => {
        const res = await request(app).delete('/posts/123/comentarios/456').send({ usuario: 'User', cargo: 'professor' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Comentário excluído');
    });
});
