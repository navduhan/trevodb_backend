const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function parseBlastJSON (file){

    let results ={}

    // Get the hits from the JSON
    const hits = file.BlastOutput2.report.results.search.hits;
    const query = file.BlastOutput2.report.results.search.query_title;

    hits.forEach(hit => {


        const qlen = hit.len
        const hsp = hit.hsps[0];
        const hitDesc = hit.description[0]
        results['query_title']=query
        results['hitnum']= hit.num;
        results['hitDesc'] = hitDesc.accession; 
        results['hitTitle'] = hitDesc.title; 
        results['identity'] = hsp.identity;
        results['align_length'] = hsp.align_len;
        results['gaps'] = hsp.gaps
        results['mismatch']= hsp.align_len-hsp.identity-hsp.gaps;
        results['query_start'] = hsp.query_from;
        results['query_end'] = hsp.query_to;
        results['subject_start'] = hsp.hit_from;
        results['subject_end'] = hsp.hit_to;
        results['query_strand'] = hsp.query_strand;
        results['subject_strand'] = hsp.hit_strand;
        results['score'] = hsp.score;
        results['evalue'] = hsp.evalue;
        results['bit_score'] = hsp.bit_score;
        results['qseq']= hsp.qseq;
        results['sseq']= hsp.hseq;
        results['midline']= hsp.midline;


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
