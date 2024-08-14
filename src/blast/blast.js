const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function parseBlastJSON (file){

    let results =[]

    // Get the hits from the JSON
    const hits = file.BlastOutput2.report.results.search.hits;
    const query = file.BlastOutput2.report.results.search.query_title;

    hits.forEach(hit => {
        
        let result={}

        const qlen = hit.len
        const hsp = hit.hsps[0];
        const hitDesc = hit.description[0]
        result['query_title']=query
        result['hitnum']= hit.num
        result['hitDesc'] = hitDesc.accession; 
        result['hitTitle'] = hitDesc.title; 
        result['identity'] = (hsp.identity/hsp.align_len*100).toFixed(2);
        result['align_length'] = hsp.align_len;
        result['gaps'] = hsp.gaps
        result['mismatch']= hsp.align_len-hsp.identity-hsp.gaps;
        result['query_start'] = hsp.query_from;
        result['query_end'] = hsp.query_to;
        result['subject_start'] = hsp.hit_from;
        result['subject_end'] = hsp.hit_to;
        result['query_strand'] = hsp.query_strand;
        result['subject_strand'] = hsp.hit_strand;
        result['score'] = hsp.score;
        result['evalue'] = hsp.evalue;
        result['bit_score'] = hsp.bit_score;
        result['qseq']= hsp.qseq;
        result['sseq']= hsp.hseq;
        result['midline']= hsp.midline;
        results.push(result)

    })

    return results


}

const runBlast = (id, inputfile, blastdb, word, target, evalue, program) => {

    console.log(inputfile);

    execSync(`${program} -db ${blastdb} -query ${inputfile} -max_target_seqs ${target} -word_size ${word} -evalue ${evalue} -num_threads 20 -outfmt 13 -out ${path.join(__dirname, `blastdb/pred${id}`)}`, { stdio: 'inherit' })

    return new Promise((res, rej) => {

        const blastdata = JSON.parse(fs.readFileSync(path.join(__dirname,`blastdb/pred${id}_1.json`), 'utf8'))
        // console.log(blastdata)
        const results = parseBlastJSON(blastdata)

      

        const jsondata = JSON.stringify(results);
        console.log(jsondata)
        res(jsondata)
    });

}

module.exports = runBlast;
