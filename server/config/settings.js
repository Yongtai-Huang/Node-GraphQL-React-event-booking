'use strict';

module.exports = {
  // Used to generate and verify jwt
  SECRET: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'NoOneKnowsIKnowButIDonnotTellYou',
};
