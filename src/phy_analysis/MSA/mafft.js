const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const runmafft = (id, fasta_file) => {

    console.log(fasta_file)

    execSync(`mafft in${fasta_file} > out${path.join(__dirname, "msa_fa/", `${id}_aligned.fasta`)}`, { stdio: 'inherit' })

    console.log('Alignment is successfully');
    return Promise.resolve('Alignment is successfully');
}

module.exports = runmafft;