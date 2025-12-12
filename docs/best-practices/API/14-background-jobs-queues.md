# Background Jobs & Queues

## Using BullMQ / RabbitMQ / SQS

**BullMQ** (Redis-based, Recommended for Node.js):
```javascript
const { Queue } = require('bullmq');

const emailQueue = new Queue('emails', {
  connection: { host: 'localhost', port: 6379 },
});

// Add job
await emailQueue.add('send-welcome-email', {
  userId: user.id,
  email: user.email,
});

// Process jobs
const worker = new Worker('emails', async (job) => {
  await sendEmail(job.data.email);
});
```

**Benefits**: Reliable job processing, retries, monitoring.

## Retry Strategy

**Configure Retries**:
```javascript
await queue.add('process-data', data, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
});
```

**Exponential Backoff**: Wait longer between retries (2s, 4s, 8s).

**Max Attempts**: Set reasonable limit (3-5 attempts).

## Dead-Letter Queues

**Handle Failed Jobs**:
```javascript
const worker = new Worker('emails', async (job) => {
  try {
    await sendEmail(job.data.email);
  } catch (error) {
    // After max attempts, move to failed queue
    throw error;
  }
});

// Process failed jobs
const failedQueue = new Queue('emails:failed');
```

**Monitor Failed Jobs**: Review and fix issues, manually retry if needed.

## Handling Long-Running Tasks

**Use Background Jobs For**:
- Sending emails
- Generating reports
- Processing large datasets
- Image/video processing

**Don't Block Request**: Return immediately, process in background.

**Status Updates**: Provide endpoint to check job status.

**Example**:
```javascript
router.post('/generate-report', async (req, res) => {
  const job = await reportQueue.add('generate', req.body);
  res.json({ jobId: job.id, status: 'processing' });
});

router.get('/report/:jobId', async (req, res) => {
  const job = await reportQueue.getJob(req.params.jobId);
  res.json({ status: job.state, result: job.returnvalue });
});
```

