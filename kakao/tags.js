const tags = {
  "순siri, 아무거나 추천해봐": { includes: [], excepts: [] },
  "순siri, 점심메뉴 골라줘": { includes: ['lunch'], excepts: ['expenssive'] },
  "순siri, 점심메뉴 싼 걸로 골라줘": { includes: ['lunch', 'cheap'], excepts: [] },
  "순siri, 저녁메뉴 골라줘": { includes: ['dinner'], excepts: ['expenssive'] },
  "순siri, 저녁메뉴 싼 걸로 골라줘": { includes: ['dinner', 'cheap'], excepts: [] },
  "순siri, 다음 어디 갈래?": { includes: ['night', 'alcohol'], excepts: ['expenssive'] },
  "순siri, 소주 먹고 싶어": { includes: ['soju'], excepts: ['expenssive'] },
  "순siri, 맥주 먹고 싶어": { includes: ['beer'], excepts: ['expenssive'] },
  "순siri, 막걸리 먹고 싶어": { includes: ['makgeolli'], excepts: ['expenssive'] },
  "순siri, 나 월급날이야": { includes: ['expenssive'] }
}

module.exports = tags
