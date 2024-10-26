"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twitterController_1 = require("../controllers/twitterController");
const router = (0, express_1.Router)();
router.post('/tweet', twitterController_1.postTweet);
router.get('/tweets', twitterController_1.getTweets);
exports.default = router;
