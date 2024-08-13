const express = require("express");
const router = express.Router();
const Reovirus = require("../models/reovirus");
const path = require('path');
const fs = require('fs');
const makeBlastdb = require('../blast/blastdb.js');
const runBlast = require('../blast/blast');
const runmuscle = require('../phy_analysis/MSA/muscle');
const runmafft = require('../phy_analysis/MSA/mafft');
const runclustalw = require('../phy_analysis/MSA/clustalw');
const runphyml = require('../phy_analysis/phylo/phyml');


const mongoose = require("mongoose");

router.route('/segment').get(async (req, res) => {

    const segment = req.segment
    try {
        const data = await Reovirus['reovirus_segments'].find({segment: segment});
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})

router.route('/blast').post(async(req, res) => {

    const id = Date.now()
    const segment_type = req.body.genome
    const seqtype = req.body.seqtype
    const seqtxt = req.body.seqtxt
    const word = req.body.word
    const target = req.body.target
    const evalue = req.body.evalue
    const program = req.body.program

    console.log(program)

    const segmentData = await Reovirus['reovirus_segments'].find({ segment: segment_type });
    let fastaData = '';
    segmentData.forEach(entry => {
            fastaData += `>${entry.original_id}\n${entry.nt_sequence}\n`;
        });

    const filedata = path.join(__dirname, `../blast/blastdb/${id}_${segment_type}.fa`);
    fs.writeFileSync(filedata, fastaData);

    const inputfile = path.join(__dirname,`../blast/blastdb/${id}.fa`)

    if (seqtxt !=''){
        fs.writeFileSync(inputfile, seqtxt)
    }

    const dbPath = await makeBlastdb(filedata, seqtype);

    const blastResult = await runBlast(id, inputfile, filedata, word, target, evalue, program);

    res.send(blastResult);
    
});



router.route('/phylo').post(async(req, res) => {

    const id = Date.now()
    const segment_type = req.body.genome
    const seqtype = req.body.seqtype
    const seqtxt = req.body.seqtxt
    const msatool = req.body.msatool
    const phylomethod = req.body.phylomethod

    console.log(msatool)
    console.log(phylomethod)

    const segmentData = await Reovirus['reovirus_segments'].find({ segment: segment_type });
    let fastaData = '';
    segmentData.forEach(entry => {
        fastaData += `>${entry.original_id}\n${entry.nt_sequence}\n`;
    });

    if (seqtxt.trim() !==''){
        const isMultiLine = seqtxt.includes('\n');
    
        if (isMultiLine) {
            const formatSeqtxt = seqtxt.trim().replace(/\r?\n/g, '\n');
            fastaData += `${formatSeqtxt}\n`;
        } else {
            fastaData += `${seqtxt}\n`;
        }
    }    

    const filedata = path.join(__dirname, `../phy_analysis/inputdata/${id}_${segment_type}.fa`);
    fs.writeFileSync(filedata, fastaData);

    let msaresults;
    switch (msatool) {
        case 'muscle':
            msaresults = await runmuscle(id, filedata);
            break;
        case 'mafft':
            msaresults = await runmafft(id, filedata);
            break;
        case 'clustalw':
            msaresults = await runclustalw(id, filedata);
            break;
    }

    const phyloResult = await runphyml(id, phylip_file);

    res.send(phyloResult);
    
});

module.exports = router;