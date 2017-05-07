class Optimizer {
    constructor() {
    }

    /**
     * Takes an imput script and optimizes it
     * @param script the script to optimize
     * @return string the processed script
     */
    optimize(script) {
        script = script.replace(/^\s*$/g, "");
        var outScript = (' ' + script).slice(1);
        var sequences = findSequences(script);;
        var offset = 0;
        for(var i = 0; i < sequences.length; i++) {
            var sequence = sequences[i];
            var parts = sequence;
            var value = parts.sequence;
            var idx = parts.index + offset;
            var repeats = parts.repeats;
            var loop = '\n' + value[0] + '\n'
                + "REPLAY " + repeats + '\n';
                                                                                                                    //trailing \n
            outScript = outScript.substring(0, idx) + loop + outScript.substring(idx + sequence.sequence.join("\n").length + 1);
            offset -= sequence.sequence.join("\n").length + 1;
            offset += loop.length;
        }
        outScript = outScript.replace(/^\s*[\r\n]/gm, ""); //This is hacky, but fixes an issue with blank lines caused by padding the loop.
        return outScript

    }

    /**
     * Finds all single-element long sequences.
     * I have a method for finding broader sequences, but need
     * to figure out the best way to put them into loops.
     * @param script the script to optimize
     * @return Array an array of sequences
     */
    findSequences(script) {
        var allSequences = [];
        var sequence = [];
        var lineArray = script.replace(/^\s*$/g, "").split(/\r?\n/);
        var startIdx = 0;
        var processedChars = 0;
        for(var i = 0; i < lineArray.length; i++) {
            //Previous element if possible, otherwise empty.
            var lastElem = i === 0 ? "" : lineArray[i - 1].trim();
            var curElem = lineArray[i].trim();
            //If the sequence is intact, add the current element to it.
            if((curElem === lastElem || sequence.length === 0)) {
                sequence.push(curElem);
                if(sequence.length === 1) {
                    startIdx = processedChars;
                }
                if(i + 1 >= lineArray.length) {
                    allSequences.push({
                        sequence: sequence, index: startIdx, repeats: sequence.length
                    });
                    sequence = [];

                }
            }
            //If we have a sequence that's broken and is large enough, parse it
            if(sequence.length >= 3 && curElem !== lastElem) {
                allSequences.push({
                    sequence: sequence, index: startIdx, repeats: sequence.length
                });
            }

            //Reset sequence if broken, regardless of size.
            if(lineArray[i] !== lastElem) {
                sequence = [];
                sequence.push(curElem);
                startIdx = processedChars;
            }
            //Increment character index, used for locating patterns
            processedChars += lineArray[i].length + 1;
        }
        return allSequences;
    }
}