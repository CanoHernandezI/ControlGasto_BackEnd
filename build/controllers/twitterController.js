"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweets = exports.postTweet = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
const keys_1 = __importDefault(require("../keys"));
const database_1 = __importDefault(require("../database"));
const client = new twitter_api_v2_1.TwitterApi({
    appKey: keys_1.default.twitterConfig.apiKey,
    appSecret: keys_1.default.twitterConfig.apiSecretKey,
    accessToken: keys_1.default.twitterConfig.accessToken,
    accessSecret: keys_1.default.twitterConfig.accessTokenSecret,
});
const postTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const tweet = yield client.v2.tweet(status);
        const tweetText = tweet.data.text;
        const tweetId = tweet.data.id;
        yield database_1.default.query('INSERT INTO tweets (tweet_id, tweet_text) VALUES (?, ?)', [tweetId, tweetText]);
        res.json({ message: 'Tweet posted and saved successfully', tweet });
    }
    catch (error) {
        res.status(500).json({ error: 'Error posting tweet', details: error });
    }
});
exports.postTweet = postTweet;
const getTweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweets = yield database_1.default.query('SELECT * FROM tweets ORDER BY created_at DESC');
        res.json(tweets);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching tweets', details: error });
    }
});
exports.getTweets = getTweets;
