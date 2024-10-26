import { TwitterApi } from 'twitter-api-v2';
import { Request, Response } from 'express';
import config from '../keys';
import pool from '../database'; 

const client = new TwitterApi({
  appKey: config.twitterConfig.apiKey,
  appSecret: config.twitterConfig.apiSecretKey,
  accessToken: config.twitterConfig.accessToken,
  accessSecret: config.twitterConfig.accessTokenSecret,
});

export const postTweet = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const tweet = await client.v2.tweet(status);

      const tweetText = tweet.data.text;
      const tweetId = tweet.data.id;

      await pool.query('INSERT INTO tweets (tweet_id, tweet_text) VALUES (?, ?)', [tweetId, tweetText]);

      res.json({ message: 'Tweet posted and saved successfully', tweet });
    } catch (error) {
      res.status(500).json({ error: 'Error posting tweet', details: error });
    }
};

export const getTweets = async (req: Request, res: Response) => {
  try {
    const tweets = await pool.query('SELECT * FROM tweets ORDER BY created_at DESC');
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tweets', details: error });
  }
};

