const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const runmuscle = (id, fasta_file) => {

    console.log(fasta_file)

    execSync(`muscle -in${fasta_file} -out${path.join(__dirname, "msa_fa/", `${id}_aligned.fasta`)}`, { stdio: 'inherit' })

    console.log('Alignment is successfully');
    return Promise.resolve('Alignment is successfully');
}

module.exports = runmuscle;