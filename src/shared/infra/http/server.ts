import { app } from './app';

app.listen(process.env.PORT, () => {
  console.log(`🚀 server running at http://localhost:${process.env.PORT}`);
});
