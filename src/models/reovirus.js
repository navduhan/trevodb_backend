const mongoose = require('mongoose')

const SegmentSchema = new mongoose.Schema({
    'internal_id': {type: String},
    'original_id': {type: String},
    'virus_type': {type: String},
    'seqgment': {type: String},
    'gene': {type:String},
    'date':{type:String},
    'year':{type:Number},
    'nt_length':{type:Number},
    'aa_length':{type:Number},
    'nt_sequence':{type:String},
    'aa_sequence':{type:String},
})

const Reovirus_Segments = mongoose.model('segments', SegmentSchema)

module.exports = {
    'reovirus_segments': Reovirus_Segments,
}