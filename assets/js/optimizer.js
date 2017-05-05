class Optimizer {
    constructor(aggression) {
        this.aggression = aggression;
    }
    intersects(seqA, seqB) {
        var leftOne = seqA.index;
        var leftTwo = seqB.index;
        var rightOne = seqA.index + (seqA.repeats * seqA.sequence.length);
        var rightTwo = seqB.index + (seqB.repeats * seqB.sequence.length);
        return (leftOne < leftTwo && rightOne > leftOne)
            || (leftOne > leftTwo && rightOne > rightTwo)
            || (leftOne < leftTwo && rightOne > rightTwo)
            || (leftOne > leftTwo && rightOne < rightTwo)
    }
    optimize(script) {
        var outScript = (' ' + script).slice(1);
        var sequences = findSequences(script);
        console.log(sequences);
        var remove = [];
        //TODO: Instead of checking for collisions, nest loops.
        for(var i = 0; i < sequences.length; i++) {
            for(var j = 0; j < sequences.length; j++) {
                if(j === i || remove.indexOf(i) !== -1 || remove.indexOf(j) !== -1) {
                    console.log("continuing")
                    continue;
                }
                console.log(i + ":" + j)
                if(equivalent(sequences[i], sequences[j])) {
                    console.log(JSON.stringify(sequences[i]) + " intersects " + JSON.stringify(sequences[j]));
                    console.log(sequences[i].size)
                    console.log(sequences[j].size)
                    if(sequences[i].sequence[0].length > sequences[j].sequence[0].length) {
                        remove.push(j);
                    } else {
                        remove.push(i);
                    }
                }
            }

        }
        console.log("BEFORE");
        console.log(remove.length)
        console.log(JSON.stringify(sequences));
        for(var i = 0; i < remove.length; i++ ){
            console.log(remove[i])
            sequences.splice(remove[i], 1);
        }
        console.log("AFTER");
        console.log(JSON.stringify(sequences));
        for(var i = 0; i < sequences.length; i++) {
            var sequence = sequences[i];
            var parts = sequence;
            var value = parts.sequence;
            var idx = parts.index;
            var size = parts.size;
            var repeats = parts.repeats;
            var loop = "\nfor(int i = 0; i < " + repeats + "; i++) {\n"
                + value[0] + "\n"
                + "}\n";
            outScript = loop + outScript
        }
        return outScript;

    }
    findSequences(script) {
        var allSequences = [];
        var currentPass = [];
        var lineArray = script.split(/\r\n|\r|\n/);
        var sectionSize = Math.ceil(lineArray.length / 2)
        var sequence = [];
        for(sectionSize; sectionSize > 1; sectionSize--) {
            sectionSize = Math.round(sectionSize);
            for(var i = 0; i < lineArray.length; i += sectionSize) {
                if(lineArray[i] && lineArray[i].length === 0) {
                    continue;
                }
                var subArr = lineArray.slice(i, Math.min(i + sectionSize, lineArray.length));
                // for(var j = lineArray.length - 1; j < i + sectionSize; j++) {
                //   subArr.push("%END%")
                // }
                //Debugging:
                // currentPass.push(subArr.join("\\n") + ":" + i + ":" + sectionSize);
                currentPass.push({val: subArr.join("\n"), index: i, size: sectionSize});

            }
            for(var i = 0; i < currentPass.length; i++) {
                console.log(currentPass[i])
                var lastElem = i === 0 ? "" : currentPass[i - 1].val;
                if(currentPass[i].val === lastElem || sequence.length === 0) {
                    sequence.push(currentPass[i].val)
                } else {
                    if(sequence.length > 1) {
                        allSequences.push({
                            sequence: sequence,
                            index: currentPass[i].index,
                            size: currentPass[i].size,
                            repeats: sequence.length
                        });
                    }
                    sequence = [];
                    sequence.push(currentPass[i].val)
                }
            }
            if(sequence.length > 1) {
                allSequences.push({
                    sequence: sequence,
                    index: currentPass[currentPass.length - 1].index,
                    size: currentPass[currentPass.length - 1].size,
                    repeats: sequence.length
                });
            }
            sequence = [];
            currentPass = [];
        }
        return allSequences;
    }
}