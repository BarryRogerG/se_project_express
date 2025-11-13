const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const ownerId = '5d8b8592978f8bd833ca8133';
const items = [
  {
    name: 'Light Jacket',
    weather: 'cold',
    imageUrl: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png',
