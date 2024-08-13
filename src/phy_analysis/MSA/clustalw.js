const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const runclustalw = (id, fasta_file) => {

    console.log(fasta_file)

    execSync(`clustalw -INFILE=${fasta_file} -OUTFILE=${path.join(__dirname, "msa_fa/", `${id}_aligned`)} -OUTPUT=FASTA`, { stdio: 'inherit' })

    console.log('Alignment is successfully');
    return Promise.resolve('Alignment is successfully');
}

module.exports = runclustalw;