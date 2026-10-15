
import express from 'express';

const app = express();

app.use(express.static('public'));

app.use(express.json({ limit: '10kb' }));

const projects = [];

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const { name, status } = req.body ?? {};

    const allowedStatuses = [
        'Planned',
        'In Progress',
        'Completed'
    ];

    if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        name.trim().length > 80
    ) {
        return res.status(400).json({
            error: 'Project name must be between 1 and 80 characters.'
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            error: 'Status must be Planned, In Progress, or Completed.'
        });
    }

    const project = {
        id: projects.length + 1,
        name: name.trim(),
        status
    };

    projects.push(project);

    res.status(201).json(project);
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Open http://localhost:${port}`);
});
