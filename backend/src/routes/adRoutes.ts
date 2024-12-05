import { Router } from 'express';
import AdController from '../controllers/adController';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const ads = await AdController.getAds();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ads' });
  }
});

export default router;