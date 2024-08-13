const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const makeBlastdb = (filedata, seqtype) => {
    
    execSync(`makeblastdb -in "${filedata}" -dbtype ${seqtype}`, { stdio: 'inherit' });

    console.log('Blast database is created successfully');
    return Promise.resolve('Blast database is created successfully');
}

module.exports = makeBlastdb;