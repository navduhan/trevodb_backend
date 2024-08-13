const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const runphyml = (id, phylip_file) => {

    console.log(phylip_file)

    execSync(`phyml -i${phylip_file} -o${path.join(__dirname, "msa_fa/", `${id}`)}`, { stdio: 'inherit' })

    console.log('Phylogenetic analysis is completed');
    return Promise.resolve('Phylogenetic analysis is completed');
}