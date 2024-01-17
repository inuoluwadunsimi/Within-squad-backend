import express from 'express';
import { triangleController } from '../controllers';

const router = express.Router();

router.post('/type', triangleController.receiveTriangle);

export default router;
