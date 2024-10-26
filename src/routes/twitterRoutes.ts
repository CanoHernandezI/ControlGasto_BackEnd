import { Router } from 'express';
import { postTweet, getTweets } from '../controllers/twitterController';

const router = Router();

router.post('/tweet', postTweet);
router.get('/tweets', getTweets); 

export default router;
