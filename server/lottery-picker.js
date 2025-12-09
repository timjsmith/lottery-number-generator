const aplhabetMap = {
    'a': 1,
    'b': 2,
    'c': 3,
    'd': 4,
    'e': 5,
    'f': 6,
    'g': 7,
    'h': 8,
    'i':9,
    'j':10,
    'k':11,
    'l':12,
    'm':13,
    'n':14,
    'o':15,
    'p':16,
    'q':17,
    'r':18,
    's':19,
    't':20,
    'u':21,
    'v':22,
    'w':23,
    'x':24,
    'y':25,
    'z':26
}

function getNumberValuesForString(someString=''){
    let totalStringNumber = 0
    const editString = someString.toLowerCase().split('')
    editString.forEach((val)=>{
        const charNumber = aplhabetMap[val]
        if(!isNaN(charNumber)){
            totalStringNumber = totalStringNumber + aplhabetMap[val]
        }
    })
    console.log(`Total for ${someString}: ${totalStringNumber}`)
    return totalStringNumber
}

function getNumberValuesFromStringArray(stringArray){
    let numberValue = 0
    stringArray.forEach(i=>{
        const val = getNumberValuesForString(i)
        numberValue += val
    })
    console.log('Total of all strings', numberValue)
    return numberValue
}

function getTotalOfPreviousWinning(numArray){
    let total = 0
    numArray.forEach(i =>  total = total + i)
    return total
}

function getRandomInt(max, min) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

function generateNumberArray(numberOfPicks, maxNumber){
    const results = []
    for(let i = 0; i < numberOfPicks; i++){
        results.push(getRandomInt(maxNumber, 1))
    }
    results.sort()
    return results
}

function generateLotteryPicks(regularPickTotal, regularPickMax, pbPickTotal, pbPickMax){
    const regResults = generateNumberArray(regularPickTotal, regularPickMax)
    const pbResults = generateNumberArray(pbPickTotal, pbPickMax)

    const results = {
        pickNumbers: regResults,
        pb: pbResults
    }
    return results
}

function createNumberObject(maxNumber = 0){
    let numObj = {}
    for(let i=0; i <= maxNumber; i++){
        numObj[i] = 0
    }
    return numObj
}

function getTopNKeysByValue(obj, n = 5) {
    return Object.entries(obj)
      .sort(([, valA], [, valB]) => valB - valA)
      .slice(0, n)
      .map(([key]) => parseInt(key))
      .sort((a, b) => a - b)
}

export function generateLotteryNumbers2(lastWinningNumbers=[], genStrings = [], regularPickTotal = 5, regularPickMax = 69, pbPickTotal = 1, pbPickMax =26, additionalGenTotal = 0){
    const startTime = Date.now()

    let numberResults = []
    let pbResults = []
    console.log("regularPickTotal:", regularPickTotal)
    console.log("regularPickMax:", regularPickMax)
    console.log("pbPickMax:", pbPickMax)

    const stringNumber = getNumberValuesFromStringArray(genStrings)
    const winningLastNumbers = getTotalOfPreviousWinning(lastWinningNumbers)

    const total = winningLastNumbers + stringNumber + additionalGenTotal
    console.log(`Total times to run based on calculations: ${total}`)

    const logInterval = Math.max(1, Math.floor(total / 100))
    console.log(`Will log progress every ${logInterval} iterations`)

    let tallyObject = {
        mainPicks: createNumberObject(regularPickMax),
        pbPicks: createNumberObject(pbPickMax)
    }

    for(let i = 0; i < total; i++){
        if(((i+1) % logInterval) === 0){
            const progress = ((i+1) / total * 100).toFixed(1)
            console.log(`Progress: ${progress}% - Iteration ${i+1} of ${total}`)
        }
        const picks = generateLotteryPicks(regularPickTotal, regularPickMax, pbPickTotal, pbPickMax)
        picks.pickNumbers.forEach((i)=>{
            tallyObject.mainPicks[i]++
        })
        picks.pb.forEach((i)=>{
            tallyObject.pbPicks[i]++
        })
    }

    const winningPicksObj = {
        mainPicks: getTopNKeysByValue(tallyObject.mainPicks, regularPickTotal),
        pbPicks: getTopNKeysByValue(tallyObject.pbPicks, pbPickTotal)
    }

    const endTime = Date.now()
    const timeElapsed = endTime - startTime
    const timeInSeconds = (timeElapsed / 1000).toFixed(2)

    console.log('Your winning numbers are: ')
    console.log(`${winningPicksObj.mainPicks}:${winningPicksObj.pbPicks}`)
    console.log(`Total iterations: ${total}`)
    console.log(`Time elapsed: ${timeInSeconds}s`)

    return {
        winingNumbers: winningPicksObj.mainPicks,
        winningPB: winningPicksObj.pbPicks,
        totalIterations: total,
        timeElapsedMs: timeElapsed,
        timeElapsedSeconds: parseFloat(timeInSeconds)
    }
}
