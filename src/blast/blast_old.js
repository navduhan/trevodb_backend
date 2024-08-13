const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');


const runBlast = (id, inputfile, blastdb, word, target, evalue, program) => {

    console.log(inputfile);

    execSync(`${program} -db ${blastdb} -query ${inputfile} -max_target_seqs ${target} -word_size ${word} -evalue ${evalue} -num_threads 20 -outfmt 6 -out ${path.join(__dirname, `blastdb/pred${id}.out.xml`)}`, { stdio: 'inherit' })

    return new Promise((res, rej) => {

        const ampli = fs.readFileSync(path.join(__dirname,`blastdb/pred${id}.out.xml`), 'utf8');
        
        const cells = ampli.split('\n').map(function (el) { return el.split(/\s+/); });
        
        const headings = ['qseqid', 'sseqid', 'pident', 'length', 'mismatch', 'gapopen', 'qstart', 'qend', 'sstart', 'send', 'evalue', 'bitscore']
                      
        var objd = cells.filter(function (el) {
            return el != '';
        });
            
        console.log(objd)
            
        const obj = objd.map(function (el) {
            let obj = {};
            for (let i = 0, l = el.length; i < l; i++) {
                obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
            }
            return obj;
        });
            
        const jsondata = JSON.stringify(obj);
            
        res(jsondata);
    });

}

module.exports = runBlast;
